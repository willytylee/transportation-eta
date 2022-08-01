import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <SnackbarProvider maxSnack={1} autoHideDuration={2000}>
          <App />
        </SnackbarProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
