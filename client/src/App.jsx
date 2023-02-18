import React from "react";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./routes/MainPage";

// Add all routes here
const router = createBrowserRouter([
  {
    path: "/",
    element:<MainPage/>
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
