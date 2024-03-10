import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './user-sign-in.css';
import suLogo from '../../assets/suLogo.png'
import formLogo from '../../assets/formLogo.png'
import axios from 'axios';

const UserSignIn = () => {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  const socket = useRef();
  const newUser = {
    username: 'example_user',
    points: 100,
    room_id: 'example_room'
  };

  const userConnection = () => {
    socket.current = new WebSocket("ws://localhost:5002");
    socket.current.onopen = () => {
      console.log('Connected')
      setConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
      axios.post('http://localhost:5002/users', newUser)
      .then(response => {
        console.log('User created:', response.data);
        navigate('/user-game');
      })
      .catch(error => {
        console.error('Error creating user:', error.response.data);
      });
      
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
    <div className='user-sign__form'>
      <img src={suLogo} alt='' className='user-sign__top-logo'></img>
      <img src={formLogo} alt='' className='user-sign__middle-logo'></img>
      <div className='user-sign__form-block'>
        <input 
          className='user-sign__form-input' 
          type='text' 
          placeholder='Введите имя'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className='user-sign__form-btn' onClick={userConnection}>Войти</button>
      </div>
    </div>
  );
}

export default UserSignIn;
