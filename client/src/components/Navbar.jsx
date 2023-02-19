import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full absolute bg-[#18181B]">
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
          <p className="opacity-75 hover:opacity-100 transition-opacity duration-300">
            How it works
          </p>
          <p className="opacity-75 hover:opacity-100 transition-opacity duration-300">
            GitHub
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
