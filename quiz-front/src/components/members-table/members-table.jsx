import React, {useEffect} from 'react';
import './members-table.css'
import axios from 'axios';

const MembersTable = ({members}) => {
  console.log('MEMBERS',members)

  // useEffect(() => {
  //   // Функция для выполнения GET-запроса к серверу
  //   const fetchMembers = async () => {
  //     try {
  //       // Выполняем GET-запрос к /users на локальном сервере
  //       const response = await axios.get('http://localhost:5002/users');
  //       console.log('USERS RESP', response)
  //     } catch (error) {
  //       console.error('Error fetching members:', error);
  //     }
  //   };

  //   // Вызываем функцию для загрузки участников при монтировании компонента
  //   fetchMembers();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className='members-table'>
      <h2 className='members__main-title'>Участники</h2>

      <div className='members__list'>
        {members.map((mess) => (
          (mess.event === "connection") && (
            <div key={mess.id} className="members__item">
              <div className={`members__profile-circle ${mess.id === 'admin' ? 'profile-circle__admin' : ''}`}>{mess.username[0]}</div>
              <div className='members__profile-info'>
                <span className='members__username'>{mess.username}</span>
                {mess.id !== 'admin' && <span>Количество баллов</span>}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MembersTable;
