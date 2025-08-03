import React, { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../Context/PlayerContext";
import { assets } from "../assets/assets";
import axios from "axios";
import NavBar from "./NavBar";
import AlbumItem from "./AlbumItem";
import { toast } from "react-toastify";

const SearchPage = () => {
  const { playWithId } = useContext(PlayerContext);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const url = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setFilteredSongs([]);
        setFilteredAlbums([]);
        return;
      }
      try {
        const songResponse = await axios.get(`${url}/api/song/search`, {
          params: { query, filterType },
        });
        const albumResponse = await axios.get(`${url}/api/album/search`, {
          params: { query, filterType },
        });
        if (songResponse.data.success) {
          setFilteredSongs(songResponse.data.songs);
        } else {
          toast.error("Failed to fetch songs");
        }
        if (albumResponse.data.success) {
          setFilteredAlbums(albumResponse.data.albums);
        } else {
          toast.error("Failed to fetch albums");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Search error occurred");
      }
    };
    fetchSearchResults();
  }, [query, filterType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Triggered by useEffect, no additional action needed
  };

  return (
    <div className="p-4 text-white">
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="name">Title</option>
            <option value="album">Album</option>
            <option value="artist">Artist</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs or albums..."
            className="flex-1 bg-gray-900 border-gray-700 text-white rounded px-4 py-2 outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            <img src={assets.search_icon} alt="Search" className="h-5 w-5" />
          </button>
        </form>
      </div>
      {query && (
        <>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Songs</h1>
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <h4 className="text-sm font-semibold">{song.name}</h4>
                      <p className="text-xs text-gray-400">{song.artist || song.desc}</p>
                    </div>
                    <button
                      onClick={() => playWithId(song._id)}
                      className="ml-auto bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Play
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No songs found</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Albums</h1>
            <div className="flex overflow-auto gap-4">
              {filteredAlbums.length > 0 ? (
                filteredAlbums.map((item, index) => (
                  <AlbumItem
                    key={index}
                    name={item.name}
                    desc={item.desc}
                    id={item._id}
                    image={item.image}
                  />
                ))
              ) : (
                <p className="text-gray-400">No albums found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;