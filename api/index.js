import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = require('../server/server.cjs');

export default app;
