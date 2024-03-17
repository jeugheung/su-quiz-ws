import React, {useState, useEffect} from 'react';
import './admin-dashboard.css'
import Header from '../../components/header/header';
import MembersTable from '../../components/members-table/members-table';
import QuestionTable from '../../components/question-table/question-table';
import { useWebSocket } from '../../shared/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import GameHeader from '../../components/game-header/game-header';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {ThreeDots} from 'react-loader-spinner';

const AdminDashboardPage = () => {
  const [gameQuestion, setGameQuestion] = useState(null);
  const socket = useWebSocket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId')
  const [loading, setLoading] = useState(false)

  const [game, setGame] = useState()

  useEffect(() => {
    const fetchGameData = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/games/${roomId}`);
            const gameData = response.data;
            console.log('Game data:', gameData);
            setGame(gameData)
            // Здесь вы можете обновить состояние вашего компонента с полученными данными
        } catch (error) {
            console.error('Error fetching game data:', error);
        }
    };

    fetchGameData();

    // В случае, если вы хотите выполнить запрос только при загрузке компонента,
    // передайте пустой массив зависимостей в useEffect.
  }, []);

  const handleStartGame = () => {
    setLoading(true);
    console.log('Selected question:', gameQuestion);
    if (socket && gameQuestion) {
      const message = {
        event: "start_game",
        question: gameQuestion
      };
      // socket.send(JSON.stringify(message));
      // console.log(game)
      const gameData = {
        current_question_ru: gameQuestion.question_ru,
        current_question_kz: gameQuestion.question_kz,
        question_id: gameQuestion.id,
        points: gameQuestion.points,
        category: gameQuestion.category,
        game_step: game.game_step + 1,
        answers: [],
        answered_count: 0
      };
  
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            room_id: roomId,
            gameData: gameData
          })
        };
      
        fetch('http://localhost:5002/games', requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to save game data');
            }
            return response.json();
          })
          .then(data => {
            console.log('Game data saved:', data);
            
            // Устанавливаем задержку в 1 секунду перед выполнением навигации
            setTimeout(() => {
              setLoading(false);
              navigate(`/admin-answers?roomId=${roomId}`);
            }, 500);
          })
          .catch(error => {
            console.error('Error saving game data:', error);
            // Обработка ошибки сохранения данных
          });
      } catch (error) {
        console.error('Error saving game data:', error);
        // Обработка ошибки сохранения данных
      }
    }
  };
  

  return (
    <main className='dashboard'>
      <Header />
      <div className='dashboard__container'>
        <GameHeader />
        <div className='dashboard__content'>
          <MembersTable/>
          <div className='dashboard__tableview'>
            <QuestionTable setGameQuestion={setGameQuestion}/>
            <button className='dashboard__button' onClick={() => handleStartGame()}>
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="80"
                  width="80"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                <button className='dashboard__button' onClick={handleStartGame}>
                  Начать игру
                </button>
              )}
             
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
