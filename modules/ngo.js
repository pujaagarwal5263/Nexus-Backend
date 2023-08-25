const mongoose = require('mongoose');

const ngoCategories = ['education', 'hunger_eradication', 'fund_raising'];

const ngoSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ngoCategories,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const NGO = mongoose.model('NGO', ngoSchema);

module.exports = NGO;
