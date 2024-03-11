import React, {useState, useEffect} from 'react';
// import './admin-dashboard.css'
import './admin-answers.css'
import Header from '../../components/header/header';
import MembersTable from '../../components/members-table/members-table';
import { useWebSocket } from '../../shared/WebSocketContext';

const AdminAnswersPage = () => {
  const [members, setMembers] = useState([]);
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState()
  const [topList, setTopList] = useState([])
  const socket = useWebSocket();

  useEffect(() => {
    
    if (socket) {
      
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message)
        if (message.event === 'connection') {
          console.log('connection')
          console.log('CURRENT USER', message)
          setMembers(prevMessages => [...prevMessages, message]);
        } else if (message.event === 'start_game') {
          setQuestion(message.question)
          console.log('start_game----', question)
        } else if (message.event === 'user_answer') {
          console.log('ANSWER ---- ', message.user.username)
          setAnswers(message.user.username)
          console.log('SETTING ANSWER---', answers)
          setTopList(prevMessages => [...prevMessages, message]);
        }
        
        // Обработка входящего сообщения
      };
    }
  }, [socket]);


  return (
    <main className='user-game'>
      <Header />
      <div className='user-game__container'>
        <div className='user-game__question-container'>
          {question ? (
            <div className='user-game__question'>
              <span className='user-game__points'>Вопрос на {question.points}</span>
              <div className='user-game__question-block'>
                <span className='user-game__category'>Тема : {question.category}</span>
                <span className='user-game__task'>{question.question_kz}</span>
                <span className='user-game__task'>{question.question_ru}</span>
              </div>
              {answers ? (
                <div className='answers__answer-block'>
                  <span className='answers__answer-title'>Отвечает: {answers}</span>
                  <div className='answers__btn-stack'>
                    <button className='answers__btn-correct'>Правильно</button>
                    <button className='answers__btn-incorrect'>Неправильно</button>
                  </div>
                </div>
              ) : (
                <div className='admin-answers__reply-btn'>Ожидайте ответа участников</div>
              )}
            </div>
          ) : (
            <div className='user-game__no-question'>
              <span>Ожидайте ответа администратора</span>
            </div>
          )}
          <div className='user-game__top-table'>
            <span>{topList}</span>
          </div>

        </div>
      </div>
    </main>
  );
}

export default AdminAnswersPage;
