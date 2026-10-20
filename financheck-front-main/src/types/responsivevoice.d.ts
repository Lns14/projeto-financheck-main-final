interface Window {
  responsiveVoice: {
    speak: (text: string, voice?: string, params?: object) => void;
    cancel: () => void;
    isPlaying: () => boolean;
  };
}
