/**
 * Web Audio API synthesizer for realistic phone ringtone and conversational voice simulator
 */

let audioCtx = null;
let ringInterval = null;
let isRinging = false;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a double-frequency phone ring burst (Standard US/UK/India cadence: 440Hz + 480Hz)
 */
const playRingBurst = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Standard phone frequencies
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.setValueAtTime(480, ctx.currentTime);

    // Fade envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime + 1.6);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);

    osc1.stop(ctx.currentTime + 1.8);
    osc2.stop(ctx.currentTime + 1.8);
  } catch (err) {
    console.warn('Audio ringtone synthesis error:', err);
  }
};

/**
 * Start repeating ringtone cadence
 */
export const startRingtone = () => {
  if (isRinging) return;
  isRinging = true;

  playRingBurst();
  ringInterval = setInterval(() => {
    if (!isRinging) {
      clearInterval(ringInterval);
      return;
    }
    playRingBurst();
  }, 3500);

  // Trigger device vibration if supported
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
    } catch (e) {
      // ignore vibration errors
    }
  }
};

/**
 * Stop repeating ringtone
 */
export const stopRingtone = () => {
  isRinging = false;
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch (e) {
      // ignore
    }
  }
};

/**
 * Voice conversation simulator using Web Speech API
 */
export const speakCallerDialogue = (text, onEnd) => {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  utterance.lang = 'en-IN'; // Indian English voice preference

  const voices = window.speechSynthesis.getVoices();
  const indianOrNaturalVoice = voices.find(
    (v) => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.name.toLowerCase().includes('natural')
  );
  if (indianOrNaturalVoice) {
    utterance.voice = indianOrNaturalVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopCallerDialogue = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
