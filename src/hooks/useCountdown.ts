import React from 'react';

export const useCountdown = (date: Date) => {
  const resolveCountdown = () => {
    const diff = date.getTime() - Date.now();
    if (diff < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        done: true,
      };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      done: false,
    };
  };
  const [countdown, setCountdown] = React.useState(resolveCountdown);
  React.useEffect(() => {
    const timer = setInterval(() => setCountdown(resolveCountdown()), 1000);
    return () => clearInterval(timer);
  }, [date]);

  return countdown;
};
