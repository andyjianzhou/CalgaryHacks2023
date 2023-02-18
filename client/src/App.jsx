import React from "react";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Add all routes here
// const router = createBrowserRouter([
//   {
//     path: "/",
//   },
// ]);

function App() {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
