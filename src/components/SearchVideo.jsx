import React, { useState } from "react";
import "./SearchVideo.css";
import fetchFromAPI from "../fetchFromAPI";
import VideoCard from "./VideoCard";
import axios from "axios";

function SearchVideos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetchFromAPI.get("/search", {
      params: {
        part: "snippet",
        type: "video",
        q: searchQuery,
        maxResults: 14,
      },
    });
    setVideos(response.data.items);

    axios
      .post("https://y2y-ypvj.onrender.com/download", {
        url: response.data.items[0].id.videoId,
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Y2Y</h1>
        <h2>Download Mp3 and Mp4 from YouTube </h2>

        <form className="search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search or Paste link here..."
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </form>

        <div className="video-container">
          {videos.map((video) => (
            <VideoCard
              key={video.id.videoId}
              title={video.snippet.title}
              description={video.snippet.description}
              thumbnail={video.snippet.thumbnails.medium.url}
              videoId={video.id.videoId}
            />
          ))}
        </div>
      </div>
      <div className="info">
        <h2>Youtube Downloader</h2>
        <p>
          Y2yu empowers you to download captivating audio and video content from
          YouTube's vast repository. This cutting-edge platform seamlessly
          fetches the finest MP3 audio format and video downloads, enabling you
          to access a plethora of riveting videos at no cost.
        </p>
      </div>
    </div>
  );
}

export default SearchVideos;
