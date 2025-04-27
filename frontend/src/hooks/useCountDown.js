// src/hooks/useCountdown.js
import { useState, useEffect } from 'react';
import moment from 'moment';

export const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!endTime) {
      setTimeLeft('End time not specified');
      return;
    }

    const updateTimeLeft = () => {
      const end = moment(endTime);
      const now = moment();
      
      if (now.isAfter(end)) {
        setTimeLeft('Auction has ended');
        setIsEnded(true);
        return;
      }
      
      const duration = moment.duration(end.diff(now));
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      
      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0) timeString += `${hours}h `;
      if (minutes > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;
      
      setTimeLeft(timeString);
      setIsEnded(false);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [endTime]);

  return { timeLeft, isEnded };
};
