/*import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { FaPlus } from 'react-icons/fa';
import AuctionCard from '../components/AuctionCard';
import { fetchUserAuctions, fetchWonAuctions } from '../slices/auctionSlice';
//import { fetchUserBids } from '../slices/biddingSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { userAuctions, wonAuctions, error: auctionsError } = useSelector((state) => state.auctions);
  //const { userBids, error: bidsError } = useSelector((state) => state.bidding);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Use Promise.all to fetch data in parallel
        await Promise.all([
          dispatch(fetchUserAuctions()).unwrap(),
          //dispatch(fetchUserBids()).unwrap(),
          dispatch(fetchWonAuctions()).unwrap()
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error(error.message || 'Failed to load your data');

        // Handle authentication errors
        if (error.message === 'User not authenticated') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, isAuthenticated, user, navigate]);

  const tabs = [
    { name: 'My Auctions', count: userAuctions?.length || 0 },
  //  { name: 'My Bids', count: userBids?.length || 0 },
    { name: 'Won Auctions', count: wonAuctions?.length || 0 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              className={`flex-1 py-4 px-4 text-center font-medium ${activeTab === index
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {auctionsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {auctionsError.message || 'Error loading auctions'}
        </Alert>
      )}

      {bidsError && activeTab === 1 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {bidsError.message || 'Error loading bids'}
        </Alert>
      )}
    
      {activeTab === 0 && (
        <div>
       
          {userAuctions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't created any auctions yet.</p>
              <button
                onClick={() => navigate('/create-auction')}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Your First Auction
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {userAuctions.map((auction) => (
                <div key={auction.id}>
                  <AuctionCard auction={auction} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bids</h2>
          {userBids.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't placed any bids yet.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Browse Auctions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBids.map((bid) => (
                <div key={bid.id}>
                  <AuctionCard auction={bid.auction} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Won Auctions</h2>
          {wonAuctions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">No won auctions yet.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Browse Auctions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wonAuctions.map((auction) => (
                <div key={auction.id}>
                  <AuctionCard auction={auction} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;*/
