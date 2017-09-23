const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const RepairSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      enum: ['new', 'assigned', 'complete', 'approved'],
      default: 'new'
    },
    comments: {
      type: [{
        date: {
          type: String,
          required: true,
          trim: true
        },
        user: {
          type: String,
          required: true,
          trim: true
        },
        comment: {
          type: String,
          required: true,
          trim: true
        }
      }],
      required: false
    }
  },
  { minimize: false }
);

RepairSchema.plugin(timestamps);
RepairSchema.plugin(mongooseStringQuery);

const Repair = mongoose.model('Repair', RepairSchema);
module.exports = Repair;
