import React, {useState, useEffect} from 'react';
import './admin-dashboard.css'
import Header from '../../components/header/header';
import MembersTable from '../../components/members-table/members-table';
import QuestionTable from '../../components/question-table/question-table';
import { useWebSocket } from '../../shared/WebSocketContext';

const AdminDashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const socket = useWebSocket();

  useEffect(() => {
    
    if (socket) {
      
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message)
        setMessages(prevMessages => [...prevMessages, message]);
      };
    }
  }, [socket]);

  return (
    <main className='dashboard'>
      <Header />
      <div className='dashboard__container'>
        <MembersTable members={messages}/>
        <QuestionTable />
      </div>
    </main>
  );
}

export default AdminDashboardPage;
