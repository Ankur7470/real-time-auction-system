// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import AuctionCard from '../components/AuctionCard';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/axiosConfig';

// const Dashboard = () => {
//   const { isAuthenticated, currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [userAuctions, setUserAuctions] = useState([]);
//   const [userBids, setUserBids] = useState([]);
//   const [wonAuctions, setWonAuctions] = useState([]);

//   // const [auctionsError, setAuctionsError] = useState(false);
//   // const [bidsError, setBidsError] = useState(false);

//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(false);
  
//   useEffect(() => {
//   console.log('Auth status:', isAuthenticated);
//   console.log('Current user:', currentUser);
// }, [isAuthenticated, currentUser]);



//   // useEffect(() => {
 
//   //   // if (!isAuthenticated || !currentUser) {
//   //   //   navigate('/login');
//   //   //   return;
//   //   // }
    
//   //   const fetchUserAuctions = async () => {

//   //     setLoading(true);
//   //     try {
//   //       const res = await api.get(`/auctions/seller/${currentUser.id}`);
//   //       setUserAuctions(res.data); 
//   //     } catch (error) {
//   //       console.error('Error fetching user data:', error);
//   //       toast.error(error.message || 'Failed to load your data');
//   //       setAuctionsError(true);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   const fetchWonAuctions = async () => {

//   //     setLoading(true);
//   //     try {
//   //       const res = await api.get(`/auctions/winner/${currentUser.id}`);
//   //       setWonAuctions(res.data);     
//   //     } catch (error) {
//   //       console.error('Error fetching user data:', error);
//   //       toast.error(error.message || 'Failed to load your data');
//   //       setAuctionsError(true);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   const fetchUserBids = async () => {

//   //     setLoading(true);
//   //     try {
//   //       const res = await api.get(`/bids/user/${currentUser.id}`);
//   //       setUserBids(res.data); 
//   //     } catch (error) {
//   //       console.error('Error fetching user data:', error);
//   //       toast.error(error.message || 'Failed to load your data');
//   //       setBidsError(true);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchUserAuctions();
//   //   fetchWonAuctions();
//   //   fetchUserBids();

//   // }, [isAuthenticated, currentUser, navigate]);

//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const [res1, res2, res3] = await Promise.all([
//           api.get(`/auctions/seller/${currentUser.id}`),
//           api.get(`/auctions/winner/${currentUser.id}`),
//           api.get(`/bids/user/${currentUser.id}`),
//         ]);
//         setUserAuctions(res1.data);
//         setWonAuctions(res2.data);
//         setUserBids(res3.data);
//       } catch (error) {
//         toast.error(error.message || 'Failed to load your data');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (isAuthenticated && currentUser) {
//       fetchAll();
//     }
//   }, [isAuthenticated, currentUser, navigate]);
  

//   const tabs = [
//     { name: 'My Auctions', count: userAuctions?.length || 0 },
//     { name: 'My Bids', count: userBids?.length || 0 },
//     { name: 'Won Auctions', count: wonAuctions?.length || 0 },
//   ];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div>

//       <div className="bg-white rounded-lg shadow-md mb-6">
//         <div className="flex border-b">
//           {tabs.map((tab, index) => (
//             <button
//               key={tab.name}
//               className={`flex-1 py-4 px-4 text-center font-medium ${activeTab === index
//                   ? 'text-primary border-b-2 border-primary'
//                   : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               onClick={() => setActiveTab(index)}
//             >
//               {tab.name}
//               <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
//                 {tab.count}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>
    
//       {activeTab === 0 && (
//         <div>
       
//           {userAuctions.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <p className="text-gray-600 mb-4">You haven't created any auctions yet.</p>
//               <button
//                 onClick={() => navigate('/create-auction')}
//                 className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Create Your First Auction
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
//               {userAuctions.map((auction) => (
//                 <div key={auction.id}>
//                   <AuctionCard auction={auction} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 1 && (
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bids</h2>
//           {userBids.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <p className="text-gray-600 mb-4">You haven't placed any bids yet.</p>
//               <button
//                 onClick={() => navigate('/')}
//                 className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Browse Auctions
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {userBids.map((bid) => (
//                 <div key={bid.id}>
//                   <AuctionCard auction={bid.auction} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 2 && (
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Won Auctions</h2>
//           {wonAuctions.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <p className="text-gray-600 mb-4">No won auctions yet.</p>
//               <button
//                 onClick={() => navigate('/')}
//                 className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Browse Auctions
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {wonAuctions.map((auction) => (
//                 <div key={auction.id}>
//                   <AuctionCard auction={auction} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// pages/Dashboard.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuctionCard from '../components/AuctionCard';
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
    { name: 'My Auctions', count: userAuctions.length, data: userAuctions },
    { name: 'My Bids', count: userBids.length, data: userBids },
    { name: 'Won Auctions', count: wonAuctions.length, data: wonAuctions },
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
    <div>
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === index
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
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {activeTab === 0 ? 'Create Your First Auction' : 'Browse Auctions'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTab.data.map((item) => (
            <div key={item.id}>
              <AuctionCard auction={item.auction || item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
