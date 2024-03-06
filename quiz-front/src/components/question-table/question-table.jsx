import React, {useState} from 'react';
import './question-table.css'

const QuestionTable = ({setGameQuestion}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    {
      category: "Цвета",
      questions: [
        { id: 1, question_kz: "Какой ваш любимый цвет?", question_ru: "Какой ваш любимый цвет?", points: 10, category: 'Цвета' },
        { id: 2, question_kz: "Какого цвета море?", question_ru: "Какого цвета море?", points: 20, category: 'Цвета' },
        // Другие вопросы в этой категории
      ]
    },
    {
      category: "Возраст",
      questions: [
        { id: 3, question_kz: "Сколько вам лет?", question_ru: "Сколько вам лет?", points: 5, category: 'Возраст' },
        // Другие вопросы в этой категории
      ]
    },
    // Другие категории
  ];
  
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
