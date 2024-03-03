import React from 'react';
import './user-sign-in.css';
import suLogo from '../../assets/suLogo.png'
import formLogo from '../../assets/formLogo.png'

const UserSignIn = () => {
  return (
    <div className='user-sign__form'>
      <img src={suLogo} alt='' className='user-sign__top-logo'></img>
      <img src={formLogo} alt='' className='user-sign__middle-logo'></img>
      <div className='user-sign__form-block'>
        <input className='user-sign__form-input' type='text' placeholder='Введите имя'/>
        <button className='user-sign__form-btn'>Войти</button>
      </div>
    </div>
  );
}

export default UserSignIn;
