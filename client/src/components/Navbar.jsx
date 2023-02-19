import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full absolute z-50">
      <div className="flex py-6 max-w-screen-xl w-[90%] mx-auto items-center lg:gap-32 gap-4 lg:justify-start justify-evenly flex-col lg:flex-row">
        {/* Logo */}
        <Link to="/">
          <h1 className="shrink-0 font-bold text-lg">CropWatch</h1>
        </Link>

        {/* Links */}
        <div className="flex lg:justify-end justify-center gap-11 shrink w-full">
          <Link to="/">
            <p className="opacity-75 hover:opacity-100 transition-opacity duration-300">
              Home
            </p>
          </Link>
          <a href="" target="_blank" rel="noopener">
            <p className="opacity-75 hover:opacity-100 transition-opacity duration-300">
              How it works
            </p>
          </a>
          <a
            href="https://github.com/andyjianzhou/CalgaryHacks2023"
            target="_blank"
            rel="noopener"
          >
            <p className="opacity-75 hover:opacity-100 transition-opacity duration-300">
              GitHub
            </p>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
