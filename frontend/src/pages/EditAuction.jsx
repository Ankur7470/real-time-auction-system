import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import api from '../services/axiosConfig';
import { categories } from '../constants/categories';
import { FaTag, FaList, FaDollarSign, FaClock, FaImage, FaAlignLeft } from 'react-icons/fa';

const EditAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await api.get(`/auctions/${id}`);
        const data = {
          ...res.data,
          endTime: moment(res.data.endTime).format('YYYY-MM-DDTHH:mm'),
        };
        setFormData(data);
        setOriginalData(data);
      } catch {
        toast.error('Failed to load auction');
      }
    };

    fetchAuction();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData) return;

    // Check if there are any changes
    const hasChanges = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );

    if (!hasChanges) {
      toast.info('No changes to update');
      return;
    }

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

    try {
      setLoading(true);
      await api.put(`/auctions/${id}`, {
        ...formData,
        startingPrice: startingPrice,
      });
      toast.success('Auction updated successfully!');
      setTimeout(() => {
        navigate(`/auctions/${id}`);
      }, 2000);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };


  if (!formData) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Auction</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleUpdate} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaTag className="inline mr-2" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaList className="inline mr-2" /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaDollarSign className="inline mr-2" /> Starting Price
            </label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaClock className="inline mr-2" /> End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              min={moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm')}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaImage className="inline mr-2" /> Image URL (optional)
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaAlignLeft className="inline mr-2" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your item in detail"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Updating...' : 'Update Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAuction;

