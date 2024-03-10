import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './question-table.css'

const QuestionTable = ({setGameQuestion}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5002/questions'); // Замените на ваш путь к GET-запросу
        console.log('data from resp',response)
        setQuestions(response.data)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleQuestionClick = (question) => {
    setGameQuestion(question);
    setSelectedQuestion(question)
    // Дальнейшая обработка клика на вопрос
  };

  return (
    <div className='question-table'>
      {questions.map((category) => (
        <div key={category.category} className='question-table__content-container'>
          <span className='question-table__main-title'>{category.category}</span>
          <div className='question-table__question-stack'>
            {category.questions.map((question) => (
              <div
                key={question.id}
                className={`question-table__question-item ${selectedQuestion && selectedQuestion.id === question.id ? 'selected' : ''}`}
                onClick={() => handleQuestionClick(question)}
              >
                <span>{question.points}</span>
                <span>баллов</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionTable;
