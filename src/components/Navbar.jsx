import React from "react";
import "./Navbar.css";
import { ImInstagram } from "react-icons/im";
import { BsTwitter } from "react-icons/bs";

const Navbar = () => {
  return (
    <div className="navbar">
      <h2>y2yu.com</h2>

      <div className="icons">
        <ul>
          <a
            href="https://www.twitter.com/Bkind___/"
            target="_blank"
            rel="noreferrer"
          >
            <BsTwitter />
          </a>
          <a
            href="https://www.instagram.com/bkind____/"
            target="_blank"
            rel="noreferrer"
          >
            <ImInstagram />
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
