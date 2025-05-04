import { Button, ButtonProps } from '@mui/material';

const NavBarButton = (props: ButtonProps) => {
  return (
    <Button
      variant="text"
      disableElevation
      sx={{
        bgcolor: 'transparent',
        color: 'white',
        borderRadius: 0,                
        height: '100%', 
        boxShadow: 'none',
        '&:hover': {
          bgcolor: '#e0e0e0',
        },
      }}
      {...props}
    />
  );
};

export default NavBarButton;
