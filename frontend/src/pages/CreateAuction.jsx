import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaImage, FaTag, FaAlignLeft, FaDollarSign, FaClock, FaList } from 'react-icons/fa';
import moment from 'moment';
import api from '../services/axiosConfig';

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Toys & Games',
  'Sports',
  'Collectibles',
  'Vehicles',
  'Jewelry',
  'Art',
  'Other',
];

const CreateAuction = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    category: '',
    endTime: moment().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.startingPrice || !formData.category || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const startingPrice = parseFloat(formData.startingPrice);
    if (isNaN(startingPrice) || startingPrice <= 0) {
      toast.error('Starting price must be a positive number');
      return;
    }
    
    const endTime = moment(formData.endTime);
    if (endTime.isBefore(moment().add(1, 'hour'))) {
      toast.error('End time must be at least 1 hour from now');
      return;
    }

    const auctionData = {
      ...formData,
      startingPrice: parseFloat(formData.startingPrice),
      endTime: formData.endTime
    }

    const createAuction = async () =>{
      setLoading(true);
      try {
        const res = await api.post('/auctions', auctionData);
        if (res?.data) {
          setSuccess(true);
          toast.success('Auction Created Successfully!!');
          setTimeout(() => {
            navigate(`/auctions/${res.data.id}`);
          }, 2000);
        }
       
      } catch (error) {
        setError(true);
        console.log(error);
        toast.error('Failed to create auction');
      } finally {
        setLoading(false);
      }
    }

    createAuction(); 
   
  };
  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Auction</h1>
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          Auction created successfully! Redirecting to auction page...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error.message || "Error creating auction"}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title & Category */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
                <FaTag className="inline mr-2" />
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={handleChange}
                disabled={loading || success}
                placeholder="Enter auction title"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="category">
                <FaList className="inline mr-2" />
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
                disabled={loading || success}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Starting Price & End Time */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="startingPrice">
                <FaDollarSign className="inline mr-2" />
                Starting Price
              </label>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startingPrice}
                onChange={handleChange}
                disabled={loading || success}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="endTime">
                <FaClock className="inline mr-2" />
                End Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endTime}
                onChange={handleChange}
                disabled={loading || success}
                min={moment().add(1, "hour").format("YYYY-MM-DDTHH:mm")}
                required
              />
            </div>
          </div>

          {/* Row 3: Image URL */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="imageUrl">
              <FaImage className="inline mr-2" />
              Image URL (optional)
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={loading || success}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
              <FaAlignLeft className="inline mr-2" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
              disabled={loading || success}
              placeholder="Describe your item in detail"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              (loading || success) ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading || success}
          >
            {loading ? "Creating..." : success ? "Created Successfully" : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;

