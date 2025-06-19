import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StudentProfile from "./pages/StudentProfile";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
    </div>
  );
}

export default App;
