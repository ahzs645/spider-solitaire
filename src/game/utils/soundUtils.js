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

// Singleton audio instances to avoid creating too many Audio elements
const audioInstances = {};

function getAudioInstance(soundName) {
  if (!audioInstances[soundName]) {
    audioInstances[soundName] = new Audio(audios[soundName]);
  }
  return audioInstances[soundName];
}

/*
  ====================================================
  Returns playable Audio objects of the given sound
  Return value: Array
  ====================================================
*/

export default function getSounds(...soundList) {
  const soundPlayFunctions = [];

  soundList.forEach((soundName) => {
    const audio = getAudioInstance(soundName);
    // Create a wrapper that resets and plays the audio
    const playWrapper = {
      play: () => {
        audio.currentTime = 0; // Reset to start
        audio.play().catch(() => {}); // Ignore errors
      },
    };
    soundPlayFunctions.push(playWrapper);
  });

  return soundPlayFunctions;
}
