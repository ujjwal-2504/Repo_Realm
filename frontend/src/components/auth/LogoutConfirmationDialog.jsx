import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const LogoutConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Logout",
  message = "Are you sure you want to logout? You will need to sign in again to access your account.",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        sx: {
          bgcolor: "#141921",
          color: "white",
          border: "1px solid #475569",
        },
      }}
    >
      <DialogTitle id="logout-dialog-title" sx={{ color: "white" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="logout-dialog-description"
          sx={{ color: "#cbd5e1" }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#94a3b8",
            "&:hover": { backgroundColor: "#334155" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#ef4444",
            "&:hover": { backgroundColor: "#dc2626" },
          }}
          autoFocus
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmationDialog;
