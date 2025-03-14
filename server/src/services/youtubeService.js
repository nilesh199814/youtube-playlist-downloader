// const ytdl = require('ytdl-core');
const ytdl = require('@distube/ytdl-core');
const ytsr = require('ytsr');
const ffmpeg = require('fluent-ffmpeg');
const UserAgent = require('user-agents');
const fs = require('fs');
const path = require('path');
const { sanitizeFilename } = require('../utils/fileUtils');

const getRandomUserAgent = () => new UserAgent().toString();

const downloadAndConvert = async (videoUrl, index, title, downloadDir) => {
  const sanitizedTitle = sanitizeFilename(title);
  const tempPath = path.join(downloadDir, `temp_${sanitizedTitle}.mp4`);
  const mp3Path = path.join(downloadDir, `${index + 1}_${sanitizedTitle}.mp3`);

  const stream = ytdl(videoUrl, {
    quality: 'highestaudio',
    requestOptions: { headers: { 'User-Agent': getRandomUserAgent() } },
  });

  await new Promise((resolve, reject) => {
    stream.pipe(fs.createWriteStream(tempPath))
      .on('finish', resolve)
      .on('error', reject);
  });

  await new Promise((resolve, reject) => {
    ffmpeg(tempPath)
      .noVideo()
      .audioCodec('mp3')
      .on('end', () => fs.unlink(tempPath, resolve))
      .on('error', reject)
      .save(mp3Path);
  });
};

const downloadPlaylist = async (playlistUrl, downloadDir) => {
  try {
    const urlObj = new URL(playlistUrl);
    const playlistId = urlObj.searchParams.get('list');
    const videoId = urlObj.searchParams.get('v');

    let videos = [];

    if (playlistId) {
      // Handle playlist URL
      console.log(`Fetching playlist with ID: ${playlistId}`);
      const playlist = await ytdl.getPlaylist(playlistUrl, {
        requestOptions: { headers: { 'User-Agent': getRandomUserAgent() } },
      });
      videos = playlist.videos.map(video => ({
        url: `https://www.youtube.com/watch?v=${video.videoId}`,
        title: video.title || `Video_${video.videoId}`,
      }));
    } else if (videoId) {
      // Handle single video URL
      console.log(`Fetching single video with ID: ${videoId}`);
      const info = await ytdl.getInfo(playlistUrl, {
        requestOptions: { headers: { 'User-Agent': getRandomUserAgent() } },
      });
      videos = [{
        url: playlistUrl,
        title: info.videoDetails.title || `Video_${videoId}`,
      }];
    } else {
      throw new Error('Invalid URL: No playlist or video ID found');
    }

    if (!videos || videos.length === 0) throw new Error('No videos found');

    for (let i = 0; i < videos.length; i++) {
      await downloadAndConvert(videos[i].url, i, videos[i].title, downloadDir);
      if (i < videos.length - 1) { // Delay only between downloads, not after the last one
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
      }
    }

    return videos.length;
  } catch (error) {
    console.error('Download error:', error.message);
    throw error;
  }
};

module.exports = { downloadPlaylist };