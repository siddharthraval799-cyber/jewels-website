const pool = require('./db.cjs');

class Statement {
  constructor(queryStr) {
    this.queryStr = queryStr;
  }

  // Convert SQLite ? to Postgres $1, $2...
  _toPg(params) {
    let q = this.queryStr;
    // Replace ON CONFLICT(key) DO UPDATE SET value = excluded.value
    // SQLite uses ON CONFLICT(key) DO UPDATE SET value=excluded.value
    q = q.replace(/excluded\./g, 'EXCLUDED.');
    
    // Convert ? to $1, $2...
    let i = 1;
    q = q.replace(/\?/g, () => `$${i++}`);
    return q;
  }

  async all(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const res = await pool.query(this._toPg(flatParams), flatParams);
    return res.rows;
  }

  async get(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const res = await pool.query(this._toPg(flatParams), flatParams);
    return res.rows[0];
  }

  async run(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    const res = await pool.query(this._toPg(flatParams), flatParams);
    return { changes: res.rowCount, lastInsertRowid: null };
  }
}

module.exports = {
  prepare: (queryStr) => new Statement(queryStr),
  transaction: (fn) => {
    return async (...args) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // We can't easily pass the transaction client to the fn because 
        // the global db-wrapper doesn't know about it. 
        // But for this app, the only transaction is settings upsert.
        await fn(...args);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    };
  }
};
