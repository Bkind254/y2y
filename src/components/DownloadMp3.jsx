import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DownloadMp3.css";

const DownloadMp3 = ({ videoUrl, title }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  const handleDownload = async (event) => {
    event.preventDefault();

    try {
      setIsDownloading(true);
      const response = await axios.post(
        "https://y2y-ypvj.onrender.com/download-audio",
        {
          url: videoUrl,
          title: title,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }

    setIsDownloading(false);
  };
  useEffect(() => {
    let interval;
    if (isDownloading) {
      interval = setInterval(() => {
        setDotCount((prevDotCount) => (prevDotCount + 1) % 4);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDownloading]);

  return (
    <form onSubmit={handleDownload}>
      <button className="mp3button" type="submit">
        Download MP3
      </button>
      {isDownloading && <p>Downloading{".".repeat(dotCount)}</p>}
    </form>
  );
};

export default DownloadMp3;
