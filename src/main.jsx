import React, { Component } from "react";
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
import { DirectionProvider } from "./context/DirectionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Update state to render fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error details
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console or external service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>出事了😭</h2>
          <p>{this.state.error?.toString()}</p>
          <p>請聯絡Willy</p>
          <pre>{this.state.errorInfo?.componentStack}</pre>
          <button type="button" onClick={() => window.location.reload()}>
            重新載入
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <EtaProvider>
          <DirectionProvider>
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
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </SnackbarProvider>
            </DbProvider>
          </DirectionProvider>
        </EtaProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
