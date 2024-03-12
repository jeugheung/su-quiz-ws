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

const AdminDashboardPage = () => {
  const [gameQuestion, setGameQuestion] = useState(null);
  const socket = useWebSocket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId')

  const handleStartGame = () => {
    console.log('Selected question:', gameQuestion);
    if (socket && gameQuestion) {
      const message = {
        event: "start_game",
        question: gameQuestion
      };
      socket.send(JSON.stringify(message));
      const gameData = {
        current_question_ru: gameQuestion.question_ru,
        current_question_kz: gameQuestion.question_kz,
        question_id: gameQuestion.id,
        game_step: 1
      };
  
      try {
        const response = axios.post('http://localhost:5002/games', {
          room_id: roomId,
          gameData: gameData
        });
        console.log('Game data saved:', response.data);
        navigate(`/admin-answers?roomId=${roomId}`)
      } catch (error) {
        console.error('Error saving or updating game data:', error);
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
            <button className='dashboard__button' onClick={handleStartGame}>Начать игру</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
