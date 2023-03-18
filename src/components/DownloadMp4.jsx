import React from "react";
import "./DownloadMp4.css";

const DownloadMp4 = ({ videoUrl, title }) => {
  const handleDownload = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/download", {
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
  };

  return (
    <form onSubmit={handleDownload}>
      <button className="mp4button" type="submit">
        Download Mp4
      </button>
    </form>
  );
};

export default DownloadMp4;
