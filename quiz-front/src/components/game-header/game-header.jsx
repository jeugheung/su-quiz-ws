import './game-header.css'
import React, {useEffect, useState, useRef} from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const GameHeader = () => {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId')

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/games/${roomId}`);
                const gameData = response.data;
                console.log('Game data:', gameData);
                // Здесь вы можете обновить состояние вашего компонента с полученными данными
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchGameData();

        // В случае, если вы хотите выполнить запрос только при загрузке компонента,
        // передайте пустой массив зависимостей в useEffect.
    }, []);

    return (
        <div className='game-header'>
            <div className='game-header__container'>
                <h3>Номер комнаты {roomId}</h3>
                <h3>Номер хода</h3>
            </div>
        </div>
    );
}

export default GameHeader;
