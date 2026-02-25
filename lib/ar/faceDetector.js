let FaceLandmarkerClass = null;
let FilesetResolverClass = null;

export class FaceDetector {
  constructor() {
    this.landmarker = null;
    this.ready = false;
    this.lastResult = null;
    this.loadProgress = 0;
  }

  async initialize(onProgress) {
    try {
      onProgress?.(10);

      // Dynamic import — keeps bundle lean
      const vision = await import('@mediapipe/tasks-vision');
      FaceLandmarkerClass = vision.FaceLandmarker;
      FilesetResolverClass = vision.FilesetResolver;

      onProgress?.(30);

      const fileset = await FilesetResolverClass.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      onProgress?.(60);

      this.landmarker = await FaceLandmarkerClass.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });

      onProgress?.(100);
      this.ready = true;
      return true;
    } catch (err) {
      console.error('FaceDetector init failed:', err);
      // Fallback to CPU
      try {
        const vision = await import('@mediapipe/tasks-vision');
        const fileset = await vision.FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        this.landmarker = await vision.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        });
        this.ready = true;
        onProgress?.(100);
        return true;
      } catch (e2) {
        console.error('CPU fallback failed:', e2);
        return false;
      }
    }
  }

  detect(videoElement, timestamp) {
    if (!this.ready || !this.landmarker) return null;
    try {
      const result = this.landmarker.detectForVideo(videoElement, timestamp);
      if (result.faceLandmarks && result.faceLandmarks.length > 0) {
        this.lastResult = result.faceLandmarks[0];
        return this.lastResult;
      }
      return null;
    } catch {
      return this.lastResult;
    }
  }

  destroy() {
    if (this.landmarker) {
      this.landmarker.close();
      this.landmarker = null;
    }
    this.ready = false;
  }
}