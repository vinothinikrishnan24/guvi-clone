import React, { useContext, useState } from "react";
import { PlaylistContext } from "../Context/PlaylistContext";
import { PlayerContext } from "../Context/PlayerContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const DisplayPlaylists = () => {
  const { playlists, createPlaylist } = useContext(PlaylistContext);
  const { songsData } = useContext(PlayerContext);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!name || !desc) {
      toast.error("Please enter playlist name and description");
      return;
    }
    const success = await createPlaylist(name, desc);
    if (success) {
      toast.success("Playlist created");
      setName("");
      setDesc("");
    } else {
      toast.error("Failed to create playlist");
    }
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Your Playlists</h1>
        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 text-white rounded px-4 py-2 w-[max(20vw,200px)]"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="bg-gray-800 text-white rounded px-4 py-2 w-[max(20vw,200px)]"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer w-[max(20vw,200px)]"
          >
            Create Playlist
          </button>
        </form>
        <div className="flex overflow-auto gap-4">
          {playlists?.map((playlist) => (
            <Link to={`/playlist/${playlist._id}`} key={playlist._id}>
              <div className="bg-gray-800 p-4 rounded w-48">
                <h3 className="text-white font-bold">{playlist.name}</h3>
                <p className="text-gray-400">{playlist.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayPlaylists;