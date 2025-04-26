import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
