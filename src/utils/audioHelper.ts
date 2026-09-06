/**
 * BillKart Smart POS - Web Audio API Sound Effects Helper
 * Synthesizes short, latency-free, professional sound effects directly in the browser.
 * Supports:
 *  - playSound('success'): Crisp confirmation chime for successful actions, saves, and valid entries
 *  - playSound('error'): Clear descending tone for scanner errors, unknown barcodes, and form validation errors
 *  - Additional types: 'scan', 'warning', 'fanfare', 'click'
 */

export type SoundType = 'success' | 'error' | 'scan' | 'warning' | 'fanfare' | 'click';

let audioCtx: AudioContext | null = null;

const SOUND_STORAGE_KEY = 'billkart_sound_enabled';

/**
 * Checks if sound effects are enabled in user settings
 */
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(SOUND_STORAGE_KEY);
  return val === null ? true : val === 'true';
}

/**
 * Enable or disable sound effects
 */
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
}

/**
 * Toggle sound effects on/off
 */
export function toggleSoundEnabled(): boolean {
  const current = isSoundEnabled();
  setSoundEnabled(!current);
  return !current;
}

/**
 * Lazily retrieves and unlocks the Web Audio AudioContext
 */
function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    
    if (!audioCtx) {
      const AudioContextClass = 
        window.AudioContext || 
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play professional synthesized sound effects using the Web Audio API
 * @param type 'success' | 'error' | 'scan' | 'warning' | 'fanfare' | 'click'
 */
export function playSound(type: SoundType): void {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'success': {
        // Crisp, elegant confirmation chime (E6 -> A6 harmonic resolution)
        const notes = [
          { freq: 1318.51, time: now, dur: 0.12, gain: 0.16 },       // E6
          { freq: 1760.00, time: now + 0.055, dur: 0.22, gain: 0.20 }, // A6
        ];

        notes.forEach(({ freq, time, dur, gain: maxGain }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(maxGain, time + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0008, time + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(time);
          osc.stop(time + dur);
        });

        // Gentle confirmation haptic
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(35);
        }
        break;
      }

      case 'error': {
        // Clear, professional dual-tone descending warning chime for errors
        // Note 1: 360 Hz (G4-ish)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(360, now);
        gain1.gain.setValueAtTime(0.22, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.09);

        // Note 2: 240 Hz descending buzz
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(240, now + 0.095);
        gain2.gain.setValueAtTime(0.25, now + 0.095);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.095);
        osc2.stop(now + 0.24);

        // Alert haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([60, 40, 80]);
        }
        break;
      }

      case 'scan': {
        // Standard supermarket high-frequency optical barcode beep (1980 Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1980, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(45);
        }
        break;
      }

      case 'warning': {
        // Two quick cautionary beeps
        [0, 0.12].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(580, now + offset);
          gain.gain.setValueAtTime(0.15, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.08);
        });
        break;
      }

      case 'fanfare': {
        // Uplifting payment celebration arpeggio: C5 -> E5 -> G5 -> C6
        const arpeggio = [
          { freq: 523.25, offset: 0.00, dur: 0.35, gain: 0.16 },
          { freq: 659.25, offset: 0.06, dur: 0.38, gain: 0.18 },
          { freq: 783.99, offset: 0.12, dur: 0.42, gain: 0.19 },
          { freq: 1046.50, offset: 0.18, dur: 0.55, gain: 0.22 },
        ];

        arpeggio.forEach(({ freq, offset, dur, gain: g }) => {
          const startTime = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(g, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + dur);
        });

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 60, 60, 40, 100]);
        }
        break;
      }

      case 'click': {
        // Ultra-subtle tactile UI tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
    }
  } catch {
    // Gracefully handle any browser audio policy or autoplay restriction
  }
}

// Convenient alias methods matching functional workflows
export const playSuccessSound = () => playSound('success');
export const playErrorSound = () => playSound('error');
export const playScanSound = () => playSound('scan');
