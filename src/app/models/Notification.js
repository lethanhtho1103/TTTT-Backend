const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
  user_id: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
 },
  create_at: { 
    type: Date, 
    default: Date.now 
},
 status: { 
    type: String,
     maxLength: 255 
},
  message: { 
    type: String,
    required: true }
});

module.exports = mongoose.model('Notification', Notification);
