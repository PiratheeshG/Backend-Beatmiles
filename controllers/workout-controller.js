// backend/controllers/workoutController.js
const Workout = require('../models/Workout');

// Add Workout
exports.addWorkout = async (req, res) => {
    const { date, type, duration, distance, avgSpeed, avgHeartRate, calories } = req.body;
    try {
        if (!date || !type || !duration) {
            return res.status(400).json({ message: 'Please fill out required fields.' });
        }
        const newWorkout = new Workout({
            user: req.user.id,
            date,
            type,
            duration,
            distance,
            avgSpeed,
            avgHeartRate,
            calories
        });
        await newWorkout.save();
        res.status(201).json(newWorkout);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get All Workouts for User
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update Workout
exports.updateWorkout = async (req, res) => {
    const { id } = req.params;
    const { date, type, duration, distance, avgSpeed, avgHeartRate, calories } = req.body;
    try {
        let workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found.' });
        }
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }
        workout = await Workout.findByIdAndUpdate(id, {
            date,
            type,
            duration,
            distance,
            avgSpeed,
            avgHeartRate,
            calories
        }, { new: true });
        res.json(workout);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Delete Workout
exports.deleteWorkout = async (req, res) => {
    const { id } = req.params;
    try {
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found.' });
        }
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }
        await Workout.findByIdAndDelete(id);
        res.json({ message: 'Workout deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};
