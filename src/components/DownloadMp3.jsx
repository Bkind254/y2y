import React, { useState } from "react";
import axios from "axios";
import "./DownloadMp3.css";

const DownloadMp3 = ({ videoUrl, title }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (event) => {
    event.preventDefault();

    try {
      setIsDownloading(true);
      const response = await axios.post(
        "http://localhost:3000/download",
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
      a.download = `y2y-${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }

    setIsDownloading(false);
  };

  return (
    <form onSubmit={handleDownload}>
      <button className="mp3button" type="submit">
        Download MP3
      </button>
      {isDownloading && <p>Downloading Mp3...</p>}
    </form>
  );
};

export default DownloadMp3;
