import { FACE_REGIONS } from './faceLandmarks';

export class SkinToneAnalyzer {
  constructor() {
    this.lastResult = null;
    this.sampleCanvas = document.createElement('canvas');
    this.sampleCtx = this.sampleCanvas.getContext('2d', { willReadFrequently: true });
  }

  analyze(videoElement, landmarks) {
    if (!landmarks) return this.lastResult;

    const w = videoElement.videoWidth;
    const h = videoElement.videoHeight;
    this.sampleCanvas.width = w;
    this.sampleCanvas.height = h;
    this.sampleCtx.drawImage(videoElement, 0, 0, w, h);

    const imageData = this.sampleCtx.getImageData(0, 0, w, h);
    const pixels = imageData.data;

    // Sample skin pixels from known face points
    const sampleIndices = FACE_REGIONS.skinSamplePoints;
    let totalR = 0, totalG = 0, totalB = 0, count = 0;

    for (const idx of sampleIndices) {
      const lm = landmarks[idx];
      if (!lm) continue;

      const px = Math.floor(lm.x * w);
      const py = Math.floor(lm.y * h);

      // Sample 5×5 area around the landmark
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const sx = px + dx;
          const sy = py + dy;
          if (sx < 0 || sx >= w || sy < 0 || sy >= h) continue;
          const i = (sy * w + sx) * 4;
          totalR += pixels[i];
          totalG += pixels[i + 1];
          totalB += pixels[i + 2];
          count++;
        }
      }
    }

    if (count === 0) return this.lastResult;

    const avgR = totalR / count;
    const avgG = totalG / count;
    const avgB = totalB / count;

    const tone = this._classifyTone(avgR, avgG, avgB);
    const undertone = this._classifyUndertone(avgR, avgG, avgB);
    const hex = `#${Math.round(avgR).toString(16).padStart(2, '0')}${Math.round(avgG).toString(16).padStart(2, '0')}${Math.round(avgB).toString(16).padStart(2, '0')}`;

    this.lastResult = { r: avgR, g: avgG, b: avgB, hex, tone, undertone };
    return this.lastResult;
  }

  _classifyTone(r, g, b) {
    const brightness = (r + g + b) / 3;
    if (brightness > 200) return 'Fair';
    if (brightness > 170) return 'Light';
    if (brightness > 140) return 'Medium';
    if (brightness > 110) return 'Tan';
    return 'Deep';
  }

  _classifyUndertone(r, g, b) {
    // Warm = more yellow/golden, Cool = more pink/blue, Neutral = balanced
    const warmScore = (r - b) + (g - b) * 0.5;
    const coolScore = (b - r) * 0.7 + (b - g) * 0.3;

    if (warmScore > 30) return 'Warm';
    if (coolScore > 10) return 'Cool';
    return 'Neutral';
  }
}