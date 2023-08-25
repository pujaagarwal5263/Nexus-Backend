const mongoose = require('mongoose');

const donationTypes = ['education', 'hunger_eradication', 'fund_raising'];

const DonorSchema = new mongoose.Schema({
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
  donations: [{
    type: {
      type: String,
      enum: donationTypes,
      required: true,
    },
    amount: {
      type: Number,
      required: function() {
        return this.type === 'fund_raising';
      },
    },
    studyMaterial: {
      type: String,
      required: function() {
        return this.type === 'education';
      },
    },
    foodItem: {
      type: String,
      required: function() {
        return this.type === 'hunger_eradication';
      },
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
    },
  }],
});

const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;
