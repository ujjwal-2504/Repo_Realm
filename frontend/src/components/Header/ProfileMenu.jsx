import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { CircleUserRound, Star, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LogoutConfirmationDialog from "../auth/LogoutConfirmationDialog";
import { useLogout } from "../../utils/useLogout";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose(); // Close the menu first
    setLogoutDialogOpen(true); // Open the confirmation dialog
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();

    navigate("/login");
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <CircleUserRound className="text-white w-8 h-8" />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              bgcolor: "#141921",
              color: "white",
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
                bgcolor: "#334155",
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "#475569",
                },
              },
              "& .MuiListItemIcon-root": {
                color: "white",
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link to="/profile/self" className="flex items-center">
            <Avatar /> Profile
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className="flex items-center gap-2">
            <Star className="text-amber-300" /> Your Stars
          </Link>
        </MenuItem>
        <Divider sx={{ bgcolor: "#fff7", width: "70%", margin: "auto" }} />
        <MenuItem onClick={handleLogoutClick}>
          <div className="flex items-center gap-2 text-red-400 cursor-pointer">
            <LogOut className="" />
            Logout
          </div>
        </MenuItem>
      </Menu>

      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </React.Fragment>
  );
}
