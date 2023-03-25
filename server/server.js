const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const fs = require("fs");
const bodyParser = require("body-parser");
const ffmpeg = require("ffmpeg-static");

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
  const info = await ytdl.getBasicInfo(url);
  const format = ytdl.chooseFormat(info.formats, {
    filter: "audioonly",
    format: "mp3",
  });
  const audioStream = await ytdl(url, { format });
  const audioFilePath = `./${info.videoDetails.videoId}.mp3`;

  audioStream.pipe(fs.createWriteStream(audioFilePath));

  audioStream.on("end", async () => {
    try {
      const ffmpegProcess = await spawn(ffmpeg, [
        "-i",
        audioFilePath,
        "-vn",
        "-acodec",
        "libmp3lame",
        "-qscale:a",
        "2",
        "-f",
        "mp3",
        "-",
      ]);
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${info.videoDetails.title}.mp3"`,
      });
      ffmpegProcess.stdout.pipe(res);
      ffmpegProcess.on("error", (err) => {
        console.error(`Error converting audio to MP3: ${err}`);
        res.status(500).send("Error converting audio to MP3");
      });
      ffmpegProcess.on("close", () => {
        console.log("Conversion complete");
      });
    } catch (error) {
      console.error(`Error starting ffmpeg process: ${error}`);
      res.status(500).send("Error starting ffmpeg process");
    }
  });
});
/*
app.post("/download-audio", async (req, res) => {
  const url = req.body.url;
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, {
    filter: "audioonly",
    quality: "highestaudio",
    format: "mp3",
  });
  const audio = ytdl(url, { format });

  const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s.]/gi, "");

  res.header("Content-Type", "audio/mpeg");
  res.header(
    "Content-Disposition",
    `attachment; filename="${sanitizedTitle}.mp3"`
  );

  audio.pipe(res);
});
*/
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
