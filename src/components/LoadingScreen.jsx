import React from 'react';
import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
    const { progress } = useProgress();

    return (
        <div className='loadingScreen'>
            <h1>EWB</h1>
            <p className='para'>Change is coming in healthcare</p>
            <p>{Math.round(progress)}%</p>
        </div>
    );
}
