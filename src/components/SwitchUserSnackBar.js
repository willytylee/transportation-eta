import { styled, Snackbar, Alert } from "@mui/material";

export const SwitchUserSnackBar = ({
  snackbarOpen,
  setSnackbarOpen,
  username,
}) => {
  const handleSnackbarOnClose = (e, reason) => {
    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={2000}
      onClose={handleSnackbarOnClose}
    >
      <Alert severity="success" sx={{ width: "100%" }}>
        收藏已設定為用戶 {username}
      </Alert>
    </Snackbar>
  );
};
