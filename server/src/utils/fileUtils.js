const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');

const ensureDownloadDir = async () => {
  const dir = path.resolve(config.downloadDir);
  if (!await fs.stat(dir).catch(() => false)) {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
};

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9]/g, '_');
};

module.exports = { ensureDownloadDir, sanitizeFilename };