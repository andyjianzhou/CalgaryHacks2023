import React from "react";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./routes/MainPage";
import Globe from "./routes/Globe";

// Add all routes here
const router = createBrowserRouter([
  {
    path: "/",
    element:<MainPage/>
  },

  {
    path: "/main",
    element:<Globe/>
  },
]);

function App() {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />

    </>
  );
}

export default App;
