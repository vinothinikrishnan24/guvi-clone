import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PlaylistContext = createContext();

const PlaylistContextProvider = (props) => {
  const [playlists, setPlaylists] = useState([]);
  const url = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:4000';

  const createPlaylist = async (name, desc) => {
    try {
      const response = await axios.post(`${url}/api/playlist/add`, { name, desc });
      if (response.data.success) {
        setPlaylists([...playlists, response.data.playlist]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return false;
    }
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const response = await axios.post(`${url}/api/playlist/add-song`, { playlistId, songId });
      if (response.data.success) {
        setPlaylists(
          playlists.map((playlist) =>
            playlist._id === playlistId ? response.data.playlist : playlist
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      return false;
    }
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const response = await axios.post(`${url}/api/playlist/remove-song`, { playlistId, songId });
      if (response.data.success) {
        setPlaylists(
          playlists.map((playlist) =>
            playlist._id === playlistId ? response.data.playlist : playlist
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      return false;
    }
  };

  const getPlaylists = async () => {
    try {
      const response = await axios.get(`${url}/api/playlist/list`);
      if (response.data.success) {
        setPlaylists(response.data.playlists);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  const contextValue = {
    playlists,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  };

  return (
    <PlaylistContext.Provider value={contextValue}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContextProvider;