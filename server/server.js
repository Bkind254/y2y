const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");
const ffmpegPath = "/usr/bin/ffmpeg";
//const ffmpegPath = "C:/PATH_Programs/ffmpeg.exe";
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/download", async (req, res) => {
  const url = req.body.url;
  const info = await ytdl.getInfo(url);
  console.log(url);
  console.log(info.formats);
  const format = ytdl.chooseFormat(info.formats, {
    filter: "videoandaudio",
    quality: "highestvideo",
    format: "mp4",
  });

  const video = ytdl(url, { format });
  const fileSize = parseInt(format.contentLength);
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    video.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    video.pipe(res);
  }
});

app.post("/download-audio", async (req, res) => {
  const url = req.body.url;
  const info = await ytdl.getInfo(url);
  const format = ytdl.filterFormats(info.formats, "audioonly")[0];
  const audio = ytdl(url, { format });

  const converter = ffmpeg(audio)
    .toFormat("mp3")
    .on("error", (err) => {
      console.log("An error occurred: " + err.message);
    })
    .on("end", () => {
      console.log("Audio conversion complete");
    });

  res.header(
    "Content-Disposition",
    `attachment; filename="${info.videoDetails.title}.mp3"`
  );

  converter.pipe(res);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
