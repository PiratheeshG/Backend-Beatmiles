// backend/models/Workout.js
const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    distance: { type: Number },
    avgSpeed: { type: Number },
    avgHeartRate: { type: Number },
    calories: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
