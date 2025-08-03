import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { PlayerContext } from "../Context/PlayerContext";
import NavBar from "./NavBar";
import axios from "axios";
import { toast } from "react-toastify";

const DisplayAlbum = () => {
  const { id } = useParams();
  const { playWithId, albumsData, songsData } = useContext(PlayerContext);
  const [albumData, setAlbumData] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const url = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const album = albumsData.find((item) => item._id.toString() === id);
    setAlbumData(album || null);
    // Fetch likes and comments
    const fetchInteractions = async () => {
      try {
        const response = await axios.get(`${url}/api/album/interactions/${id}`);
        if (response.data.success) {
          setLikes(response.data.likes);
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };
    fetchInteractions();
  }, [id, albumsData]);

const handleDownload = async (songUrl, songName) => {
  try {
    const response = await fetch(songUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${songName}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  const handleLike = async () => {
    try {
      const response = await axios.post(`${url}/api/album/like`, { albumId: id });
      if (response.data.success) {
        setLikes(response.data.likes);
        toast.success("Album liked!");
      }
    } catch (error) {
      toast.error("Error liking album");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      const response = await axios.post(`${url}/api/album/comment`, {
        albumId: id,
        comment: newComment,
      });
      if (response.data.success) {
        setComments([...comments, { text: newComment, user: "User" }]);
        setNewComment("");
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  const shareToSocial = (platform) => {
    const shareUrl = window.location.href;
    let url;
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this album!`;
        break;
      case "instagram":
        url = `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  if (!albumData) {
    return (
      <>
        <NavBar />
        <div className="mt-10">
          <p>Album not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={albumData.image} alt={albumData.name} />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumData.name}</h2>
          <h4>{albumData.desc}</h4>
          <p className="mt-1">
            <img className="inline-block w-5" src={assets.spotify_logo} alt="Spotify logo" />
            <b>Spotify</b> • {likes.toLocaleString()} likes • <b>50 songs,</b> about 2 hr 30 min
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleLike}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Like ({likes})
            </button>
            <button
              onClick={() => shareToSocial("facebook")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Share on Facebook
            </button>
            <button
              onClick={() => shareToSocial("twitter")}
              className="bg-blue-400 text-white px-4 py-2 rounded"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => shareToSocial("instagram")}
              className="bg-pink-600 text-white px-4 py-2 rounded"
            >
              Share on Instagram
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <form onSubmit={handleComment} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="bg-gray-800 text-white rounded px-4 py-2 w-[max(20vw,200px)]"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Comment
          </button>
        </form>
        <div className="mt-2">
          {comments.map((comment, index) => (
            <p key={index} className="text-gray-400">
              <b>{comment.user}:</b> {comment.text}
            </p>
          ))}
        </div>
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
      {songsData
        .filter((item) => item.album === albumData.name)
        .map((item, index) => (
          <div
            key={item._id}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff26] cursor-pointer"
          >
            <p className="text-white" onClick={() => playWithId(item._id)}>
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-5" src={item.image} alt={item.name} />
              {item.name}
            </p>
            <p className="text-[15px]">{albumData.name}</p>
            <p className="text-[15px] hidden sm:block">5 days ago</p>
            <button
              onClick={() => handleDownload(item.file, item.name)}
              className="text-[15px] text-blue-500"
            >
              Download
            </button>
          </div>
        ))}
    </>
  );
};

export default DisplayAlbum;