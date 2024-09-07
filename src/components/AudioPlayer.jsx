import React, { useState, useRef } from 'react';
import { IoPlayCircleOutline } from "react-icons/io5";
const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false); // State to track playback status
    const audioRef = useRef(null); // Ref to access the audio element

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause(); // Pause the audio if currently playing
            } else {
                audioRef.current.play(); // Play the audio if currently paused
            }
            setIsPlaying(!isPlaying); // Toggle the playback state
        }
    };

    return (
        <div className='audioPlayer'>
            {!isPlaying && <div className="cross"></div>}
            <IoPlayCircleOutline onClick={togglePlayPause} />
            <audio ref={audioRef} src="/bg-audio.mp3" />
        </div>
    );
};

export default AudioPlayer;
