// MediaPipe FaceMesh 468-point landmark region definitions
// Reference: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png

export const FACE_REGIONS = {
    // Outer lips
    lipsOuter: [
        61, 146, 91, 181, 84, 17, 314, 405, 321, 375,
        291, 409, 270, 269, 267, 0, 37, 39, 40, 185,
    ],
    // Inner lips
    lipsInner: [
        78, 95, 88, 178, 87, 14, 317, 402, 318, 324,
        308, 415, 310, 311, 312, 13, 82, 81, 80, 191,
    ],
    // Upper lip line
    upperLipLine: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
    // Lower lip line
    lowerLipLine: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],

    // Left eye contour
    leftEye: [
        33, 7, 163, 144, 145, 153, 154, 155, 133,
        173, 157, 158, 159, 160, 161, 246,
    ],
    // Right eye contour
    rightEye: [
        362, 382, 381, 380, 374, 373, 390, 249, 263,
        466, 388, 387, 386, 385, 384, 398,
    ],

    // Left eyelid (upper) for eyeshadow
    leftEyelid: [
        33, 246, 161, 160, 159, 158, 157, 173, 133,
        243, 112, 26, 22, 23, 24, 110, 25,
    ],
    // Right eyelid (upper) for eyeshadow
    rightEyelid: [
        362, 398, 384, 385, 386, 387, 388, 466, 263,
        463, 341, 256, 252, 253, 254, 339, 255,
    ],

    // Upper eyeliner — left
    leftEyeliner: [33, 246, 161, 160, 159, 158, 157, 173, 133],
    // Upper eyeliner — right
    rightEyeliner: [362, 398, 384, 385, 386, 387, 388, 466, 263],

    // Left lash region (mascara)
    leftLashes: [33, 7, 163, 144, 145, 153, 154, 155, 133],
    // Right lash region
    rightLashes: [362, 382, 381, 380, 374, 373, 390, 249, 263],

    // Left cheek (blush)
    leftCheek: [
        50, 101, 36, 205, 187, 123, 116, 117, 118,
        119, 120, 100, 142, 203, 206, 216,
    ],
    // Right cheek (blush)
    rightCheek: [
        280, 330, 266, 425, 411, 352, 345, 346, 347,
        348, 349, 329, 371, 423, 426, 436,
    ],

    // Left highlighter (top of cheek)
    leftHighlight: [116, 123, 50, 101, 100, 119, 118, 117],
    // Right highlighter
    rightHighlight: [345, 352, 280, 330, 329, 348, 347, 346],

    // Nose bridge (highlighter)
    noseBridge: [168, 6, 197, 195, 5, 4],

    // Left contour (below cheekbone)
    leftContour: [
        132, 58, 172, 136, 150, 149, 176, 148, 152,
        377, 400, 378, 379,
    ],
    // Right contour
    rightContour: [
        361, 288, 397, 365, 379, 378, 400, 377, 152,
        148, 176, 149, 150,
    ],

    // Jawline contour
    jawline: [
        10, 338, 297, 332, 284, 251, 389, 356, 454,
        323, 361, 288, 397, 365, 379, 378, 400, 377,
        152, 148, 176, 149, 150, 136, 172, 58, 132,
        93, 234, 127, 162, 21, 54, 103, 67, 109,
    ],

    // Full face oval (foundation)
    faceOval: [
        10, 338, 297, 332, 284, 251, 389, 356, 454,
        323, 361, 288, 397, 365, 379, 378, 400, 377,
        152, 148, 176, 149, 150, 136, 172, 58, 132,
        93, 234, 127, 162, 21, 54, 103, 67, 109,
    ],

    // Forehead approximate
    forehead: [10, 109, 67, 103, 54, 21, 162, 127, 234, 93, 132],

    // Skin sample points for tone detection
    skinSamplePoints: [1, 4, 5, 6, 50, 101, 280, 330, 195, 197],
};

// Product type → face region mapping
export const PRODUCT_REGION_MAP = {
    Lipstick: ['lipsOuter', 'lipsInner'],
    Foundation: ['faceOval'],
    Blush: ['leftCheek', 'rightCheek'],
    Eyeshadow: ['leftEyelid', 'rightEyelid'],
    Eyeliner: ['leftEyeliner', 'rightEyeliner'],
    Mascara: ['leftLashes', 'rightLashes'],
    Highlighter: ['leftHighlight', 'rightHighlight', 'noseBridge'],
    Contour: ['leftContour', 'rightContour'],
};

// Get landmarks as {x,y} for a region from face detection results
export function getRegionPoints(landmarks, regionName, width, height) {
    const indices = FACE_REGIONS[regionName];
    if (!indices) return [];
    return indices.map(i => ({
        x: landmarks[i].x * width,
        y: landmarks[i].y * height,
    }));
}