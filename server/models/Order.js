const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title:    String,
  price:    Number,
  image:    String,
  quantity: { type: Number, required: true, min: 1 },
  size:     String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  shippingAddress: {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod:    { type: String, default: 'Razorpay' },
  paymentStatus:    { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  razorpayOrderId:  String,
  razorpayPaymentId:String,
  razorpaySignature:String,
  orderStatus: {
    type: String,
    enum: ['Pending','Confirmed','Shipped','Delivered','Cancelled'],
    default: 'Pending',
  },
  subtotal:       Number,
  deliveryCharge: { type: Number, default: 0 },
  discount:       { type: Number, default: 0 },
  couponCode:     String,
  totalAmount:    { type: Number, required: true },
  estimatedDelivery: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);