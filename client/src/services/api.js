import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'http://127.0.0.1:4000'; // Direct to server
export const downloadPlaylist = async (playlistUrl) => {
  const response = await axios.post(`${API_URL}/api/download-playlist`, { playlistUrl });
  return response.data;
};