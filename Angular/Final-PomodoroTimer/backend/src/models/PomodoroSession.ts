import mongoose, { Document, Schema } from 'mongoose';

export interface IPomodoroSession extends Document {
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  completedAt: Date;
}

const PomodoroSessionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  type: {
    type: String,
    enum: ['work', 'shortBreak', 'longBreak'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IPomodoroSession>('PomodoroSession', PomodoroSessionSchema);

