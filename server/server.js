const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");

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
  const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s.]/gi, "");
  res.header(
    "Content-Disposition",
    `attachment; filename="${sanitizedTitle}.${format.container}"`
  );
  video.pipe(res);
});

app.post("/download-audio", async (req, res) => {
  const url = req.body.url;
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, {
    filter: "audio",
    quality: "highestaudio",
    format: "mp3",
  });
  const audio = ytdl(url, { format });

  const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s.]/gi, "");

  res.header(
    "Content-Disposition",
    `attachment; filename="${sanitizedTitle}.${format.container}"`
  );

  audio.pipe(res);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
