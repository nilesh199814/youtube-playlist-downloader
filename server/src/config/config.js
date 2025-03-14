require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || 'development',
  downloadDir: process.env.DOWNLOAD_DIR || './downloads',
};