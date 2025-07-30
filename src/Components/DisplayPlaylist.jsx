import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlaylistContext } from "../Context/PlaylistContext";
import { PlayerContext } from "../Context/PlayerContext";
import NavBar from "./NavBar";
import { toast } from "react-toastify";

const DisplayPlaylist = () => {
  const { id } = useParams();
  const { playlists, addSongToPlaylist, removeSongFromPlaylist } = useContext(PlaylistContext);
  const { songsData, playWithId } = useContext(PlayerContext);
  const [playlist, setPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState("");

  useEffect(() => {
    const foundPlaylist = playlists.find((item) => item._id === id);
    setPlaylist(foundPlaylist);
  }, [id, playlists]);

  const handleAddSong = async () => {
    if (!selectedSong) {
      toast.error("Please select a song");
      return;
    }
    const success = await addSongToPlaylist(id, selectedSong);
    if (success) {
      toast.success("Song added to playlist");
      setSelectedSong("");
    } else {
      toast.error("Failed to add song");
    }
  };

  const handleRemoveSong = async (songId) => {
    const success = await removeSongFromPlaylist(id, songId);
    if (success) {
      toast.success("Song removed from playlist");
    } else {
      toast.error("Failed to remove song");
    }
  };

  if (!playlist) {
    return (
      <>
        <NavBar />
        <div className="mt-10">
          <p>Playlist not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <div className="flex flex-col">
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{playlist.name}</h2>
          <h4>{playlist.desc}</h4>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <select
          value={selectedSong}
          onChange={(e) => setSelectedSong(e.target.value)}
          className="bg-gray-800 text-white rounded px-4 py-2"
        >
          <option value="">Select a song</option>
          {songsData.map((song) => (
            <option key={song._id} value={song._id}>
              {song.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddSong}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add Song
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <p>Actions</p>
      </div>
      <hr />
      {playlist.songs.map((songId, index) => {
        const song = songsData.find((s) => s._id === songId?._id);
        if (!song) return null;
        return (
          <div
            key={song._id}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff26] cursor-pointer"
          >
            <p className="text-white" onClick={() => playWithId(song._id)}>
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-5" src={song.image} alt={song.name} />
              {song.name}
            </p>
            <p className="text-[15px]">{song.album || "None"}</p>
            <p className="text-[15px] hidden sm:block">5 days ago</p>
            <button
              onClick={() => handleRemoveSong(song._id)}
              className="text-[15px] text-red-500"
            >
              Remove
            </button>
          </div>
        );
      })}
    </>
  );
};

export default DisplayPlaylist;