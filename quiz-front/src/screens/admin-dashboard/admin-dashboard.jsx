import React, {useState, useEffect} from 'react';
import './admin-dashboard.css'
import Header from '../../components/header/header';
import MembersTable from '../../components/members-table/members-table';
import QuestionTable from '../../components/question-table/question-table';
import { useWebSocket } from '../../shared/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import GameHeader from '../../components/game-header/game-header';

const AdminDashboardPage = () => {
  const [gameQuestion, setGameQuestion] = useState(null);
  const socket = useWebSocket();
  const navigate = useNavigate();

  const handleStartGame = () => {
    console.log('Selected question:', gameQuestion);
    if (socket && gameQuestion) {
      const message = {
        event: "start_game",
        question: gameQuestion
      };
      socket.send(JSON.stringify(message));
      navigate('/admin-answers')
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
