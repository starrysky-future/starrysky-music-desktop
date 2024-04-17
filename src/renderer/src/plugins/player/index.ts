let audio: HTMLAudioElement | null = null;

export const createAudio = () => {
  if (audio) return;
  audio = new window.Audio();
  audio.controls = false; // 不显示控制面板
  audio.autoplay = true; // 资源就绪后自动播放
  audio.preload = 'auto'; // 当页面加载后载入整个音频
  audio.crossOrigin = 'anonymous'; // 支持跨域
};

export const setResource = (src: string) => {
  if (audio) audio.src = src;
};

export const setPlay = () => {
  audio?.play();
};

export const setPause = () => {
  audio?.pause();
};

export const setStop = () => {
  if (audio) {
    audio.src = '';
    audio.removeAttribute('src');
  }
};

export const setMediaDeviceId = (mediaDeviceId: string) => {
  // @ts-expect-error
  return audio ? audio.setSinkId(mediaDeviceId) : Promise.resolve();
};

export const isEmpty = (): boolean => !audio?.src;

export const setLoopPlay = (isLoop: boolean) => {
  if (audio) audio.loop = isLoop;
};

export const getPlaybackRate = (): number => {
  return audio?.defaultPlaybackRate ?? 1;
};

export const setPlaybackRate = (rate: number) => {
  if (!audio) return;
  audio.defaultPlaybackRate = rate;
  audio.playbackRate = rate;
};

export const setPreservesPitch = (preservesPitch: boolean) => {
  if (!audio) return;
  audio.preservesPitch = preservesPitch;
};

export const getMute = (): boolean => {
  return audio?.muted ?? false;
};

export const setMute = (isMute: boolean) => {
  if (audio) audio.muted = isMute;
};

export const getCurrentTime = () => {
  return audio?.currentTime ?? 0;
};

export const setCurrentTime = (time: number) => {
  if (audio) audio.currentTime = time;
};

export const setVolume = (volume: number) => {
  if (audio) audio.volume = volume;
};

export const getDuration = () => {
  return audio?.duration ?? 0;
};

type Noop = () => void;

export const onPlaying = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('playing', callback);
  return () => {
    audio?.removeEventListener('playing', callback);
  };
};

export const onPause = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio?.addEventListener('pause', callback);
  return () => {
    audio?.removeEventListener('pause', callback);
  };
};

export const onEnded = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('ended', callback);
  return () => {
    audio?.removeEventListener('ended', callback);
  };
};

export const onError = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('error', callback);
  return () => {
    audio?.removeEventListener('error', callback);
  };
};

export const onLoadeddata = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('loadeddata', callback);
  return () => {
    audio?.removeEventListener('loadeddata', callback);
  };
};

export const onLoadstart = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('loadstart', callback);
  return () => {
    audio?.removeEventListener('loadstart', callback);
  };
};

export const onCanplay = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('canplay', callback);
  return () => {
    audio?.removeEventListener('canplay', callback);
  };
};

export const onEmptied = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('emptied', callback);
  return () => {
    audio?.removeEventListener('emptied', callback);
  };
};

export const onTimeupdate = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('timeupdate', callback);
  return () => {
    audio?.removeEventListener('timeupdate', callback);
  };
};

export const onWaiting = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined');

  audio.addEventListener('waiting', callback);
  return () => {
    audio?.removeEventListener('waiting', callback);
  };
};

export const getErrorCode = () => {
  return audio?.error?.code;
};
