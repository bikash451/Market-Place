import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

import { Routes, Route } from "react-router-dom";
import { useTheme } from './hooks/useTheme';

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { theme } = useTheme();

   useEffect(() => {
    console.log('App theme changed to:', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;