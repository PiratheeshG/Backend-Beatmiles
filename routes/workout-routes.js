// backend/routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workout-controller');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid.' });
    }
};

// Workout Routes
router.post('/', authenticateJWT, workoutController.addWorkout);
router.get('/', authenticateJWT, workoutController.getWorkouts);
router.put('/:id', authenticateJWT, workoutController.updateWorkout);
router.delete('/:id', authenticateJWT, workoutController.deleteWorkout);

module.exports = router;
