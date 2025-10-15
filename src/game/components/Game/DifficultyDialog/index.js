// Libraries
import React, { useState } from 'react';
// Assets
import * as Styled from './styles';

function DifficultyDialog({ onSelectDifficulty, onCancel }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const handleOk = () => {
    onSelectDifficulty(selectedDifficulty);
  };

  return (
    <Styled.Overlay>
      <Styled.XPWrapper>
        <div className="window" style={{ width: '400px' }}>
          <div className="title-bar">
            <div className="title-bar-text">Difficulty</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onCancel}></button>
            </div>
          </div>
          <div className="window-body">
            <p style={{ marginBottom: '16px' }}>Select the game difficulty level that you want</p>

            <div className="field-row" style={{ marginBottom: '8px' }}>
              <input
                type="radio"
                id="easy"
                name="difficulty"
                value="easy"
                checked={selectedDifficulty === 'easy'}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              />
              <label htmlFor="easy">
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Spades.png`} alt="Spades" />
                {' '}Easy: One Suit
              </label>
            </div>

            <div className="field-row" style={{ marginBottom: '8px' }}>
              <input
                type="radio"
                id="medium"
                name="difficulty"
                value="medium"
                checked={selectedDifficulty === 'medium'}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              />
              <label htmlFor="medium">
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Hearts.png`} alt="Hearts" />
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Spades.png`} alt="Spades" />
                {' '}Medium: Two Suits
              </label>
            </div>

            <div className="field-row" style={{ marginBottom: '16px' }}>
              <input
                type="radio"
                id="difficult"
                name="difficulty"
                value="difficult"
                checked={selectedDifficulty === 'difficult'}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              />
              <label htmlFor="difficult">
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Diamonds.png`} alt="Diamonds" />
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Clubs.png`} alt="Clubs" />
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Hearts.png`} alt="Hearts" />
                <Styled.SuitIcon src={`${process.env.PUBLIC_URL}/suits/Spades.png`} alt="Spades" />
                {' '}Difficult: Four Suits
              </label>
            </div>

            <div className="field-row" style={{ justifyContent: 'center' }}>
              <button onClick={handleOk}>OK</button>
              <button onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </Styled.XPWrapper>
    </Styled.Overlay>
  );
}

export default DifficultyDialog;
