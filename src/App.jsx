// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RouterCliente from "./components/cliente/RouterCliente";
import { getGoogleClientId } from "./config/googleOAuthConfig";
import "./index.css";

function App() {
  return (
    <GoogleOAuthProvider clientId={getGoogleClientId()}>
      <BrowserRouter>
        <RouterCliente />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
