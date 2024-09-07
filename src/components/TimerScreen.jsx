import React, { useState, useEffect } from 'react';

const TimerScreen = ({ onPlayAudio }) => {
    const [seconds, setSeconds] = useState(10);
    const [isTimerDone, setIsTimerDone] = useState(false);

    useEffect(() => {
        if (seconds === 0) {
            setIsTimerDone(true);
            return;
        }

        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const handlePlayClick = () => {
        onPlayAudio();
        setIsTimerDone(true);
    };

    return (
        <div className="timer-screen">
            {!isTimerDone ? (
                <div className="timer-content">
                    <h1>Time Remaining: {seconds}s</h1>
                    <button onClick={handlePlayClick}>Play Audio</button>
                </div>
            ) : (
                <div className="timer-content">
                    <p>Timer Done</p>
                </div>
            )}
        </div>
    );
};

export default TimerScreen;
