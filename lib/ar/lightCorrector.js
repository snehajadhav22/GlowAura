export class LightCorrector {
  constructor() {
    this.analysisCanvas = document.createElement('canvas');
    this.analysisCtx = this.analysisCanvas.getContext('2d', { willReadFrequently: true });
    this.correction = { brightness: 0, contrast: 1, saturation: 1 };
    this.frameCount = 0;
  }

  // Analyze every Nth frame for performance
  analyze(videoElement, interval = 15) {
    this.frameCount++;
    if (this.frameCount % interval !== 0) return this.correction;

    const w = 160; // Downscale for speed
    const h = 120;
    this.analysisCanvas.width = w;
    this.analysisCanvas.height = h;
    this.analysisCtx.drawImage(videoElement, 0, 0, w, h);

    const imageData = this.analysisCtx.getImageData(0, 0, w, h);
    const pixels = imageData.data;

    let totalBrightness = 0;
    let totalSaturation = 0;
    const len = pixels.length;

    for (let i = 0; i < len; i += 16) { // Sample every 4th pixel
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      totalBrightness += brightness;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      totalSaturation += sat;
    }

    const sampleCount = len / 16;
    const avgBrightness = totalBrightness / sampleCount;
    const avgSaturation = totalSaturation / sampleCount;

    // Target: brightness ~130, saturation ~0.3
    const targetBrightness = 130;
    const targetSaturation = 0.3;

    const brightnessDiff = targetBrightness - avgBrightness;
    const saturationRatio = avgSaturation > 0.01 ? targetSaturation / avgSaturation : 1;

    this.correction = {
      brightness: Math.max(-40, Math.min(40, brightnessDiff * 0.3)),
      contrast: avgBrightness < 80 ? 1.2 : avgBrightness > 180 ? 0.9 : 1.0,
      saturation: Math.max(0.7, Math.min(1.5, saturationRatio)),
    };

    return this.correction;
  }

  getCSSFilter() {
    const { brightness, contrast, saturation } = this.correction;
    const b = 100 + brightness;
    return `brightness(${b}%) contrast(${(contrast * 100).toFixed(0)}%) saturate(${(saturation * 100).toFixed(0)}%)`;
  }
}