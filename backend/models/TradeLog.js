import mongoose from 'mongoose';

const tradeLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mt5Login: {
    type: String,
    required: true
  },
  ticket: {
    type: Number,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL', 'BUY_LIMIT', 'SELL_LIMIT', 'BUY_STOP', 'SELL_STOP'],
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  openPrice: {
    type: Number,
    required: true
  },
  closePrice: {
    type: Number,
    default: null
  },
  stopLoss: {
    type: Number,
    default: 0
  },
  takeProfit: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  swap: {
    type: Number,
    default: 0
  },
  openTime: {
    type: Date,
    required: true
  },
  closeTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'PENDING'],
    default: 'OPEN'
  },
  comment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
tradeLogSchema.index({ mt5Login: 1, status: 1 });
tradeLogSchema.index({ userId: 1, openTime: -1 });

export default mongoose.model('TradeLog', tradeLogSchema);
