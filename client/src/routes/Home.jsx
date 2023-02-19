import React from "react";

function Home() {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="max-w-screen-lg w-[80%] flex justify-between">
        {/* Tagline and description */}
        <div className="w-1/2 lg:flex flex-col justify-center lg:visible hidden">
          <h1 className="text-[#FE1E27] uppercase font-black text-9xl mb-12">
            Crop Yield
          </h1>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Image and demo link */}
        <div className="mx-auto lg:mx-0">
          <div className="bg-white rounded-xl w-80 h-96 mb-7"></div>
          <button className="rounded-xl w-full py-4 border-2 border-white hover:bg-white hover:text-black transition-all duration-300">
            Try it out now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
