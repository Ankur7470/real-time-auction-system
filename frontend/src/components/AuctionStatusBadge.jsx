import React from 'react';

const AuctionStatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
  
  const getStatusClasses = (status) => {
  switch (status) {
    case 'ACTIVE':
        return 'bg-green-100 text-green-800';
    case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
    case 'CANCELLED':
        return 'bg-red-100 text-red-800';
    default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <span className={`${baseClasses} ${getStatusClasses(status)}`}>
      {status}
    </span>
  );
};

export default AuctionStatusBadge;
