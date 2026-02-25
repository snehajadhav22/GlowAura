const mongoose = require('mongoose');

const savedLookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        default: 'My Look'
    },
    imageUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        color: String,
        opacity: Number,
        finish: String,
        type: { type: String } // 'Lipstick', etc.
    }],
    skinTone: {
        hex: String,
        tone: String,
        undertone: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SavedLook', savedLookSchema);