'use client'

// RealTimeClock.tsx
import React, { useEffect, useState } from 'react';
import { BiTime } from 'react-icons/bi';

const RealTimeClock: React.FC = () => {
  const [dateTime, setDateTime] = useState({
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime({
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    
    <div className="flex items-center space-x-2 text-black">
    <BiTime />
      <span>{dateTime.date}</span>
      <span>{dateTime.time}</span>
    </div>
  );
};

export default RealTimeClock;
