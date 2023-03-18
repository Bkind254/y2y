import axios from "axios";

const fetchFromAPI = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3/",
  params: {
    key: process.env.REACT_APP_RAPID_API_KEY,
  },
});

export default fetchFromAPI;
