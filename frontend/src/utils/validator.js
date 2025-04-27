export const validateBidAmount = (amount, currentPrice) => {
    if (isNaN(amount)) {
    return 'Please enter a valid amount';
    }
    
    if (amount <= 0) {
    return 'Bid amount must be positive';
    }
    
    if (amount <= currentPrice) {
    return `Bid must be higher than current price: $${currentPrice.toFixed(2)}`;
    }
    
    return null;
    };
    
    export const validateAuctionForm = (values) => {
    const errors = {};
    
    if (!values.title) {
    errors.title = 'Title is required';
    } else if (values.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
    } else if (values.title.length > 100) {
    errors.title = 'Title must be at most 100 characters';
    }
    
    if (!values.description) {
    errors.description = 'Description is required';
    } else if (values.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
    }
    
    if (!values.startingPrice) {
    errors.startingPrice = 'Starting price is required';
    } else if (isNaN(values.startingPrice) || parseFloat(values.startingPrice) <= 0) {
    errors.startingPrice = 'Starting price must be a positive number';
    }
    
    if (!values.category) {
    errors.category = 'Category is required';
    }
    
    if (!values.endTime) {
    errors.endTime = 'End time is required';
    }
    
    return errors;
    };