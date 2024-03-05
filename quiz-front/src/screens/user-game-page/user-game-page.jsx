import React, {useEffect, useState} from 'react';
import './user-game-page.css'
import Header from '../../components/header/header';
import { useWebSocket } from '../../shared/WebSocketContext';

const UserGamePage = () => {
  const [messages, setMessages] = useState([]);
  const socket = useWebSocket();

  useEffect(() => {
    
    if (socket) {
      
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message)
        setMessages(prevMessages => [...prevMessages, message]);
        // Обработка входящего сообщения
      };
    }
  }, [socket]);

  return (
    <main className='user-game'>
      <Header />
      <div className='user-game__container'>
        {messages.map((mess) => (
            <div key={mess.id}>
              {mess.event === "connection" ? (
                <div className="connection_message">
                  Пользователь {mess.username} подключился
                </div>
              ) : (
                <div className="message">
                  {mess.username}. {mess.message}
                </div>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}

export default UserGamePage;
