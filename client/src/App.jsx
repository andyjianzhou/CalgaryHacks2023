import React from "react";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Globe from "./routes/Globe";

// Add all routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
