const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/upload');
const SavedLook = require('../models/SavedLook');

// Save a captured AR look
router.post('/save-look', protect, upload.single('image'), async (req, res) => {
    try {
        const { products, skinTone, name } = req.body;
        const look = await SavedLook.create({
            user: req.user._id,
            imageUrl: req.file.path,
            publicId: req.file.filename,
            products: products ? JSON.parse(products) : [],
            skinTone: skinTone ? JSON.parse(skinTone) : {},
            name: name || 'My Look',
        });
        res.status(201).json({ look });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get user's saved looks
router.get('/my-looks', protect, async (req, res) => {
    try {
        const looks = await SavedLook.find({ user: req.user._id })
            .populate('products.product', 'title brand images')
            .sort({ createdAt: -1 });
        res.json({ looks });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// Delete a look
router.delete('/looks/:id', protect, async (req, res) => {
    try {
        const look = await SavedLook.findOne({ _id: req.params.id, user: req.user._id });
        if (!look) return res.status(404).json({ message: 'Look not found' });
        if (look.publicId) await cloudinary.uploader.destroy(look.publicId);
        await look.deleteOne();
        res.json({ message: 'Look deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
