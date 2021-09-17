var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bugSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    ticket_description: { type: String, trim: true, required: true },
    ticket_status: { type: Boolean, required: true, trim: true },
    email:{ref: 'user', type: String},
    user: { ref: 'user', type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

var Bug = mongoose.model('bug', bugSchema);
module.exports = Bug;
