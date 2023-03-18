import React from "react";
import SearchVideos from "./components/SearchVideo";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <SearchVideos />
      <Footer />
    </>
  );
};

export default App;
