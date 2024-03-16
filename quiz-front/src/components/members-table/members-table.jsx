import React, {useEffect, useState, useRef} from 'react';
import { useSearchParams } from 'react-router-dom';
import './members-table.css'
import axios from 'axios';

const MembersTable = () => {
  const socket = useRef();
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId')

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/users/${roomId}`);
      console.log('userdata', response.data)
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:');
    }
  };

  useEffect(() => {
    console.log('useEffect triggered by newUsers change');
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:5002");
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message from USE EFFECT', message);
      // setUsers(prevUsers => [...prevUsers, message]);
      if (!users.some(user => user.id === message.id)) {
        setUsers(prevUsers => [...prevUsers, message]);
      }
    };
  
    // Возвращаем функцию очистки, чтобы закрыть соединение при размонтировании компонента
    return () => {
      socket.current.close();
    };
  }, []); // Пустой массив зависимостей означает, что эффект будет выполнен только один раз при монтировании компонента
  

  return (
    <div className='members-table'>
      <h2 className='members__main-title'>Участники</h2>

      <div className='members__list'>
        {users && (
            users.map((user) => (
              <div key={user.id} className="members__item">
                <div className="members__profile-circle">{user.username[0]}</div>
                <div className='members__profile-info'>
                  <span className='members__username'>{user.username}</span>
                  <span>Количество баллов {user.points}</span>
                  {/* {mess.id !== 'admin' && <span>Количество баллов</span>} */}
                </div>
              </div>
            ))
          )
        }
        {/* {members.map((mess) => (
          (mess.event === "connection") && (
            <div key={mess.id} className="members__item">
              <div className={`members__profile-circle ${mess.id === 'admin' ? 'profile-circle__admin' : ''}`}>{mess.username[0]}</div>
              <div className='members__profile-info'>
                <span className='members__username'>{mess.username}</span>
                {mess.id !== 'admin' && <span>Количество баллов</span>}
              </div>
            </div>
          )
        ))} */}
      </div>
    </div>
  );
}

export default MembersTable;
