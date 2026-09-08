import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  id: { type: String },
  amount: { type: Number, required: true },
  expectedDate: { type: String },
  status: {
    type: String,
    enum: ['refund-pending', 'refund-overdue', 'refund-received'],
    default: 'refund-pending',
  },
  isOverdue: { type: Boolean, default: false },
  settled: { type: Boolean, default: false },
  reason: { type: String, default: '' },
  settledAt: { type: Date },
});

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please specify product name'],
      trim: true,
    },
    merchant: {
      type: String,
      required: [true, 'Please specify merchant/store'],
      trim: true,
    },
    orderId: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      default: 'Electronics',
    },
    price: {
      type: Number,
      required: [true, 'Please specify price'],
      min: 0,
    },
    purchaseDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    deliveryDate: {
      type: String,
      default: '',
    },
    // Return window details
    hasReturnWindow: {
      type: Boolean,
      default: true,
    },
    returnDeadline: {
      type: String,
      default: '',
    },
    returnWindowDays: {
      type: Number,
      default: 7,
    },
    returnStatus: {
      type: String,
      enum: ['eligible', 'expiring', 'return_requested', 'picked_up', 'in_transit', 'closed', 'expired'],
      default: 'eligible',
    },
    deadlineText: {
      type: String,
      default: '',
    },
    isUrgentReturn: {
      type: Boolean,
      default: false,
    },
    // Warranty details
    warrantyActive: {
      type: Boolean,
      default: false,
    },
    warrantyExpiry: {
      type: String,
      default: '',
    },
    warrantyDaysLeft: {
      type: Number,
      default: 0,
    },
    isWarrantyExpiringSoon: {
      type: Boolean,
      default: false,
    },
    // Invoices and proofs
    hasReceipt: {
      type: Boolean,
      default: false,
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    receiptFileName: {
      type: String,
      default: '',
    },
    // Associated Refund
    refund: refundSchema,
  },
  {
    timestamps: true,
  }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);
