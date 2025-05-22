import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuctionCard from '../components/AuctionCard';
import BidCard from '../components/BidCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosConfig';

const Dashboard = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [userAuctions, setUserAuctions] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchData = async () => {
      setDataLoading(true);
      setError(null);

      try {
        const [auctionsRes, bidsRes, wonRes] = await Promise.all([
          api.get(`/auctions/seller/${currentUser.id}`),
          api.get(`/bids/user/${currentUser.id}`),
          api.get(`/auctions/winner/${currentUser.id}`)
        ]);

        setUserAuctions(auctionsRes.data);
        setUserBids(bidsRes.data);
        setWonAuctions(wonRes.data);
        // console.log('Bids data:', bidsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        toast.error('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const tabs = [
    { name: 'My Auctions', count: userAuctions.length, data: userAuctions, type: 'auction' },
    { name: 'My Bids', count: userBids.length, data: userBids, type: 'bid' },
    { name: 'Won Auctions', count: wonAuctions.length, data: wonAuctions, type: 'auction' },
  ];

  if (authLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
        {error}
      </div>
    );
  }

  const currentTab = tabs[activeTab];

  return (
    <div className="container mx-auto px-4 py-6">
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

      {currentTab.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            {activeTab === 0
              ? "You haven't created any auctions yet."
              : activeTab === 1
                ? "You haven't placed any bids yet."
                : "No won auctions yet."}
          </p>
          <button
            onClick={() => navigate(activeTab === 0 ? '/create-auction' : '/')}
            className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {activeTab === 0 ? 'Create Your First Auction' : 'Browse Auctions'}
          </button>
        </div>
      ) : (
        <div className={currentTab.type === 'bid' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
          {currentTab.data.map((item) => {
            return (
              <div key={item.id || item.auction?.id || Math.random()}>
                {currentTab.type === 'bid' ? (
                  <BidCard bid={item} />
                ) : (
                  <AuctionCard auction={item.auction || item} />
                )}
              </div>
            );
            //
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
