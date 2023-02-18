import React from "react";

function Navbar() {
  return (
    <nav className="flex my-6 max-w-[1250px] w-[80%] mx-auto items-center gap-32">
      <h1 className="shrink-0 font-bold text-lg">CalgaryHacks</h1>
      <div className="flex gap-11 shrink w-full">
        <p>Home</p>
        <p>How it works</p>
        <p>GitHub</p>
      </div>
      <button className="px-8 bg-gray-800/75 hover:bg-gray-700/50 transition-all duration-300 rounded-md py-2 shrink-0">
        Try it out
      </button>
    </nav>
  );
}

export default Navbar;
