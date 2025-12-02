// Libraries
import React, { useContext, useState } from 'react';
// Components | Utils
import { GameContext } from '../../contexts/GameContext';
import getSounds from '../../utils/soundUtils';
import { deal } from '../../utils/cardUtils';
// Assets
import * as Styled from './styles';

function WindowMenu() {
  const {
    cardDecks,
    setCardDecks,
    dealingDecks,
    setDealingDecks,
    setShowDifficultyDialog,
    gameStats,
  } = useContext(GameContext);

  const [activeMenu, setActiveMenu] = useState(null);

  const [cannotDealSound, dealSound] = getSounds(
    'cannot-deal',
    'deal',
  );

  /*
  ====================================================
  =================== HANDLER ========================
  ====================================================
  */

  const handleDealClick = () => {
    dealSound.play();
    const [returnedCardDecks, returnDealingDecks] = deal(
      cardDecks,
      dealingDecks,
      cannotDealSound,
    );
    setCardDecks(returnedCardDecks);
    setDealingDecks(returnDealingDecks);
  };

  const handleNewGameClick = () => {
    setShowDifficultyDialog(true);
    setActiveMenu(null);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleMenuHover = (menuId) => {
    if (activeMenu) {
      setActiveMenu(menuId);
    }
  };

  const handleCloseMenu = () => {
    setActiveMenu(null);
  };

  /*
  ====================================================
  ==================== RENDER ========================
  ====================================================
  */

  return (
    <Styled.MenuBarContainer>
      <Styled.MenuBar onClick={(e) => e.stopPropagation()}>
        <Styled.MenuItem
          className={activeMenu === 'game' ? 'active' : ''}
          onClick={() => handleMenuClick('game')}
          onMouseEnter={() => handleMenuHover('game')}
        >
          Game
        </Styled.MenuItem>
        <Styled.MenuItem
          className={dealingDecks.length === 0 ? 'disabled' : ''}
          onClick={dealingDecks.length > 0 ? handleDealClick : undefined}
        >
          Deal!
        </Styled.MenuItem>
        <Styled.MenuItem className="disabled">Help</Styled.MenuItem>
        <Styled.MenuBarLogo src="/gui/toolbar/barlogo.webp" alt="" />
      </Styled.MenuBar>

      {activeMenu === 'game' && (
        <>
          <Styled.MenuBackdrop onClick={handleCloseMenu} />
          <Styled.DropdownMenu>
            <Styled.MenuOption onClick={handleNewGameClick}>
              New Game
            </Styled.MenuOption>
            <Styled.MenuSeparator />
            <Styled.MenuOption className="disabled">
              Undo
            </Styled.MenuOption>
            <Styled.MenuSeparator />
            <Styled.MenuOption className="disabled">
              Options...
            </Styled.MenuOption>
          </Styled.DropdownMenu>
        </>
      )}
    </Styled.MenuBarContainer>
  );
}

export default WindowMenu;
