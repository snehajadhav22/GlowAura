'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useRouter }    from 'next/navigation';
import toast             from 'react-hot-toast';
import { FaceDetector }     from '@/lib/ar/faceDetector';
import { MakeupRenderer }   from '@/lib/ar/makeupRenderer';
import { SkinToneAnalyzer } from '@/lib/ar/skinToneAnalyzer';
import { LightCorrector }   from '@/lib/ar/lightCorrector';
import { ShadeRecommender } from '@/lib/ar/shadeRecommender';
import ARLoading       from './ARLoading';
import FaceGuide       from './FaceGuide';
import ShadePanel      from './ShadePanel';
import CaptureControls from './CaptureControls';
import CompareSlider   from './CompareSlider';

export default function ARStudio({ product, shades, onClose }) {
  const router = useRouter();
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const detectorRef  = useRef(null);
  const rendererRef  = useRef(null);
  const skinRef      = useRef(null);
  const lightRef     = useRef(null);
  const recommenderRef = useRef(null);
  const streamRef      = useRef(null);

  const [phase, setPhase]             = useState('loading'); // loading, guide, active, error
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMessage, setLoadMessage]   = useState('Initializing AR Studio...');
  const [faceDetected, setFaceDetected] = useState(false);
  const [skinTone, setSkinTone]         = useState(null);
  const [recommendations, setRecs]      = useState([]);
  const [selectedShade, setSelectedShade] = useState(shades?.[0]?.hex || '#CC5555');
  const [intensity, setIntensity]       = useState(0.55);
  const [finish, setFinish]             = useState('matte');
  const [showBeforeAfter, setShowBA]    = useState(false);
  const [compareMode, setCompareMode]   = useState(false);
  const [compareSplit, setCompareSplit]  = useState(0.5);
  const [compareShadeB, setCompareSB]   = useState(null);
  const [capturedImage, setCaptured]    = useState(null);
  const [facingMode, setFacingMode]     = useState('user');
  const [activeProducts, setActiveProds] = useState([]);
  const [errorMsg, setErrorMsg]         = useState('');
  const faceStableCount = useRef(0);

  // ----- INITIALIZATION -----
  useEffect(() => {
    let cancelled = false;

    const init = async (retryCount = 0) => {
      try {
        setPhase('loading');
        setErrorMsg('');

        // 1. Initialize face detector
        if (!detectorRef.current) {
          setLoadMessage('Loading AI face detection... ✨');
          detectorRef.current  = new FaceDetector();
          skinRef.current      = new SkinToneAnalyzer();
          lightRef.current     = new LightCorrector();
          recommenderRef.current = new ShadeRecommender();

          const success = await detectorRef.current.initialize(p => {
            if (!cancelled) setLoadProgress(p);
          });
          if (!success) throw new Error('AI Engine failed to load. Check your internet.');
        }

        // 2. Request camera with a tiny delay to ensure OS stabilizes
        setLoadMessage('Summoning camera... 📷');
        await new Promise(r => setTimeout(r, 200)); 

        if (cancelled) return;

        // Cleanup any existing stream just in case
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: facingMode }, 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          },
          audio: false,
        });

        if (cancelled) { 
          stream.getTracks().forEach(t => t.stop()); 
          return; 
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for metadata to ensure video is ready
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = resolve;
          });
          await videoRef.current.play();
        }

        setPhase('guide');
      } catch (err) {
        console.error('AR Init Error:', err);
        if (cancelled) return;

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMsg('Camera access denied! Please unlock the camera in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setErrorMsg('No camera found. AR Studio requires a camera to work.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError' || err.message?.includes('use')) {
          setErrorMsg('Camera is busy! Close other apps (like Zoom or other tabs) using your camera.');
        } else if (err.name === 'OverconstrainedError') {
          // If 720p is too much, try default
          if (retryCount === 0) return init(1);
          setErrorMsg('Your camera settings are not supported. Try a different device.');
        } else {
          setErrorMsg(err.message || 'Something went wrong while starting AR Studio.');
        }
        setPhase('error');
      }
    };

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      detectorRef.current?.destroy();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [facingMode]); // Re-init if facingMode changes manually via state if needed, 
                    // though we handle flip separately, it's safer to have it here too.

  // ----- Setup renderer when canvas is ready -----
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new MakeupRenderer(canvasRef.current);
    }
  }, [phase]);

  // ----- RENDER LOOP -----
  const loop = useCallback((timestamp) => {
    const video = videoRef.current;
    const renderer = rendererRef.current;
    if (!video || !renderer || !detectorRef.current?.ready) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }
    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    // Throttle detection to ~30fps for performance
    if (timestamp - lastTimestamp.current < 33) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }
    lastTimestamp.current = timestamp;

    // Resize canvas once
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (renderer.canvas.width !== vw || renderer.canvas.height !== vh) {
      renderer.resize(vw, vh);
    }

    // Auto lighting
    if (lightRef.current) {
      const lightFilter = lightRef.current.getCSSFilter();
      video.style.filter = lightFilter;
    }

    // Detect face
    const landmarks = detectorRef.current.detect(video, timestamp);
    const hasFace = !!landmarks;
    if (hasFace !== faceDetected) setFaceDetected(hasFace);

    if (hasFace && phase === 'guide') {
      faceStableCount.current++;
      if (faceStableCount.current > 5) { // Faster transition
        setPhase('active');

        // Analyze skin tone (expensive operation - deferred)
        setTimeout(() => {
          if (!videoRef.current) return;
          const tone = skinRef.current.analyze(video, landmarks);
          if (tone) {
            setSkinTone(tone);
            const initialRecs = recommenderRef.current.recommend(product.category, tone);
            setRecs(initialRecs);
            if (initialRecs[0]?.hex) setSelectedShade(initialRecs[0].hex);
          }
        }, 100);

        // Set initial product immediately
        const initialProduct = {
          id: product._id || 'main',
          type: product.category,
          color: selectedShade,
          opacity: intensity,
          finish,
        };
        renderer.setProduct(initialProduct.id, initialProduct);
        setActiveProds([initialProduct]);
      }
    } else if (!hasFace) {
      faceStableCount.current = 0;
    }

    // Light analysis (deferred)
    if (timestamp % 500 < 33) lightRef.current?.analyze(video);

    renderer.render(video, landmarks);
    rafRef.current = requestAnimationFrame(loop);
  }, [phase, product, faceDetected, selectedShade, intensity, finish]);

  useEffect(() => {
    if (phase !== 'guide' && phase !== 'active') return;
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [loop, phase]);

  // ----- Sync shade/intensity/finish changes -----
  useEffect(() => {
    if (!rendererRef.current) return;
    const id = product._id || 'main';
    rendererRef.current.setProduct(id, {
      type: product.category,
      color: selectedShade,
      opacity: intensity,
      finish,
    });
    rendererRef.current.showMakeup = !showBeforeAfter;
    rendererRef.current.compareMode = compareMode;
    rendererRef.current.compareSplit = compareSplit;
    rendererRef.current.compareShadeB = compareShadeB;

    setActiveProds(prev =>
      prev.map(p => p.id === id ? { ...p, color: selectedShade, opacity: intensity, finish } : p)
    );
  }, [selectedShade, intensity, finish, showBeforeAfter, compareMode, compareSplit, compareShadeB]);

  // ----- Handlers -----
  const handleCapture = useCallback(() => {
    if (!canvasRef.current) return;
    setCaptured(canvasRef.current.toDataURL('image/png'));
    toast.success('Look captured! ✨');
  }, []);

  const handleFlip = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch { toast.error('Camera flip failed'); }
  }, [facingMode]);

  const handleRemoveProduct = useCallback((id) => {
    rendererRef.current?.removeProduct(id);
    setActiveProds(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleAddProduct = useCallback(() => {
    toast('Select another product from the shop to layer on!', { icon: '💄' });
  }, []);

  const handleSave = useCallback(async () => {
    if (!capturedImage) return;
    toast.success('Look saved to your profile! 💾');
    setCaptured(null);
  }, [capturedImage]);

  // ----- RENDER -----
  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* Close button */}
      <button
        onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); onClose(); }}
        className="absolute top-4 right-4 z-40 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/10">
        <X size={20} />
      </button>

      {/* Product label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-black/40 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10">
        <p className="text-white text-sm font-semibold text-center">{product.title}</p>
        <p className="text-pink-400 text-[10px] text-center">{product.brand} · {product.category}</p>
      </div>

      {/* Video element (hidden, used as source) */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />

      {/* Canvas overlay for makeup */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />

      {/* Loading state */}
      {phase === 'loading' && (
        <ARLoading progress={loadProgress} message={loadMessage} />
      )}

      {/* Error state */}
      {phase === 'error' && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md text-center border border-red-500/30">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-3">AR Studio Unavailable</h3>
            <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setPhase('loading');
                  // This will trigger the useEffect because state changes
                  window.location.reload(); 
                }} 
                className="btn-primary w-full"
              >
                Try Again ✨
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-white text-sm font-bold transition-colors">Go Back</button>
            </div>
          </div>
        </div>
      )}

      {/* Face guide */}
      <FaceGuide visible={phase === 'guide'} faceDetected={faceDetected} />

      {/* No face warning */}
      {phase === 'active' && !faceDetected && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/20 animate-pulse">
           ✨ Bestie, I can't see your face!
        </div>
      )}

      {/* Floating Sparkles when active */}
      {phase === 'active' && faceDetected && (
        <div className="absolute inset-x-0 top-20 pointer-events-none flex justify-center gap-20 overflow-hidden h-32">
           <div className="text-3xl animate-float opacity-40">💖</div>
           <div className="text-2xl animate-float opacity-30" style={{ animationDelay: '1s' }}>✨</div>
           <div className="text-4xl animate-float opacity-40" style={{ animationDelay: '0.5s' }}>💖</div>
        </div>
      )}

      {/* Capture controls + skin tone */}
      {phase === 'active' && (
        <CaptureControls
          onCapture={handleCapture}
          onFlipCamera={handleFlip}
          capturedImage={capturedImage}
          onClearCapture={() => setCaptured(null)}
          onSave={handleSave}
          skinTone={skinTone}
        />
      )}

      {/* Compare slider */}
      <CompareSlider
        active={compareMode && phase === 'active'}
        split={compareSplit}
        onSplitChange={setCompareSplit}
        shadeA={selectedShade}
        shadeB={compareShadeB}
      />

      {/* Shade panel */}
      {phase === 'active' && (
        <ShadePanel
          product={product}
          shades={shades}
          selectedShade={selectedShade}
          onSelectShade={setSelectedShade}
          intensity={intensity}
          onIntensityChange={setIntensity}
          finish={finish}
          onFinishChange={setFinish}
          onRemoveProduct={handleRemoveProduct}
          onAddProduct={handleAddProduct}
          recommendations={recommendations}
          showBeforeAfter={showBeforeAfter}
          onToggleBeforeAfter={() => setShowBA(p => !p)}
          compareMode={compareMode}
          onToggleCompare={() => setCompareMode(p => !p)}
          compareShadeB={compareShadeB}
          onSelectCompareShade={setCompareSB}
          activeProducts={activeProducts}
        />
      )}
    </div>
  );
}