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
    path: "/globe",
    element: <Globe />,
  },
]);

function App() {
  console.log("App.jsx running");
  return <RouterProvider router={router} />;
}

export default App;
