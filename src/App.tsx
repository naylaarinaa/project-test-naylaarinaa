import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Work from "./pages/Work";
import About from "./pages/About";
import Services from "./pages/Services";
import Ideas from "./pages/Ideas";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="font-sans text-gray-900">
      <Header />
      <div className="pt-[90px]">
        <Routes>
          <Route path="/" element={<Navigate to="/ideas" replace />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <div className="p-12 text-2xl font-bold">404 Not Found</div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
