import React, { useState } from "react";
import "./DownloadMp4.css";

const DownloadMp4 = ({ videoUrl, title }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (event) => {
    event.preventDefault();

    try {
      setIsDownloading(true);
      const res = await fetch("https://y2y-ypvj.onrender.com/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${title}.mp4`;
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
      <button className="mp4button" type="submit">
        Download Mp4
      </button>
      {isDownloading && <p>Downloading Mp4...</p>}
    </form>
  );
};

export default DownloadMp4;
