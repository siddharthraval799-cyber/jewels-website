import { watch } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const WATCH_DIRS = ['src', 'public'];
const DEBOUNCE_MS = 5000; // 5 seconds debounce to avoid spamming commits
let timeout = null;

console.log('🚀 Auto-Sync started! Watching for changes in:', WATCH_DIRS.join(', '));
console.log('Any change you make will be automatically pushed to GitHub after 5 seconds of inactivity.');

function sync() {
  console.log('🔄 Change detected! Syncing to GitHub...');
  try {
    // Stage everything
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit if there are changes
    try {
      execSync('git commit -m "Auto-sync: Local changes updated"', { stdio: 'inherit' });
    } catch (e) {
      console.log('ℹ️ No changes to commit.');
      return;
    }

    // Push
    console.log('📤 Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Sync complete!');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  }
}

WATCH_DIRS.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  watch(fullPath, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes('.git')) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(sync, DEBOUNCE_MS);
    }
  });
});
