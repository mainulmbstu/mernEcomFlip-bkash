import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div id="myFooter" className=" ">
      <div className=" text-white text-center p-3 ">
        <h4> &copy; MainulTech</h4>
      <p className="">
        <Link to='/about'>About</Link>|
        <Link to='/contacts'>Contact Us</Link>|
        <Link to='/privacy'>Privacy</Link>
      </p>
      </div>
    </div>
  );
};

export default Footer;
