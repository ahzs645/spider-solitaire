// Libraries
import React from 'react';
// Assets
import * as Styled from './styles';

function EmptySlotWarning({ onClose }) {
  return (
    <Styled.Overlay>
      <Styled.XPWrapper>
        <div className="window" style={{ width: '320px', maxWidth: '90vw' }}>
          <div className="title-bar">
            <div className="title-bar-text">Spider Solitaire</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={onClose}></button>
            </div>
          </div>
          <div className="window-body" style={{ padding: '12px 14px 14px' }}>
            <p style={{ margin: '2px 0 14px', textAlign: 'left' }}>
              You are not allowed to deal a new row while there are any empty slots.
            </p>

            <div
              className="field-row"
              style={{
                justifyContent: 'center',
                marginTop: '14px',
                gap: '14px'
              }}
            >
              <Styled.SmallButton onClick={onClose}>OK</Styled.SmallButton>
            </div>
          </div>
        </div>
      </Styled.XPWrapper>
    </Styled.Overlay>
  );
}

export default EmptySlotWarning;
