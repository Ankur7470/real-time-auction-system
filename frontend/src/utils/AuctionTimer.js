// import { useState, useEffect } from "react";

// export const AuctionTimer = ({ endTime }) => {
//     const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
//     useEffect(() => {
//       const timer = setInterval(() => {
//         setTimeLeft(calculateTimeLeft());
//       }, 1000);
  
//       return () => clearInterval(timer);
//     }, [endTime]);
  
//     function calculateTimeLeft() {
//       const difference = new Date(endTime) - Date.now();
//       if (difference <= 0) return 'Auction ended';
      
//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
//       return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//     }
  
//     return <div className="timer">{timeLeft}</div>;
//   };
  