import React, { useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";
import Navbar from "../components/Navbar";
import Globe from "react-globe.gl";
import { Link } from "react-router-dom";

function Home() {
  const description =
    "CropWatch, your pocket harvest insight wherever you are, whenever you want.";

  const globeRef = useRef(null);
  const handleClick = () => {
    window.location.href = "/globe";
  };

  useEffect(() => {
    const globe = globeRef.current;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 1;
    globe.controls().enableZoom = false;
    globe.controls().enableRotate = false;
  }, [globeRef]);

  function handleGlobeReady() {
    console.log("Globe is ready.");
    console.log(globeRef.current.canvas);
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full justify-center items-center">
        <div className="max-w-screen-lg w-[80%] flex justify-between">
          {/* Tagline and description */}
          <div className="w-1/2 lg:flex flex-col justify-center lg:visible hidden">
            <h1 className="text-[#FE1E27] uppercase font-black text-8xl mb-12">
              Harvest Insight
            </h1>
            <div className="relative mb-12">
              {/* Create spacing */}
              <p className="text-lg ml-2 invisible">{description}</p>

              {/* Typewriter effect */}
              <p className="text-lg ml-2 absolute top-0 left-0">
                <Typewriter
                  options={{
                    delay: 50,
                  }}
                  onInit={(typewriter) => {
                    typewriter.typeString(description).start();
                  }}
                />
              </p>
            </div>

            {/* Try it now button */}
            <Link to="/globe">
              <button className="rounded-xl w-full py-4 border-2 border-white hover:bg-white hover:text-black transition-all duration-300">
                Try it out now
              </button>
            </Link>
          </div>

          {/* Globe preview */}
          <div className="rounded-xl w-full h-full">
            <Globe
              ref={globeRef}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              width={800}
              height={800}
              backgroundColor="rgb(0,0,0,0)"
              onGlobeClick={handleClick}
              onGlobeReady={handleGlobeReady}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
