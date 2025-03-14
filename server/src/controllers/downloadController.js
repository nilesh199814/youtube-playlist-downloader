const { downloadPlaylist } = require('../services/youtubeService');
const { ensureDownloadDir } = require('../utils/fileUtils');

const downloadPlaylistHandler = async (req, res) => {
  const { playlistUrl } = req.body;

  if (!playlistUrl) {
    return res.status(400).json({ error: 'Invalid playlist URL' });
  }

  try {
    const downloadDir = await ensureDownloadDir();
    const videoCount = await downloadPlaylist(playlistUrl, downloadDir);
    res.json({ message: 'Playlist downloaded successfully as MP3', count: videoCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download playlist' });
  }
};

module.exports = { downloadPlaylistHandler };