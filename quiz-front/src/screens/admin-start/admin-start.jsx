import React, {useState, useEffect, useRef} from 'react';
import './admin-start.css'
import Header from '../../components/header/header';
// import { useWebSocket } from '../../shared/WebSocketContext';
import { useNavigate } from 'react-router-dom';

const AdminStartPage = () => {
  const socket = useRef();
  const navigate = useNavigate();

  function generateRandomDigits() {
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += Math.floor(Math.random() * 10); // Генерация случайной цифры от 0 до 9
    }
    return result;
  }
  
  const handleStartGame = () => {
    socket.current = new WebSocket("ws://localhost:5002");
    socket.current.onopen = () => {
      console.log('Connected')
      const message = {
        event: "connection",
        username: `Администратор ${generateRandomDigits()}`,
        id: 'admin',
        room_id: generateRandomDigits()
      };
      socket.current.send(JSON.stringify(message));
      navigate(`/admin-dashboard?roomId=${generateRandomDigits()}`)
    };
    socket.current.onmessage = (event) => {
      // const message = JSON.parse(event.data);
      // setMessages((prev) => [message, ...prev]);
    };

    socket.current.onerror = () => {
      console.log("Socket произошла ошибка");
    };
  }



  return (
    <main className='admin-start'>
      <Header />
      <div className='admin-start__container'>
        <div className='admin-start__instruction-block'>
          <span>Создайте игру</span>

          <button className='admin-start__create-game' onClick={handleStartGame}>Создать Игру</button>
        </div>
        
      </div>
    </main>
  );
}

export default AdminStartPage;
