import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  mt5Login: {
    type: String,
    required: true,
    unique: true
  },
  mt5Password: {
    type: String,
    required: true
  },
  mt5Server: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  settings: {
    defaultLotSize: {
      type: Number,
      default: 0.01
    },
    defaultStopLoss: {
      type: Number,
      default: 50
    },
    defaultTakeProfit: {
      type: Number,
      default: 50
    },
    theme: {
      type: String,
      default: 'dark'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
