import React, {useEffect, useState} from 'react';
import './user-game-page.css'
import Header from '../../components/header/header';
import { useWebSocket } from '../../shared/WebSocketContext';
import MembersTable from '../../components/members-table/members-table';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const UserGamePage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const roomId = searchParams.get('roomId');

  const [question, setQuestion] = useState();
  const [currentUser, setCurrentUser] = useState()
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const socket = useWebSocket();
  const [userData, setUserData] = useState(null);


  const fetchUserData = async () => {
    try {
      // Выполняем GET-запрос для получения информации о пользователе по его id
      const response = await axios.get(`http://localhost:5002/user/${userId}`);
      console.log('USER DATA BY ID', response.data)
      // Устанавливаем полученные данные в state
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  useEffect(() => {
    console.log("USER ID",userId)
    fetchUserData()
    if (socket) {
      
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message)
        // eslint-disable-next-line eqeqeq
        if (message.event == 'connection') {
          console.log('connection')
          console.log('CURRENT USER', message)
          setCurrentUser(message)
        
        // eslint-disable-next-line eqeqeq
        } else if (message.event == 'start_game') {
          setQuestion(message.question)
          console.log('start_game----', question)
        } else if (message.event === 'user_answer') {
          alert('OTVER')
        }
        
        // Обработка входящего сообщения
      };
    }
  }, []);

  const handleAnswerClick = () => {
    // console.log('Selected question:', gameQuestion);
    if (socket && question) {
      const message = {
        event: "user_answer",
        question: question,
        user: currentUser
      };
      console.log(message)
      socket.send(JSON.stringify(message));
      setAnswerSubmitted(true);
    }
  }

  return (
    <main className='user-game'>
      <Header />
      <div className='user-game__container'>
        {/* <MembersTable members={members}/> */}
        <div className='user-game__question-container'>
          {question ? (
            <div className='user-game__question'>
              <span className='user-game__points'>Вопрос на {question.points}</span>
              <div className='user-game__question-block'>
                <span className='user-game__category'>Тема : {question.category}</span>
                <span className='user-game__task'>{question.question_kz}</span>
                <span className='user-game__task'>{question.question_ru}</span>
              </div>
              {answerSubmitted ? (
                <button className='user-game__reply-btn__submitted' disabled>Вы ответили</button>
              ) : (
                <button className='user-game__reply-btn' onClick={handleAnswerClick}>Ответить</button>
              )}
            </div>
          ) : (
            <div className='user-game__no-question'>
              <span>Ожидайте ответа администратора</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default UserGamePage;
