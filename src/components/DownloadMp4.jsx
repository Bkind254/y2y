import React, { useState } from "react";
import "./DownloadMp4.css";

const DownloadMp4 = ({ videoUrl, title }) => {
  const [progress, setProgress] = useState(0);

  const handleDownload = async (event) => {
    event.preventDefault();

    const res = await fetch("https://y2y-ypvj.onrender.com/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: videoUrl }),
    });

    const totalSize = res.headers.get("content-length");
    let downloadedSize = 0;

    const blob = new Blob([await res.arrayBuffer()]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${title}.mp4`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        downloadedSize = event.loaded;
        setProgress((downloadedSize / totalSize) * 100);
      }
    };

    xhr.onloadend = () => {
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    xhr.send();
  };

  return (
    <div>
      <form onSubmit={handleDownload}>
        <button className="mp4button" type="submit">
          Download Mp4
        </button>
      </form>
      {progress > 0 && (
        <progress value={progress} max="100">
          {progress}%
        </progress>
      )}
    </div>
  );
};

export default DownloadMp4;

/*import React from "react";
import "./DownloadMp4.css";

const DownloadMp4 = ({ videoUrl, title }) => {
  const handleDownload = async (event) => {
    event.preventDefault();

    try {
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
*/
