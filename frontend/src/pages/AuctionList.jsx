import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuctions } from '../slices/auctionSlice';
import AuctionCard from '../components/AuctionCard';

const AuctionList = () => {
  const dispatch = useDispatch();
  const { auctions, loading, error } = useSelector((state) => state.auctions);

  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Active Auctions</h1>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message || 'Error loading auctions'}
        </div>
      )}
      
      {!loading && !error && auctions.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No auctions available at the moment.
        </div>
      )}
      
      {!loading && !error && auctions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {auctions.map((auction) => (
            <div key={auction.id}>
              <AuctionCard auction={auction} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;
