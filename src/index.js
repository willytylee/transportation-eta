import React from "react";
import { useSnackbar } from "notistack";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { Close as CloseIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material/";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { EtaProvider } from "./context/EtaContext";
import { DbProvider } from "./context/DbContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <EtaProvider>
          <DbProvider>
            <SnackbarProvider
              maxSnack={1}
              autoHideDuration={2000}
              action={(snackbarId) => {
                const { closeSnackbar } = useSnackbar();
                return (
                  <IconButton
                    onClick={() => {
                      closeSnackbar(snackbarId);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                );
              }}
            >
              <App />
            </SnackbarProvider>
          </DbProvider>
        </EtaProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
