// Libraries
import React, { useState } from 'react';
// Assets
import * as Styled from './styles';

function SuitGroup({ suits }) {
  return (
    <Styled.SuitGroupWrapper>
      {suits.map((suit, i) => (
        <Styled.SuitIcon
          key={i}
          src={`${process.env.PUBLIC_URL}/suits/${suit}.png`}
          alt={suit}
        />
      ))}
    </Styled.SuitGroupWrapper>
  );
}

function OptionRow({ checked, onChange, suits, labelText, descriptionText }) {
  return (
    <Styled.OptionRowWrapper>
      <Styled.IconColumn>
        <SuitGroup suits={suits} />
      </Styled.IconColumn>
      <input
        type="radio"
        name="difficulty"
        checked={checked}
        onChange={onChange}
        style={{ margin: 0 }}
      />
      <Styled.LabelWrapper onClick={onChange}>
        <Styled.LabelText>{labelText}</Styled.LabelText>
        <span>{descriptionText}</span>
      </Styled.LabelWrapper>
    </Styled.OptionRowWrapper>
  );
}

function DifficultyDialog({ onSelectDifficulty, onCancel }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const handleOk = () => {
    onSelectDifficulty(selectedDifficulty);
  };

  return (
    <Styled.Overlay>
      <Styled.XPWrapper>
        <div className="window" style={{ width: '320px', maxWidth: '90vw' }}>
          <div className="title-bar">
            <div className="title-bar-text">Difficulty</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onCancel}></button>
            </div>
          </div>
          <div className="window-body" style={{ padding: '12px 14px 14px' }}>
            <p style={{ margin: '2px 0 10px', textAlign: 'left' }}>
              Select the game difficulty level that you want:
            </p>

            <Styled.OptionsContainer>
              <OptionRow
                checked={selectedDifficulty === 'easy'}
                onChange={() => setSelectedDifficulty('easy')}
                suits={['Spades']}
                labelText="Easy:"
                descriptionText="One Suit"
              />
              <OptionRow
                checked={selectedDifficulty === 'medium'}
                onChange={() => setSelectedDifficulty('medium')}
                suits={['Hearts', 'Spades']}
                labelText="Medium:"
                descriptionText="Two Suits"
              />
              <OptionRow
                checked={selectedDifficulty === 'difficult'}
                onChange={() => setSelectedDifficulty('difficult')}
                suits={['Diamonds', 'Clubs', 'Hearts', 'Spades']}
                labelText="Difficult:"
                descriptionText="Four Suits"
              />
            </Styled.OptionsContainer>

            <div
              className="field-row"
              style={{
                justifyContent: 'center',
                marginTop: '14px',
                gap: '14px'
              }}
            >
              <Styled.SmallButton onClick={handleOk}>OK</Styled.SmallButton>
              <Styled.SmallButton onClick={onCancel}>Cancel</Styled.SmallButton>
            </div>
          </div>
        </div>
      </Styled.XPWrapper>
    </Styled.Overlay>
  );
}

export default DifficultyDialog;
