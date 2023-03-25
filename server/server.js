const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

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

  // Get information about the video
  const info = await ytdl.getInfo(url);

  // Choose the audio format that is most compatible with mobile devices
  const format = ytdl.chooseFormat(info.formats, {
    filter: "audioonly",
    quality: "highestaudio",
  });

  // Spawn an ffmpeg process to convert the audio to MP3 format
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    format.url,
    "-vn",
    "-acodec",
    "libmp3lame",
    "-qscale:a",
    "2",
    "-f",
    "mp3",
    "-",
  ]);

  // Set the content type of the response to audio/mpeg
  res.set({
    "Content-Type": "audio/mpeg",
    "Content-Disposition": `attachment; filename="${info.videoDetails.title}.mp3"`,
  });

  // Pipe the output of the ffmpeg process to the response
  ffmpeg.stdout.pipe(res);

  // Handle any errors that occur during the conversion process
  ffmpeg.on("error", (err) => {
    console.error(`Error converting audio to MP3: ${err}`);
    res.status(500).send("Error converting audio to MP3");
  });

  // Log a message when the conversion is complete
  ffmpeg.on("close", () => {
    console.log("Conversion complete");
  });
}); /*
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
