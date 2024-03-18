import React, {useEffect, useState, useRef} from 'react';
import { useSearchParams } from 'react-router-dom';
import './members-table.css'
import axios from 'axios';
import {Hourglass} from 'react-loader-spinner'

const MembersTable = () => {
  const socket = useRef();
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true)
  const roomId = searchParams.get('roomId')
  const apiUrl = process.env.REACT_APP_API
  const socketUrl = process.env.REACT_APP_SOCKET

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/${roomId}`);
      console.log('userdata', response.data)
      setUsers(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching users:');
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered by newUsers change');
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.current = new WebSocket(socketUrl);
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message from USE EFFECT', message);
      if (message.event === "connection") {
        console.log(',es')
        if (!users.some(user => user.id === message.id)) {
          setUsers(prevUsers => [...prevUsers, message]);
        }
      }
      // setUsers(prevUsers => [...prevUsers, message]);
      // if (!users.some(user => user.id === message.id)) {
      //   setUsers(prevUsers => [...prevUsers, message]);
      // }
    };
  
    // Возвращаем функцию очистки, чтобы закрыть соединение при размонтировании компонента
    return () => {
      socket.current.close();
    };
  }, []); // Пустой массив зависимостей означает, что эффект будет выполнен только один раз при монтировании компонента
  

  return (
    <div className='members-table'>
      <h2 className='members__main-title'>Участники</h2>

      
       {loading ? (
          <div className='members__loader-container'>
            <Hourglass
              visible={true}
              height="80"
              width="80"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={['#306cce', '#72a1ed']}
            />
          </div>
        ) : (
          <div className='members__list'>
            {users.map((user) => (
              <div key={user.id} className='members__item'>
                <div className='members__profile-circle'>{user.username[0]}</div>
                <div className='members__profile-info'>
                  <span className='members__username'>{user.username}</span>
                  <span>Количество баллов {user.points}</span>
                  {/* {mess.id !== 'admin' && <span>Количество баллов</span>} */}
                </div>
              </div>
            ))}
          </div>
       
        )}
      </div>

  );
}

export default MembersTable;
