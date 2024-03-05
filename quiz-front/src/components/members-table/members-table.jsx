import React from 'react';
import './members-table.css'

const MembersTable = ({members}) => {
  console.log('MEMBERS',members)
  return (
    <div className='members-table'>
      <h2 className='members__main-title'>Участники</h2>

      <div className='members__list'>
        {members.map((mess) => (
          (mess.event === "connection") && (
            <div key={mess.id} className="members__item">
              <div className='members__profile-circle'>{mess.username[0]}</div>
              <div className='members__profile-info'>
                <span className='members__username'>{mess.username}</span>
                <span>Количество баллов</span>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MembersTable;
