import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../Context/PlayerContext";

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
    volume,
    setVolume,
    isShuffled,
    toggleShuffle,
    loopMode,
    toggleLoop,
  } = useContext(PlayerContext);

  const loopIcon =
    loopMode === "song"
      ? assets.loop_song_icon || assets.loop_icon
      : loopMode === "playlist"
      ? assets.loop_playlist_icon || assets.loop_icon
      : assets.loop_icon;

  return track ? (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={track.image} alt={track.name} />
        <div>
          <p>{track.name}</p>
          <p>{track.artist || track.desc.slice(0, 12)}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <div className="relative">
            <img
              onClick={toggleShuffle}
              className={`w-4 cursor-pointer ${
                isShuffled ? "text-green-500" : "text-white"
              } hover:text-green-400`}
              src={isShuffled ? assets.shuffle_active_icon || assets.shuffle_icon : assets.shuffle_icon}
              alt="Shuffle"
            />
            {isShuffled && (
              <span className="absolute top-[-0.5px] left-[18px] text-xs text-green-500">•</span>
            )}
          </div>
          <img
            onClick={previous}
            className="w-4 cursor-pointer hover:text-green-400"
            src={assets.prev_icon}
            alt="Previous"
          />
          {playStatus ? (
            <img
              onClick={pause}
              className="w-4 cursor-pointer hover:text-green-400"
              src={assets.pause_icon}
              alt="Pause"
            />
          ) : (
            <img
              onClick={play}
              className="w-4 cursor-pointer hover:text-green-400"
              src={assets.play_icon}
              alt="Play"
            />
          )}
          <img
            onClick={next}
            className="w-4 cursor-pointer hover:text-green-400"
            src={assets.next_icon}
            alt="Next"
          />
          <div className="relative">
            <img
              onClick={toggleLoop}
              className={`w-4 cursor-pointer ${
                loopMode !== "off" ? "text-green-500" : "text-white"
              } hover:text-green-400`}
              src={loopIcon}
              alt={`Loop ${loopMode}`}
            />
            {loopMode === "song" && (
              <span className="absolute -top-1 -right-1 text-xs text-green-500">1</span>
            )}
            {loopMode === "playlist" && (
              <span className="absolute -top-1 -right-1 text-xs text-green-500">∞</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <p>
            {String(time.currentTime.minute).padStart(2, "0")}:
            {String(time.currentTime.second).padStart(2, "0")}
          </p>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none bg-green-800 rounded-full"
            />
          </div>
          <p>
            {String(time.totalTime.minute).padStart(2, "0")}:
            {String(time.totalTime.second).padStart(2, "0")}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2 opacity-75">
        <img className="w-4" src={assets.plays_icon} alt="Plays" />
        <img className="w-4" src={assets.mic_icon} alt="Mic" />
        <img className="w-4" src={assets.queue_icon} alt="Queue" />
        <img className="w-4" src={assets.speaker_icon} alt="Speaker" />
        <img className="w-4" src={assets.volume_icon} alt="Volume" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-slate-50 rounded cursor-pointer accent-green-600"
        />
        <img className="w-4" src={assets.mini_player_icon} alt="Mini Player" />
        <img className="w-4" src={assets.zoom_icon} alt="Zoom" />
      </div>
    </div>
  ) : null;
};

export default Player;