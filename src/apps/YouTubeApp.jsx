// src/apps/YouTubeApp.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./YouTubeApp.css";
import {
  FaYoutube,
  FaSearch,
  FaPlay,
  FaPause,
  FaForward,
  FaTrashAlt,
} from "react-icons/fa";

/* 제목에 있는 HTML 요소들 제거 */
function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

export default function YouTubeApp({ width, height, onResize }) {

  const [mode, setMode] = useState("search");       // "search" | "playlist" | "player"
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);     // { id, title, thumb }[]
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const originalHeightRef = useRef(height);

  /* 플레이어 모드 탈출 시 파괴 (안하면 오류남) 
  -> 나중에 검색 중에도 재생되도록 변경 */
  const exitPlayerMode = (nextMode) => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
      }
      playerRef.current = null;
    }
    setCurrentVideoId(null);
    setIsPlaying(false);
    setMode(nextMode);
  };

  /* 검색 관련 */
  const handleSearch = async (query) => {
    try {
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 12,
            key: API_KEY,
          },
        }
      );
      setSearchResults(res.data.items);
    } catch (err) {
      console.error("YouTube 검색 오류:", err);
    }
  };


  const handleSelectVideo = (videoId) => {
    const item = searchResults.find((i) => i.id.videoId === videoId);
    if (!item) return;

    const cleanTitle = decodeHtmlEntities(item.snippet.title);
    const thumbUrl = item.snippet.thumbnails.default.url;

    setPlaylist((prev) =>
      prev.some((p) => p.id === videoId)
        ? prev
        : [...prev, { id: videoId, title: cleanTitle, thumb: thumbUrl }]
    );
    setMode("playlist");
  };

  /* Queue 삭제만 일단 구현 */
  const handleRemoveFromQueue = (videoId) => {
    setPlaylist((prev) => prev.filter((p) => p.id !== videoId));

    if (currentVideoId === videoId) {
      const idx = playlist.findIndex((p) => p.id === videoId);
      if (idx >= 0 && idx < playlist.length - 1) {
        setCurrentVideoId(playlist[idx + 1].id);
        setMode("player");
      } else {
        // queue 비면 종료
        exitPlayerMode("playlist");
      }
    }
  };


  /* Player 생성 */
  useEffect(() => {
    if (mode !== "player" || !currentVideoId) {
      return;
    }

    // YT 스크립트 없으면 삽입
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // API 로드 이후 콜백
    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        width: "100%",
        height: "100%",
        videoId: currentVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              e.data === window.YT.PlayerState.PAUSED ||
              e.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }

            // 끝나면 다음 곡 넘기기기
            if (e.data === window.YT.PlayerState.ENDED) {
              handleVideoEnd();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    // clean -> 안하면 에러 발생생
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
        }
        playerRef.current = null;
      }
      setIsPlaying(false);
    };
  }, [mode, currentVideoId]);


  const handleVideoEnd = () => {
    const idx = playlist.findIndex((p) => p.id === currentVideoId);
    if (idx >= 0 && idx < playlist.length - 1) {
      setCurrentVideoId(playlist[idx + 1].id);
    } else {
      // 종료 시
      exitPlayerMode("playlist");
    }
  };

  /* progress bar */
  useEffect(() => {
    if (!playerRef.current) return;
    const intervalId = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getDuration) return;
      const dur = p.getDuration();
      const now = p.getCurrentTime();
      if (dur > 0) {
        setProgressPercent((now / dur) * 100);
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, [currentVideoId, mode]);

  const togglePlayPause = () => {
    const p = playerRef.current;
    if (!p?.getPlayerState || !window.YT?.PlayerState) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  };

  const skipNext = () => {
    const idx = playlist.findIndex((p) => p.id === currentVideoId);
    if (idx >= 0 && idx < playlist.length - 1) {
      setCurrentVideoId(playlist[idx + 1].id);
    }
  };

  /* 플레이어 모드 진입 시 최소화 -> 구현 제대로 안 함 */
  const handleMinimize = () => {
    if (mode === "player") return;
    originalHeightRef.current = height;
    onResize(width, 200);

    if (playlist.length > 0) {
      setCurrentVideoId(null);
      setTimeout(() => setCurrentVideoId(playlist[0].id), 1);
    }
    setMode("player");
  };

  const handleExpand = () => {
    if (mode !== "player") return;
    onResize(width, originalHeightRef.current);
    exitPlayerMode(playlist.length > 0 ? "playlist" : "search");
  };

  /* Render 될 영역 */
  return (
    <div className="youtube-app-container">
      <div className="title-bar">
        {mode === "player" ? (
          <button onClick={handleExpand}>▢</button>
        ) : (
          <button onClick={handleMinimize}>—</button>
        )}
      </div>

      {/* 검색 모드 */}
      {mode === "search" && (
        <div className="search-section">
          <div className="mode-switch-top">
            <button onClick={() => setMode("playlist")}>
              플레이리스트 확인
            </button>
          </div>

          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              const kw = e.currentTarget.elements.searchInput.value.trim();
              if (kw) handleSearch(kw);
            }}
          >
            <input
              name="searchInput"
              type="text"
              placeholder="검색어를 입력하세요"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>

          <ul className="video-list">
            {searchResults.length === 0 && (
              <li className="no-result">검색 결과가 없습니다.</li>
            )}
            {searchResults.map((item) => {
              const vid = item.id.videoId;
              return (
                <li
                  key={vid}
                  className="video-list-item"
                  onClick={() => handleSelectVideo(vid)}
                >
                  <img
                    src={item.snippet.thumbnails.default.url}
                    alt=""
                    className="video-thumb"
                  />
                  <p className="video-title">
                    {decodeHtmlEntities(item.snippet.title)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 플레이리스트 모드 */}
      {mode === "playlist" && (
        <div className="playlist-section">
          <div className="playlist-controls">
            <button onClick={() => exitPlayerMode("search")}>
              <FaSearch /> 검색으로 돌아가기
            </button>
            <button onClick={handleMinimize}>
              <FaPlay /> 플레이어 모드
            </button>
          </div>

          <ul className="playlist-list">
            {playlist.length === 0 && (
              <li className="no-result">현재 재생 목록이 비어 있습니다.</li>
            )}
            {playlist.map((item) => (
              <li key={item.id} className="playlist-item">
                <img
                  src={item.thumb}
                  alt=""
                  className="playlist-thumb"
                  onClick={() => {
                    setCurrentVideoId(item.id);
                    setMode("player");
                  }}
                />
                <p className="playlist-title">{item.title}</p>
                <button
                  className="playlist-delete-btn"
                  onClick={() => handleRemoveFromQueue(item.id)}
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 플레이어 모드 */}
      {mode === "player" && (
        <div className="mini-player-bar">
          <button onClick={() => exitPlayerMode("playlist")}>
            플레이리스트
          </button>

          {currentVideoId ? (
            <>
              <img
                className="mini-thumb"
                src={`https://img.youtube.com/vi/${currentVideoId}/default.jpg`}
                alt=""
              />
              <span className="mini-title">
                {
                  playlist.find((p) => p.id === currentVideoId)
                    ?.title
                }
              </span>

              <button className="mini-btn" onClick={togglePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button className="mini-btn" onClick={skipNext}>
                <FaForward />
              </button>
              <div className="mini-progress-bar">
                <div
                  className="mini-progress-inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </>
          ) : (
            <div className="no-video-msg">재생 중인 곡이 없습니다.</div>
          )}
        </div>
      )}

      {/* 실제 플레이어 영역 -> 음악만 재생하므로 안 보이게 처리함 */}
      <div
        id="yt-player"
        className="yt-iframe-wrapper"
        style={{
          display:
            mode === "player" && currentVideoId
              ? "block"
              : "none",
        }}
      />
    </div>
  );
}

YouTubeApp.appName = "음악 재생";
YouTubeApp.Icon = FaYoutube;
