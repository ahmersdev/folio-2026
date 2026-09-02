export interface IStringCurtainProps {
  reducedMotion: boolean;
}

// One synthesized "instrument" for the curtain's pluck voice — see
// CHIME_THEMES in string-curtain.data.ts for the two shipped profiles and
// StringChimeVoice.setTheme() in string-curtain.chimes.ts for how switching
// between them retunes the live audio graph.
export type TChimeProfile = {
  id: string;
  label: string;

  scaleRootHz: number;
  scaleIntervalsSemitones: number[];
  scaleOctaves: number;

  pluckAttackS: number;
  pluckDecayS: number;
  pluckPeakGain: number;
  pluckPartials: [ratio: number, gain: number][];

  vibratoRateHz: number;
  vibratoDepthCents: number;
  pitchBendStartCents: number;
  pitchBendTimeS: number;

  breathNoiseDurS: number;
  breathNoiseGain: number;
  breathNoiseFilterHz: number;
  breathNoiseQ: number;

  reverbDecayS: number;
  reverbWetMix: number;
  masterVolume: number;
};
