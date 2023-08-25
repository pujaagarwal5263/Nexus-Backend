const mongoose = require('mongoose');

const DoneeCategories = ['education', 'hunger_eradication', 'fund_raising'];

const DoneeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: [{
    type: String,
    enum: DoneeCategories,
    required: true,
  }],
  description: {
    type: String,
    required: true,
  },
  subscribedNGO: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
  }],
});

const Donee = mongoose.model('Donee', DoneeSchema);

module.exports = Donee;
