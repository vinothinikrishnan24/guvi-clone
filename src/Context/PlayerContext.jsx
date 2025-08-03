import { useEffect, useRef, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { albumsList, songsList } from "../assets/assets";

export const PlayerContext = createContext();
const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const url = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:4000';
  const [songsData, setSongsData] = useState([]);

  const [albumsData, setAlbumsData] = useState([]);

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isShuffled, setIsShuffled] = useState(false);
  const [loopMode, setLoopMode] = useState("off"); // off, song, playlist
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };
  const playWithId = async (id) => {
    await songsData.map((item) => {
      if (id === item._id) {
        setTrack(item);
      }
    });

    await audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    if (!track || !songsData.length) return;
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songsData.length);
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : songsData.length - 1;
    }
    if (loopMode === "playlist" && currentIndex === 0) {
      nextIndex = songsData.length - 1;
    }
    if (loopMode === "song") {
      nextIndex = currentIndex;
    }
    await playWithId(songsData[nextIndex]._id);
  };

  const next = async () => {
    if (!track || !songsData.length) return;
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songsData.length);
    } else {
      nextIndex = currentIndex < songsData.length - 1 ? currentIndex + 1 : 0;
    }
    if (loopMode === "playlist" && currentIndex === songsData.length - 1) {
      nextIndex = 0;
    }
    if (loopMode === "song") {
      nextIndex = currentIndex;
    }
    await playWithId(songsData[nextIndex]._id);
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;

  };

  const setVolumeLevel = (value) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };

  const toggleLoop = () => {
    setLoopMode((prev) =>
      prev === "off" ? "song" : prev === "song" ? "playlist" : "off"
    );
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      const data =
        response?.data?.songs.length > 0 ? response?.data?.songs : songsList;
      setSongsData(data);
      setTrack(response?.data?.songs[0] || assets.songsData[0]);
    } catch (error) {}
  };
  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      const data =
        response?.data?.albums.length > 0 ? response?.data?.albums : albumsList;
      setAlbumsData(data);
    } catch (error) {}
  };

  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.onloadedmetadata = () => {
      const seconds = Math.floor(audioRef.current.duration || 0);
      setTime({
        currentTime: { second: 0, minute: 0 },
        totalTime: {
          second: Math.floor(seconds % 60),
          minute: Math.floor(seconds / 60),
        },
      });
      seekBar.current.style.width = "0%";
    };
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";
      const seconds = Math.floor(audioRef.current.currentTime);
        setTime({
          currentTime: {
          second: Math.floor(seconds % 60),
          minute: Math.floor(seconds / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
      audioRef.current.onended = () => {
      if (loopMode === "song") {
        audioRef.current.play();
      } else {
        next();
      }
    };
    }, 1000);
  }, [audioRef, track, volume, loopMode]);

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
    volume,
    setVolume: setVolumeLevel,
    isShuffled,
    toggleShuffle,
    loopMode,
    toggleLoop,
  };
  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};
export default PlayerContextProvider;
