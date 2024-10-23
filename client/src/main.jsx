import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SearchContextProvider } from "./context/SearchContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={4000}
          theme="light"
           //bounce, slide, flip, zoom
        />
      </SearchContextProvider>
    </AuthContextProvider>
  // </StrictMode>
);
