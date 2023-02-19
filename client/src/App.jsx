import React from "react";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./routes/Home";
import Globe from "./routes/Globe";

// Add all routes here
const router = createBrowserRouter([
  {
    path: "/",
    element:<MainPage/>
  },

  {
    path: "/globe",
    element:<Globe/>
  },
]);

function App() {
  console.log("App.jsx running")
  return (
    <>
      {/* <Navbar /> */}
      <RouterProvider router={router} />

    </>
  );
}

export default App;
