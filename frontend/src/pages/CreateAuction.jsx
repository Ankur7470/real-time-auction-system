// import {
//   Alert,
//   Box,
//   Button,
//   FormControl,
//   FormHelperText,
//   InputAdornment,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { useFormik } from 'formik';
// import moment from 'moment';
// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import * as Yup from 'yup';
// import { createAuction } from '../slices/auctionSlice';

// const categories = [
//   'Electronics',
//   'Clothing',
//   'Home & Garden',
//   'Toys & Games',
//   'Sports',
//   'Collectibles',
//   'Vehicles',
//   'Jewelry',
//   'Art',
//   'Other',
// ];

// const validationSchema = Yup.object({
//   title: Yup.string()
//     .required('Title is required')
//     .min(3, 'Title must be at least 3 characters')
//     .max(100, 'Title must be at most 100 characters'),
//   description: Yup.string()
//     .required('Description is required')
//     .min(10, 'Description must be at least 10 characters'),
//   startingPrice: Yup.number()
//     .required('Starting price is required')
//     .positive('Starting price must be positive'),
//   category: Yup.string()
//     .required('Category is required'),
//   endTime: Yup.date()
//     .required('End time is required')
//     .min(moment().add(1, 'hour'), 'End time must be at least 1 hour from now'),
//   imageUrl: Yup.string()
//     .url('Must be a valid URL')
//     .nullable(),
// });

// const CreateAuction = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state) => state.auctions);
//   const [success, setSuccess] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       title: '',
//       description: '',
//       startingPrice: '',
//       category: '',
//       endTime: moment().add(1, 'day'),
//       imageUrl: '',
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       dispatch(createAuction({
//         ...values,
//         startingPrice: parseFloat(values.startingPrice),
//       }))
//         .unwrap()
//         .then((auction) => {
//           setSuccess(true);
//           toast.success('Auction created successfully!');
//           setTimeout(() => {
//             navigate(`/auctions/${auction.id}`);
//           }, 2000);
//         })
//         .catch((error) => {
//           toast.error(error.message || 'Failed to create auction');
//         });
//     },
//   });

//   return (
//     <LocalizationProvider dateAdapter={AdapterMoment}>
//       <Box sx={{ maxWidth: 800, mx: 'auto' }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Create New Auction
//         </Typography>
        
//         {success && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             Auction created successfully! Redirecting to auction page...
//           </Alert>
//         )}
        
//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error.message || 'Error creating auction'}
//           </Alert>
//         )}
        
//         <Paper elevation={3} sx={{ p: 4 }}>
//           <form onSubmit={formik.handleSubmit}>
//             <TextField
//               fullWidth
//               id="title"
//               name="title"
//               label="Title"
//               value={formik.values.title}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.title && Boolean(formik.errors.title)}
//               helperText={formik.touched.title && formik.errors.title}
//               margin="normal"
//               disabled={loading}
//             />
            
//             <TextField
//               fullWidth
//               id="description"
//               name="description"
//               label="Description"
//               multiline
//               rows={4}
//               value={formik.values.description}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.description && Boolean(formik.errors.description)}
//               helperText={formik.touched.description && formik.errors.description}
//               margin="normal"
//               disabled={loading}
//             />
            
//             <TextField
//               fullWidth
//               id="startingPrice"
//               name="startingPrice"
//               label="Starting Price"
//               type="number"
//               InputProps={{
//                 startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                 inputProps: { min: 0.01, step: 0.01 }
//               }}
//               value={formik.values.startingPrice}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.startingPrice && Boolean(formik.errors.startingPrice)}
//               helperText={formik.touched.startingPrice && formik.errors.startingPrice}
//               margin="normal"
//               disabled={loading}
//             />
            
//             <FormControl 
//               fullWidth 
//               margin="normal"
//               error={formik.touched.category && Boolean(formik.errors.category)}
//               disabled={loading}
//             >
//               <InputLabel id="category-label">Category</InputLabel>
//               <Select
//                 labelId="category-label"
//                 id="category"
//                 name="category"
//                 value={formik.values.category}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 label="Category"
//               >
//                 {categories.map((category) => (
//                   <MenuItem key={category} value={category}>
//                     {category}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {formik.touched.category && formik.errors.category && (
//                 <FormHelperText>{formik.errors.category}</FormHelperText>
//               )}
//             </FormControl>
            
//             <Box sx={{ mt: 2, mb: 2 }}>
//               <DateTimePicker
//                 label="End Time"
//                 value={formik.values.endTime}
//                 onChange={(value) => formik.setFieldValue('endTime', value)}
//                 slotProps={{
//                   textField: {
//                     fullWidth: true,
//                     margin: 'normal',
//                     error: formik.touched.endTime && Boolean(formik.errors.endTime),
//                     helperText: formik.touched.endTime && formik.errors.endTime,
//                     disabled: loading
//                   },
//                 }}
//                 minDateTime={moment().add(1, 'hour')}
//               />
//             </Box>
            
//             <TextField
//               fullWidth
//               id="imageUrl"
//               name="imageUrl"
//               label="Image URL (optional)"
//               value={formik.values.imageUrl}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
//               helperText={formik.touched.imageUrl && formik.errors.imageUrl}
//               margin="normal"
//               disabled={loading}
//             />
            
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="large"
//               sx={{ mt: 3 }}
//               disabled={loading || success}
//             >
//               {loading ? 'Creating...' : 'Create Auction'}
//             </Button>
//           </form>
//         </Paper>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default CreateAuction;
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaImage, FaTag, FaAlignLeft, FaDollarSign, FaClock, FaList } from 'react-icons/fa';
import moment from 'moment';
import { createAuction } from '../slices/auctionSlice';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auctions);
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
    
    dispatch(createAuction({
      ...formData,
      startingPrice: parseFloat(formData.startingPrice),
      endTime: formData.endTime,
    }))
      .unwrap()
      .then((auction) => {
        setSuccess(true);
        toast.success('Auction created successfully!');
        setTimeout(() => {
          navigate(`/auctions/${auction.id}`);
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to create auction');
      });
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

//   return (

//     <div className="container mx-auto px-4 py-4 max-w-2xl">
//      <h1 className="text-2xl font-bold mb-6">Create New Auction</h1>
      
//       {success && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
//           Auction created successfully! Redirecting to auction page...
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
//           {error.message || 'Error creating auction'}
//         </div>
//       )}
      
//       <div className="bg-white rounded-lg shadow-md p-10">
//         <form onSubmit={handleSubmit} className="space-y-4">
          
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
//               <FaTag className="inline mr-2" />
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               value={formData.title}
//               onChange={handleChange}
//               disabled={loading || success}
//               placeholder="Enter auction title"
//             />
//           </div>
          
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//               <FaAlignLeft className="inline mr-2" />
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               value={formData.description}
//               onChange={handleChange}
//               disabled={loading || success}
//               placeholder="Describe your item in detail"
//             ></textarea>
//           </div>
          
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startingPrice">
//               <FaDollarSign className="inline mr-2" />
//               Starting Price
//             </label>
//             <input
//               type="number"
//               id="startingPrice"
//               name="startingPrice"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               value={formData.startingPrice}
//               onChange={handleChange}
//               disabled={loading || success}
//               placeholder="0.0$"
//               min="0.01"
//               step="0.01"
//             />
//           </div>
          
//           <div >
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
//               <FaList className="inline mr-2" />
//               Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               value={formData.category}
//               onChange={handleChange}
//               disabled={loading || success}
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
//               <FaClock className="inline mr-2" />
//               End Time
//             </label>
//             <input
//               type="datetime-local"
//               id="endTime"
//               name="endTime"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               value={formData.endTime}
//               onChange={handleChange}
//               disabled={loading || success}
//               min={moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm')}
//             />
//           </div>

          
//           <div >
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
//               <FaImage className="inline mr-2" />
//               Image URL (optional)
//             </label>
//             <input
//               type="text"
//               id="imageUrl"
//               name="imageUrl"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               value={formData.imageUrl}
//               onChange={handleChange}
//               disabled={loading || success}
//               placeholder="https://example.com/image.jpg"
//             />
//           </div>
          
//           <button
//             type="submit"
//             className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
//               (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//             disabled={loading || success}
//           >
//             {loading ? 'Creating...' : success ? 'Created Successfully' : 'Create Auction'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
};

export default CreateAuction;

