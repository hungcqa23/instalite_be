export interface EncodeByResolution {
  inputPath: string;
  isHasAudio: boolean;
  resolution: {
    width: number;
    height: number;
  };
  outputSegmentPath: string;
  outputPath: string;
  bitrate: {
    720: number;
    1080: number;
    1440: number;
    original: number;
  };
}
