import { Box } from '@mui/material';
import HeaderSearch from './Search';
import HeaderNotifications from './Notifications';

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <HeaderSearch />
    </Box>
  );
}

export default HeaderButtons;
