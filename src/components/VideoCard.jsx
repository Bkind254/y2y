import React from "react";
import "./VideoCard.css";
import DownloadMp4 from "./DownloadMp4";
import DownloadMp3 from "./DownloadMp3";

function VideoCard(props) {
  const { title, thumbnail, videoId } = props;

  return (
    <div className="video-card">
      <img src={thumbnail} alt={title} />
      <div className="video-info">
        <label>{title}</label>

        <div className="downloadButton">
          <DownloadMp3
            videoUrl={`https://www.youtube.com/watch?v=${videoId}`}
            title={title}
          />
        </div>
        <div className="downloadButton">
          <DownloadMp4
            className="video-button"
            videoUrl={`https://www.youtube.com/watch?v=${videoId}`}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
