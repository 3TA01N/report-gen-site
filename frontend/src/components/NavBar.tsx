import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import NavBarButton from './NavBarButton';
interface NavbarProps {
  handleLogout: () => void;
}

const NavBar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ alignItems: 'stretch', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            <NavBarButton color="inherit" href="/">Home</NavBarButton>
          </Typography>
          <Box sx={{ '& button': { bgcolor: 'transparent', color: 'black', '&:hover': { bgcolor: '#e0e0e0' } } }}>
            <NavBarButton href="/Agents/">Agents</NavBarButton>
            <NavBarButton href="/Leads/">Leads</NavBarButton>
            {/*<NavBarButton href="/Papers/">Papers</NavBarButton>*/}
            <NavBarButton href="/Reports/">Reports</NavBarButton>
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <IconButton edge="start" color="inherit" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose} component="a" href="/Agents/">Agents</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/Leads/">Leads</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/Papers/">Papers</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/Reports/">Reports</MenuItem>
            </Menu>
          </Box>
        </Box>
        <Button color="error" variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;