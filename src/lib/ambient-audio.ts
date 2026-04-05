export type AmbientPreset = "silence" | "lofi" | "rain" | "coffee";

interface ActivePreset {
  nodes: AudioNode[];
  stop: () => void;
}

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;
let activePreset: ActivePreset | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function getMasterGain(): GainNode {
  if (!masterGain) {
    const ctx = getContext();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

export function getAnalyser(): AnalyserNode | null {
  return analyserNode;
}

function ensureAnalyser(): AnalyserNode {
  if (!analyserNode) {
    const ctx = getContext();
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 64;
    analyserNode.connect(getMasterGain());
  }
  return analyserNode;
}

function createNoiseBuffer(type: "white" | "brown"): AudioBuffer {
  const ctx = getContext();
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * 4; // 4 seconds, will loop
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else {
    // Brown noise via random walk
    let value = 0;
    for (let i = 0; i < length; i++) {
      value += (Math.random() * 2 - 1) * 0.02;
      if (value > 1) value = 1;
      if (value < -1) value = -1;
      data[i] = value;
    }
  }

  return buffer;
}

function createLoopingSource(buffer: AudioBuffer): AudioBufferSourceNode {
  const ctx = getContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function startLofi(): ActivePreset {
  const ctx = getContext();
  const analyser = ensureAnalyser();
  const nodes: AudioNode[] = [];

  // Brown noise source
  const brownBuffer = createNoiseBuffer("brown");
  const source = createLoopingSource(brownBuffer);
  nodes.push(source);

  // Warm lowpass filter
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 800;
  lowpass.Q.value = 1.5;
  nodes.push(lowpass);

  // LFO for slow modulation
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15; // Very slow
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);
  lfo.start();
  nodes.push(lfo, lfoGain);

  // Subtle gain
  const gain = ctx.createGain();
  gain.gain.value = 0.6;
  nodes.push(gain);

  source.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(analyser);

  source.start();

  return {
    nodes,
    stop: () => {
      source.stop();
      lfo.stop();
      nodes.forEach((n) => n.disconnect());
    },
  };
}

function startRain(): ActivePreset {
  const ctx = getContext();
  const analyser = ensureAnalyser();
  const nodes: AudioNode[] = [];

  // White noise source for rain base
  const whiteBuffer = createNoiseBuffer("white");
  const source = createLoopingSource(whiteBuffer);
  nodes.push(source);

  // Bandpass filter for rain character
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 3000;
  bandpass.Q.value = 0.5;
  nodes.push(bandpass);

  // Highpass to remove rumble
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 400;
  nodes.push(highpass);

  const gain = ctx.createGain();
  gain.gain.value = 0.35;
  nodes.push(gain);

  source.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gain);
  gain.connect(analyser);

  source.start();

  // Random amplitude modulation for rain droplet feel
  let animId: number;
  const modulate = () => {
    const now = ctx.currentTime;
    const burst = 0.3 + Math.random() * 0.15;
    gain.gain.setTargetAtTime(burst, now, 0.1 + Math.random() * 0.3);
    animId = window.setTimeout(modulate, 200 + Math.random() * 800) as unknown as number;
  };
  modulate();

  return {
    nodes,
    stop: () => {
      clearTimeout(animId);
      source.stop();
      nodes.forEach((n) => n.disconnect());
    },
  };
}

function startCoffee(): ActivePreset {
  const ctx = getContext();
  const analyser = ensureAnalyser();
  const nodes: AudioNode[] = [];

  // Brown noise for ambient murmur
  const brownBuffer = createNoiseBuffer("brown");
  const murmurSource = createLoopingSource(brownBuffer);
  nodes.push(murmurSource);

  const murmurFilter = ctx.createBiquadFilter();
  murmurFilter.type = "lowpass";
  murmurFilter.frequency.value = 500;
  murmurFilter.Q.value = 0.7;
  nodes.push(murmurFilter);

  const murmurGain = ctx.createGain();
  murmurGain.gain.value = 0.4;
  nodes.push(murmurGain);

  murmurSource.connect(murmurFilter);
  murmurFilter.connect(murmurGain);
  murmurGain.connect(analyser);
  murmurSource.start();

  // White noise for subtle high-freq ambience
  const whiteBuffer = createNoiseBuffer("white");
  const ambientSource = createLoopingSource(whiteBuffer);
  nodes.push(ambientSource);

  const ambientFilter = ctx.createBiquadFilter();
  ambientFilter.type = "highpass";
  ambientFilter.frequency.value = 6000;
  nodes.push(ambientFilter);

  const ambientGain = ctx.createGain();
  ambientGain.gain.value = 0.04;
  nodes.push(ambientGain);

  ambientSource.connect(ambientFilter);
  ambientFilter.connect(ambientGain);
  ambientGain.connect(analyser);
  ambientSource.start();

  // Occasional subtle clicks (short bursts)
  let clickTimeout: number;
  const scheduleClick = () => {
    clickTimeout = window.setTimeout(() => {
      const clickBuffer = ctx.createBuffer(
        1,
        Math.floor(ctx.sampleRate * 0.01),
        ctx.sampleRate,
      );
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * (1 - i / clickData.length);
      }
      const clickSource = ctx.createBufferSource();
      clickSource.buffer = clickBuffer;

      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = "highpass";
      clickFilter.frequency.value = 2000;

      const clickGain = ctx.createGain();
      clickGain.gain.value = 0.08 + Math.random() * 0.06;

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(analyser);
      clickSource.start();
      clickSource.onended = () => {
        clickSource.disconnect();
        clickFilter.disconnect();
        clickGain.disconnect();
      };

      scheduleClick();
    }, 800 + Math.random() * 3000) as unknown as number;
  };
  scheduleClick();

  return {
    nodes,
    stop: () => {
      clearTimeout(clickTimeout);
      murmurSource.stop();
      ambientSource.stop();
      nodes.forEach((n) => n.disconnect());
    },
  };
}

const presetStarters: Record<string, () => ActivePreset> = {
  lofi: startLofi,
  rain: startRain,
  coffee: startCoffee,
};

export async function playPreset(preset: AmbientPreset): Promise<void> {
  // Stop any currently playing preset
  if (activePreset) {
    activePreset.stop();
    activePreset = null;
  }

  if (preset === "silence") {
    return;
  }

  const ctx = getContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const starter = presetStarters[preset];
  if (starter) {
    activePreset = starter();
  }
}

export function setVolume(volume: number): void {
  const gain = getMasterGain();
  const ctx = getContext();
  gain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime, 0.05);
}

export function isPlaying(): boolean {
  return activePreset !== null;
}

export function stopAll(): void {
  if (activePreset) {
    activePreset.stop();
    activePreset = null;
  }
}
