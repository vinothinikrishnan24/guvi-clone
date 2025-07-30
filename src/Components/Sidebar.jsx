import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 pl-8 cursor-pointer"
        >
          <img className="w-6" src={assets.home_icon} alt="Home" />
          <p className="font-bold">HOME</p>
        </div>
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 pl-8 cursor-pointer"
        >
          <img className="w-6" src={assets.search_icon} alt="Search" />
          <p className="font-bold">SEARCH</p>
        </div>
      </div>
      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="Library" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-5" src={assets.arrow_icon} alt="Arrow" />
            <img
              onClick={() => navigate("/playlists")}
              className="w-5 cursor-pointer"
              src={assets.plus_icon}
              alt="Add Playlist"
            />
          </div>
        </div>
        <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
          <h1>Create your First Playlist</h1>
          <p className="font-light">It's Easy We will Help You</p>
          <button
            onClick={() => navigate("/playlists")}
            className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 cursor-pointer"
          >
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;