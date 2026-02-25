import { FACE_REGIONS, PRODUCT_REGION_MAP, getRegionPoints } from './faceLandmarks';

export class MakeupRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.offscreen = document.createElement('canvas');
        this.offCtx = this.offscreen.getContext('2d');
        this.activeProducts = new Map();
        this.compareMode = false;
        this.compareSplit = 0.5;
        this.compareShadeB = null;
        this.showMakeup = true; // for before/after
    }

    resize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
    }

    setProduct(id, config) {
        // config: { type, color, opacity, finish, blendMode }
        this.activeProducts.set(id, config);
    }

    removeProduct(id) {
        this.activeProducts.delete(id);
    }

    clearAll() {
        this.activeProducts.clear();
    }

    render(videoFrame, landmarks) {
        const { ctx, canvas, offCtx, offscreen } = this;
        const w = canvas.width;
        const h = canvas.height;

        // Draw video frame
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(videoFrame, 0, 0, w, h);

        if (!landmarks || !this.showMakeup || this.activeProducts.size === 0) return;

        // Render makeup on offscreen canvas
        offCtx.clearRect(0, 0, w, h);

        for (const [id, config] of this.activeProducts) {
            if (this.compareMode) {
                this._renderCompare(offCtx, landmarks, config, w, h);
            } else {
                this._renderProduct(offCtx, landmarks, config, w, h);
            }
        }

        // Composite onto main canvas
        ctx.drawImage(offscreen, 0, 0);
    }

    _renderProduct(ctx, landmarks, config, w, h) {
        const { type, color, opacity, finish } = config;
        const regions = PRODUCT_REGION_MAP[type];
        if (!regions) return;

        ctx.save();

        ctx.save();

        const rgba = this._hexToRgba(color, opacity);
        const blurAmount = this._getBlurForType(type);
        ctx.globalCompositeOperation = this._getBlendMode(type, finish);
        ctx.filter = `blur(${blurAmount}px)`;

        if (type === 'Lipstick' && regions.length >= 2) {
            // Handle lipstick with mouth hole
            const outer = getRegionPoints(landmarks, regions[0], w, h);
            const inner = getRegionPoints(landmarks, regions[1], w, h);

            if (outer.length >= 3) {
                ctx.beginPath();
                this._drawPathPoints(ctx, outer);
                this._drawPathPoints(ctx, inner);

                ctx.fillStyle = (finish === 'shimmer' || finish === 'glossy')
                    ? this._createShimmerGradient(ctx, outer, color, opacity)
                    : rgba;

                ctx.fill('evenodd');

                if (finish === 'glossy') {
                    ctx.globalCompositeOperation = 'screen';
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    ctx.fill('evenodd');
                }
            }
        } else if (type === 'Blush') {
            // Render blush as a soft radial gradient on the cheeks for a natural look
            for (const regionName of regions) {
                const points = getRegionPoints(landmarks, regionName, w, h);
                if (points.length < 3) continue;

                const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
                const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
                const r = 40; // Approx radius for blush

                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                grad.addColorStop(0, rgba);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.save();
                ctx.globalCompositeOperation = 'soft-light';
                ctx.fillStyle = grad;
                ctx.beginPath();
                this._drawPathPoints(ctx, points);
                ctx.fill();
                ctx.restore();
            }
        } else if (type === 'Foundation') {
            // Apply foundation subtly across the face oval
            for (const regionName of regions) {
                const points = getRegionPoints(landmarks, regionName, w, h);
                if (points.length < 3) continue;

                ctx.save();
                ctx.globalCompositeOperation = 'soft-light';
                // Use a lower effective opacity for foundation to avoid "mask" effect
                ctx.globalAlpha = opacity * 0.6;
                ctx.fillStyle = color;
                ctx.beginPath();
                this._drawPathPoints(ctx, points);
                ctx.fill();
                ctx.restore();
            }
        } else {
            for (const regionName of regions) {
                const points = getRegionPoints(landmarks, regionName, w, h);
                if (points.length < 3) continue;

                ctx.beginPath();
                if (type === 'Eyeliner' || type === 'Mascara') {
                    ctx.moveTo(points[0].x, points[0].y);
                    for (let i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i].x, points[i].y);
                    }
                    ctx.strokeStyle = rgba;
                    ctx.lineWidth = type === 'Eyeliner' ? 2.5 : 3.5;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                } else {
                    this._drawPathPoints(ctx, points);
                    if (finish === 'shimmer' || finish === 'glossy') {
                        ctx.fillStyle = this._createShimmerGradient(ctx, points, color, opacity);
                    } else {
                        ctx.fillStyle = rgba;
                    }
                    ctx.fill();

                    if (finish === 'glossy') {
                        ctx.globalCompositeOperation = 'screen';
                        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                        ctx.fill();
                    }
                }
            }
        }

        ctx.restore();

        ctx.restore();
    }

    _renderCompare(ctx, landmarks, config, w, h) {
        const splitX = w * this.compareSplit;

        // Left half — shade A (current)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, splitX, h);
        ctx.clip();
        this._renderProduct(ctx, landmarks, config, w, h);
        ctx.restore();

        // Right half — shade B
        if (this.compareShadeB) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(splitX, 0, w - splitX, h);
            ctx.clip();
            this._renderProduct(ctx, landmarks, { ...config, color: this.compareShadeB }, w, h);
            ctx.restore();
        }

        // Divider line
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, h);
        ctx.stroke();
        ctx.restore();
    }

    _getBlurForType(type) {
        const map = {
            Lipstick: 1, Foundation: 4, Blush: 8, Eyeshadow: 3,
            Eyeliner: 0.5, Mascara: 0.5, Highlighter: 6, Contour: 6,
        };
        return map[type] ?? 2;
    }

    _getBlendMode(type, finish) {
        if (type === 'Foundation') return 'multiply';
        if (type === 'Highlighter') return 'screen';
        if (type === 'Contour') return 'multiply';
        if (finish === 'shimmer') return 'screen';
        return 'source-over';
    }

    _hexToRgba(hex, opacity) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    _createShimmerGradient(ctx, points, color, opacity) {
        const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
        const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        const grad = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, 30);
        grad.addColorStop(0, `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, ${opacity * 0.8})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`);
        return grad;
    }

    _drawPathPoints(ctx, points) {
        if (points.length < 3) return;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.closePath();
    }
}