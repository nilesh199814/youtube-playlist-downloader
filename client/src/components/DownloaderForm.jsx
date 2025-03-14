import React, { useState } from 'react';
import { downloadPlaylist } from '../services/api';

function DownloaderForm() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await downloadPlaylist(playlistUrl);
      setStatus(`Success! Downloaded ${response.count} MP3 files`);
    } catch (error) {
      setStatus(error.response?.data?.error || 'Error: Failed to download playlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={playlistUrl}
        onChange={(e) => setPlaylistUrl(e.target.value)}
        placeholder="Enter YouTube playlist URL"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Downloading...' : 'Download Playlist'}
      </button>
      {status && <p className={`status ${status.includes('Success') ? 'success' : 'error'}`}>{status}</p>}
    </form>
  );
}

export default DownloaderForm;