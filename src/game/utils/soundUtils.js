// Assets
import CannotDealSound from '../../assets/audios/cannot-deal.ogg';
import DealSound from '../../assets/audios/deal.ogg';
import HintSound from '../../assets/audios/hint.ogg';
import MouseDownSound from '../../assets/audios/mouse-down.ogg';
import NoHintSound from '../../assets/audios/no-hint.ogg';
import WinSound from '../../assets/audios/win.ogg';

const audios = {
  'cannot-deal': CannotDealSound,
  deal: DealSound,
  hint: HintSound,
  'mouse-down': MouseDownSound,
  'no-hint': NoHintSound,
  win: WinSound,
};

// Cache single audio instances per sound to avoid creating too many players
const audioInstances = {};

const getOrCreateAudio = (soundName) => {
  if (!audioInstances[soundName]) {
    const audio = new Audio(audios[soundName]);
    audio.preload = 'auto';

    const originalPlay = audio.play.bind(audio);
    audio.play = () => {
      try {
        audio.currentTime = 0;
      } catch (e) {
        // Ignore errors resetting currentTime (e.g., if not ready)
      }

      const playPromise = originalPlay();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
      return playPromise;
    };

    audioInstances[soundName] = audio;
  }

  return audioInstances[soundName];
};

/*
  ====================================================
  Returns playable Audio objects of the given sound
  Return value: Array
  ====================================================
*/

export default function getSounds(...soundList) {
  const soundPlayFunctions = [];

  soundList.forEach((soundName) => {
    soundPlayFunctions.push(getOrCreateAudio(soundName));
  });

  return soundPlayFunctions;
}
