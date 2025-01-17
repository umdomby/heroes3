"use client";
import { useEffect, useState } from 'react';

// Define the structure of globalData
interface GlobalData {
    usersPlay: number;
    pointsBet: number;
    users: number;
    pointsStart: number;
    pointsAllUsers: number;
}

export const GlobalData = () => {
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial data when the component mounts
    const fetchInitialData = async () => {
        try {
            const response = await fetch('/api/get-global-data');
            if (!response.ok) {
                throw new Error('Failed to fetch initial global data');
            }
            const data = await response.json();
            setGlobalData(data); // Set the initial data
        } catch (error) {
            console.error('Error fetching initial global data:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        // Fetch initial data
        fetchInitialData();

        // Set up SSE for real-time updates
        const eventSource = new EventSource('/api/sse-global');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'update') {
                    setGlobalData(data.data); // Update data in real-time
                }
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = () => {
            console.error('SSE error occurred');
            eventSource.close();
        };

        // Cleanup SSE on component unmount
        return () => {
            eventSource.close();
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!globalData) {
        return <div>Failed to load global data</div>;
    }

    return (
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <p>Users: {globalData.users}</p>
            <span>|</span>
            <p>Start Points: {globalData.pointsStart}</p>
            <span>|</span>
            <p>Bet Points: {globalData.pointsAllUsers}</p>
            <span>|</span>
            <p>Bet open: {globalData.usersPlay}</p>
            <span>|</span>
            <p>Bet Points: {globalData.pointsBet}</p>
        </div>
    );
};
