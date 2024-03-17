import React, {useState, useEffect} from 'react';
// import './admin-dashboard.css'
import './admin-answers.css'
import Header from '../../components/header/header';
import { useWebSocket } from '../../shared/WebSocketContext';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {ThreeCircles} from 'react-loader-spinner'

const AdminAnswersPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState()
  const [topList, setTopList] = useState([])
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const [selectedItem, setSelectedItem] = useState(null);
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(true)

  const socket = useWebSocket();


  const handleClick = (user_id) => {
    console.log('SELECTED WINNER',user_id)
    setSelectedItem(user_id);
  };

  const handleEndStep = () => {
    const requestBody = {
      user_id: selectedItem, // Замените на реальный user_id
      points: gameData.points // Количество баллов для добавления
    };

    fetch('http://localhost:5002/updatePoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка HTTP: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Ответ сервера:', data);
      navigate(`/admin-dashboard?roomId=${roomId}`)
 
      
    })
    .catch(error => {
      console.error('Ошибка запроса:', error.message);
    });

    console.log(requestBody)

  }


  useEffect(() => {
    const fetchGameData = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/games/${roomId}`);
            const gameData = response.data;
            console.log('Game data:', gameData);
            setGameData(gameData)
            setQuestion(gameData)
            setTimeout(() => {
              setLoading(false);
            }, 500)
            // Здесь вы можете обновить состояние вашего компонента с полученными данными
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
    };

    fetchGameData();

    // В случае, если вы хотите выполнить запрос только при загрузке компонента,
    // передайте пустой массив зависимостей в useEffect.
}, []);

  // useEffect(() => {
    
  //   if (socket) {
      
  //     socket.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       console.log(message)
  //       if (message.event === 'connection') {
  //       } else if (message.event === 'start_game') {
  //         setQuestion(message.question)
  //         console.log('start_game----', question)
  //       } else if (message.event === 'user_answer') {
  //         console.log('ANSWER ---- ', message.user.username)
  //         setAnswers(message.user.username)
  //         console.log('SETTING ANSWER---', answers)
  //         setTopList(prevMessages => [...prevMessages, message]);
  //       }
        
  //       // Обработка входящего сообщения
  //     };
  //   }
  // }, [socket]);

  if (loading) {
    return (
      <div className='answers-loader-container'>
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <main className='user-game'>
      <Header />
      <div className='user-game__container'>

        <div className='user-game__question-container'>
          <div>
            <span>Номер комнаты {roomId}</span>
            <span>Номер хода {gameData ? gameData.game_step : ''}</span>
          </div>
          {question ? (
            <div className='user-game__question'>
              <span className='user-game__points'>Вопрос на {question.points}</span>
              <div className='user-game__question-block'>
                <span className='user-game__category'>Тема : {question.category}</span>
                <span className='user-game__task'>{question.current_question_kz}</span>
                <span className='user-game__task'>{question.current_question_ru}</span>
              </div>
              {selectedItem ? (
                <div className='admin-answers__end-step' onClick={handleEndStep}>Завершить ход</div>
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
            <span className='user-game__answers-title'>Ответы участников</span>
            <div className='user-game__top-container'>
              {gameData && gameData.answers && (
                gameData.answers.map((answer, index) => (
                  <div key={index} className={`user-game__top-item ${selectedItem === index ? 'selected' : ''}`}>
                    <div className="user-game__top-user">
                      <div className="user-game__top-circle" style={{ backgroundColor: index === 0 ? 'green' : index === 1 ? 'red' : 'blue' }}>{index + 1}</div>
                      <span>{answer.user_id}</span>
                    </div>
                    <div className="user-game__top-btns">
                      <button className="user-game__correct-answer"  onClick={() => handleClick(answer.user_id)}>Правильно</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

export default AdminAnswersPage;
