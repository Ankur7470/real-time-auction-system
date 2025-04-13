import { useParams } from 'react-router-dom';
import { mockAuctions } from '../mockData';
import BidForm from '../components/BidForm';

export default function AuctionPage() {
    const { id } = useParams();
    const auction = mockAuctions.find(a => a.id === id);

    if (!auction) return <div className="text-center py-12">Auction not found</div>;


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Image Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                    <img
                        src={auction.image}
                        className="w-full h-auto max-h-[500px] object-contain"
                    />
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    {/* Content remains the same */}
                    <h1 className="text-3xl font-bold">{auction.title}</h1>
                    <p className="text-gray-700">{auction.description}</p>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Bidding Information</h2>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Current Bid:</span>
                            <span className="font-bold text-blue-600">${auction.currentBid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-gray-600">Bids:</span>
                            <span>{auction.bidCount} bids</span>
                        </div>
                    </div>
                    <BidForm
                        auctionId={auction.id}
                        currentBid={auction.currentBid}
                        userId="user123" // Will be dynamic later
                    />
                </div>


            </div>
        </div>
    );
}


