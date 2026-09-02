// Original synthesized plucked-string voice for the curtain interaction —
// not a port of any reference implementation's synth, and not derived from
// any recording. See CHIME_THEMES in string-curtain.data.ts for the two
// shipped instrument profiles and the mood/reasoning behind each. The
// reverb tail is a procedurally-generated impulse response (shaped noise),
// not a sample.

import {
  CHIME_THEMES,
  MIN_PLUCK_INTERVAL_MS,
  VIEWPORT_FADE_S,
} from "./string-curtain.data";
import { TChimeProfile } from "./string-curtain.interface";

export type TPluckOptions = {
  particleId: number;
  columnT: number;
  intensity: number;
  force?: boolean;
};

// Quantizes a 0..1 column position onto the profile's scale, spread across
// its octave range — a tuned set of "strings" rather than a continuous
// sweep.
function frequencyForColumnT(columnT: number, profile: TChimeProfile) {
  const steps = profile.scaleIntervalsSemitones.length;
  const degreeCount = steps * profile.scaleOctaves;
  const degreeIndex = Math.round(
    Math.max(0, Math.min(1, columnT)) * (degreeCount - 1),
  );
  const octave = Math.floor(degreeIndex / steps);
  const semitones =
    octave * 12 + profile.scaleIntervalsSemitones[degreeIndex % steps];
  return profile.scaleRootHz * 2 ** (semitones / 12);
}

// White noise shaped by a decaying envelope — a standard technique for a
// synthetic reverb impulse response, built once per theme rather than
// loaded from any recording.
function buildReverbImpulse(ctx: BaseAudioContext, decayS: number) {
  const length = Math.floor(ctx.sampleRate * decayS);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.5;
    }
  }
  return impulse;
}

export class StringChimeVoice {
  private profile: TChimeProfile;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private lfo: OscillatorNode | null = null;
  // Continuous LFO driving pitch vibrato ("yuri") on every active note's
  // detune — one shared oscillator rather than one per note, since they'd
  // all want the same rate anyway.
  private vibratoDepth: GainNode | null = null;
  private active = true;
  private muted = false;
  private lastPluckAt = 0;
  private lastParticleId = -1;

  constructor(profile: TChimeProfile = CHIME_THEMES[0]) {
    this.profile = profile;
  }

  private ensureContext() {
    if (this.ctx) return this.ctx;
    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return null;

    const ctx = new AudioContextCtor();
    this.ctx = ctx;
    const profile = this.profile;

    this.master = ctx.createGain();
    // Starts at whatever gain the current active/muted state implies —
    // relevant if setMuted() was called before the first pluck ever
    // created the context.
    this.master.gain.value =
      this.active && !this.muted ? profile.masterVolume : 0;

    // Dry/wet reverb bus: master feeds both a direct path and a convolved
    // (procedural impulse response) path, summed at the destination — the
    // wet mix is what pushes this from "a synth pluck" toward "a space,"
    // without touching pitch/melody at all.
    this.dryGain = ctx.createGain();
    this.dryGain.gain.value = 1 - profile.reverbWetMix;
    this.wetGain = ctx.createGain();
    this.wetGain.gain.value = profile.reverbWetMix;
    this.convolver = ctx.createConvolver();
    this.convolver.buffer = buildReverbImpulse(ctx, profile.reverbDecayS);

    this.master.connect(this.dryGain);
    this.master.connect(this.convolver);
    this.convolver.connect(this.wetGain);
    this.dryGain.connect(ctx.destination);
    this.wetGain.connect(ctx.destination);

    this.lfo = ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.value = profile.vibratoRateHz;
    this.vibratoDepth = ctx.createGain();
    this.vibratoDepth.gain.value = profile.vibratoDepthCents;
    this.lfo.connect(this.vibratoDepth);
    this.lfo.start();

    return ctx;
  }

  private syncGain() {
    if (!this.ctx || !this.master) return;
    const target = this.active && !this.muted ? this.profile.masterVolume : 0;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + VIEWPORT_FADE_S);
  }

  // Called when the section enters/leaves the viewport. Also cuts short
  // any currently-ringing note when it leaves — deliberately different
  // from a plain pointer-leave, which lets a plucked note ring out
  // naturally instead of being hard-stopped.
  setActive(inView: boolean) {
    if (this.active === inView) return;
    this.active = inView;
    this.syncGain();
  }

  setMuted(muted: boolean) {
    if (this.muted === muted) return;
    this.muted = muted;
    this.syncGain();
  }

  get isMuted() {
    return this.muted;
  }

  // Switches instrument. Notes already ringing are unaffected — each
  // captured its own envelope/pitch values at trigger time — this only
  // changes what the *next* pluck sounds like and live-retunes the parts
  // of the graph that were fixed at context-creation time (reverb mix/
  // length, vibrato, master volume target).
  setTheme(profile: TChimeProfile) {
    if (this.profile.id === profile.id) return;
    const previousDecay = this.profile.reverbDecayS;
    this.profile = profile;
    if (!this.ctx) return; // Nothing built yet — ensureContext() will read the new profile.

    if (this.dryGain) this.dryGain.gain.value = 1 - profile.reverbWetMix;
    if (this.wetGain) this.wetGain.gain.value = profile.reverbWetMix;
    if (this.convolver && previousDecay !== profile.reverbDecayS) {
      this.convolver.buffer = buildReverbImpulse(
        this.ctx,
        profile.reverbDecayS,
      );
    }
    if (this.lfo) this.lfo.frequency.value = profile.vibratoRateHz;
    if (this.vibratoDepth)
      this.vibratoDepth.gain.value = profile.vibratoDepthCents;
    this.syncGain();
  }

  get currentTheme() {
    return this.profile;
  }

  pluck({ particleId, columnT, intensity, force = false }: TPluckOptions) {
    if (!this.active || this.muted) return;
    if (typeof window === "undefined") return;

    const now = performance.now();
    if (!force) {
      if (now - this.lastPluckAt < MIN_PLUCK_INTERVAL_MS) return;
      if (particleId === this.lastParticleId) return;
    }

    const ctx = this.ensureContext();
    if (!ctx || !this.master || !this.vibratoDepth) return;
    if (ctx.state === "suspended") void ctx.resume();

    this.lastPluckAt = now;
    this.lastParticleId = particleId;

    const profile = this.profile;
    const clampedIntensity = Math.max(0.15, Math.min(1, intensity));
    const detune = 0.99 + Math.random() * 0.02;
    const freq = frequencyForColumnT(columnT, profile) * detune;
    const decay = profile.pluckDecayS * (0.5 + clampedIntensity * 0.6);
    const peak = profile.pluckPeakGain * (0.4 + clampedIntensity * 0.7);
    const bendStartRatio = 2 ** (profile.pitchBendStartCents / 1200);

    const t = ctx.currentTime;
    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0.0001, t);
    voice.gain.exponentialRampToValueAtTime(
      Math.max(0.0005, peak),
      t + profile.pluckAttackS,
    );
    voice.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    voice.connect(this.master);

    for (const [ratio, gain] of profile.pluckPartials) {
      const osc = ctx.createOscillator();
      const partialGain = ctx.createGain();
      osc.type = "sine";
      // Settles up into pitch rather than starting on it — a soft
      // attack articulation, not a melodic figure (identical shape on
      // every note).
      const target = freq * ratio;
      osc.frequency.setValueAtTime(target * bendStartRatio, t);
      osc.frequency.exponentialRampToValueAtTime(
        target,
        t + profile.pitchBendTimeS,
      );
      this.vibratoDepth.connect(osc.detune);
      partialGain.gain.value = gain;
      osc.connect(partialGain);
      partialGain.connect(voice);
      osc.start(t);
      osc.stop(t + decay + 0.02);
      osc.onended = () => {
        this.vibratoDepth?.disconnect(osc.detune);
        osc.disconnect();
        partialGain.disconnect();
      };
    }

    const noiseBuffer = ctx.createBuffer(
      1,
      Math.max(1, Math.floor(ctx.sampleRate * profile.breathNoiseDurS)),
      ctx.sampleRate,
    );
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = profile.breathNoiseFilterHz;
    noiseFilter.Q.value = profile.breathNoiseQ;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(
      profile.breathNoiseGain * clampedIntensity,
      t,
    );
    noiseGain.gain.exponentialRampToValueAtTime(
      0.0001,
      t + profile.breathNoiseDurS,
    );
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(voice);
    noise.start(t);
    noise.stop(t + profile.breathNoiseDurS + 0.01);
    noise.onended = () => {
      noise.disconnect();
      noiseFilter.disconnect();
      noiseGain.disconnect();
    };
  }
}
