// src/utils/voiceAlert.js

let currentUtterance = null;

export const speakAlert = (text) => {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 1;
  window.speechSynthesis.speak(currentUtterance);
};

export const stopAlert = () => {
  window.speechSynthesis.cancel();
  currentUtterance = null;
};
