import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      height="100%" 
      minHeight="200px"
      gap={2}
    >
      <CircularProgress size={size} />
      {message && <p className="text-gray-600">{message}</p>}
    </Box>
  );
};

export default LoadingSpinner;
