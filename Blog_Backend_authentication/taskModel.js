const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);