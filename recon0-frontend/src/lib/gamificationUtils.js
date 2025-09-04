// This file contains all the logic for our gamification system.
// By keeping it separate, we can easily manage and update the rules.

export const LEVELS = [
    { name: 'Scout', minPoints: 0 },
    { name: 'Hunter', minPoints: 50 },
    { name: 'Tracker', minPoints: 100 },
    { name: 'Specialist', minPoints: 250 },
    { name: 'Expert', minPoints: 500 },
    { name: 'Master', minPoints: 1000 },
    { name: 'Grandmaster', minPoints: 2500 },
    { name: 'Legend', minPoints: 5000 },
];

/**
 * Calculates a user's current level based on their reputation points.
 * @param {number} points - The user's total reputation points.
 * @returns {object} An object containing the current level name, index, and the next level object.
 */
export const calculateLevel = (points) => {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];
    let levelIndex = 0;

    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (points >= LEVELS[i].minPoints) {
            currentLevel = LEVELS[i];
            levelIndex = i;
            nextLevel = LEVELS[i + 1] || null; // The next level, or null if it's the max level
            break;
        }
    }

    return { currentLevel, nextLevel, levelIndex };
};

/**
 * Calculates the user's progress towards the next level.
 * @param {number} points - The user's total reputation points.
 * @param {object} currentLevel - The user's current level object.
 * @param {object} nextLevel - The user's next level object.
 * @returns {number} The progress percentage (0-100).
 */
export const calculateProgress = (points, currentLevel, nextLevel) => {
    if (!nextLevel) {
        return 100; // Max level reached
    }

    const pointsInCurrentLevel = points - currentLevel.minPoints;
    const pointsForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    
    if (pointsForNextLevel === 0) return 100;

    return Math.round((pointsInCurrentLevel / pointsForNextLevel) * 100);
};
