const router = require('express').Router();
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, addReview,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload }             = require('../middleware/upload');

router.get('/',    getProducts);
router.get('/:id', getProduct);
router.post('/',       protect, adminOnly, upload.array('images', 6), createProduct);
router.put('/:id',     protect, adminOnly, upload.array('images', 6), updateProduct);
router.delete('/:id',  protect, adminOnly, deleteProduct);
router.post('/:id/review', protect, addReview);

module.exports = router;