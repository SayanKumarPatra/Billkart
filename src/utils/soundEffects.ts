/**
 * BillKart Smart POS - Web Audio API Sound Effects Helper
 * Synthesizes crisp, latency-free POS sound effects directly in the browser:
 * 1. Barcode Scan Success Beep
 * 2. Barcode Scan / Validation Error Chime
 * 3. Bill Generation Receipt Chime
 * 4. Payment Success Celebratory Fanfare Chime
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Sound preferences
const SOUND_STORAGE_KEY = 'billkart_sound_enabled';

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(SOUND_STORAGE_KEY);
  return val === null ? true : val === 'true';
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
}

export function toggleSoundEnabled(): boolean {
  const current = isSoundEnabled();
  setSoundEnabled(!current);
  return !current;
}

/**
 * 1. Barcode Scan Success: High-pitched crisp POS scanner confirmation beep
 */
export function playBarcodeScanSuccess(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // 1980 Hz is the standard supermarket/retail optical barcode reader confirmation tone
    osc.frequency.setValueAtTime(1980, now);

    // Ultra-crisp envelope
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);

    // Subtle tactile haptic kick on supported mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(45);
    }
  } catch {
    // Ignore audio policy restrictions gracefully
  }
}

/**
 * 2. Barcode Scan Error / Not Found Chime: Gentle two-tone descending warning
 */
export function playBarcodeScanError(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: 420 Hz
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(420, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Tone 2: Descending to 260 Hz
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(260, now + 0.095);
    gain2.gain.setValueAtTime(0.22, now + 0.095);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.095);
    osc2.stop(now + 0.22);

    // Double haptic buzz for alert
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 40, 80]);
    }
  } catch {
    // Ignore audio policy restrictions gracefully
  }
}

/**
 * 3. Bill Generation Receipt Sound: Rapid ascending 3-note melodic flutter
 * Represents the register printing & calculating the bill total
 */
export function playBillGenerateSound(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Notes: C5 (523Hz), E5 (659Hz), G5 (784Hz)
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.16, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([35, 30, 50]);
    }
  } catch {
    // Ignore audio policy restrictions gracefully
  }
}

/**
 * 4. Payment Success Celebratory Fanfare: Harmonious warm chord with shimmering sparkle
 */
export function playPaymentSuccessSound(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Major chord arpeggio into rich resonant resolution:
    // C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50), E6 (1318.51)
    const chords = [
      { freq: 523.25, offset: 0.00, dur: 0.35, gain: 0.18 },
      { freq: 659.25, offset: 0.06, dur: 0.38, gain: 0.18 },
      { freq: 783.99, offset: 0.12, dur: 0.42, gain: 0.19 },
      { freq: 1046.50, offset: 0.18, dur: 0.55, gain: 0.22 },
      { freq: 1318.51, offset: 0.24, dur: 0.65, gain: 0.16 },
    ];

    chords.forEach(({ freq, offset, dur, gain: targetGain }) => {
      const startTime = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(targetGain, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });

    // Celebratory rhythmic haptic pattern
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 60, 60, 40, 100]);
    }
  } catch {
    // Ignore audio policy restrictions gracefully
  }
}
