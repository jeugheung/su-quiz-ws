import React from 'react';
import './question-table.css'

const QuestionTable = () => {

  const handleQuestionClick = () => {
    console.log('click')
  }
  return (
    <div className='question-table'>
      <div className='question-table__content-container'>
        <span className='question-table__main-title'>Числа</span>
        <div className='question-table__question-stack'>
          <div className='question-table__question-item' onClick={handleQuestionClick}>
            <span>10</span>
            <span>баллов</span>
          </div>
          <div className='question-table__question-item'>
            <span>20</span>
            <span>баллов</span>
          </div>
        </div>
      </div>

      <div className='question-table__content-container'>
        <span className='question-table__main-title'>Сатпаев</span>
        <div className='question-table__question-stack'>
          <div className='question-table__question-item'>
            <span>10</span>
            <span>баллов</span>
          </div>
          <div className='question-table__question-item'>
            <span>20</span>
            <span>баллов</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionTable;
