// Manages the points, rewards, and achievements for the memory game

class PointsSystem {
    constructor() {
        // Initialize points and achievement tracking
        this.currentPoints = 0;
        this.totalPoints = 0;
        this.streakCount = 0;
        this.achievements = [];
        this.badges = {};
        this.level = 1;
        
        // Load saved data if available
        this.loadProgress();
        
        // Point multipliers
        this.difficultyMultipliers = {
            'easy': 1,
            'medium': 1.5,
            'hard': 2
        };
        
        this.proficiencyMultipliers = {
            'easy': 1,
            'warning': 1.5, 
            'danger': 2
        };
        
        // Define achievements
        this.achievementDefinitions = [
            { id: 'first_match', name: 'First Steps', description: 'Complete your first match', points: 50, icon: '🎮' },
            { id: 'perfect_game', name: 'Perfect Game', description: 'Complete a game without mistakes', points: 200, icon: '🏆' },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a game in under 30 seconds', points: 150, icon: '⚡' },
            { id: 'math_whiz', name: 'Math Whiz', description: 'Complete the numbers theme on hard difficulty', points: 100, icon: '🧮' },
            { id: 'linguist', name: 'Linguist', description: 'Complete both Hindi and English word themes', points: 100, icon: '🔤' },
            { id: 'spelling_bee', name: 'Spelling Bee', description: 'Complete the English Spellings theme', points: 100, icon: '🐝' },
            { id: 'streak_5', name: 'On Fire', description: 'Get 5 matches in a row', points: 75, icon: '🔥' },
            { id: 'streak_10', name: 'Unstoppable', description: 'Get 10 matches in a row', points: 150, icon: '⚡' },
            { id: 'master', name: 'Memory Master', description: 'Earn 1000 total points', points: 300, icon: '👑' }
        ];
    }
    
    // Load saved progress from localStorage
    loadProgress() {
        try {
            const savedData = localStorage.getItem('memoryGameProgress');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.totalPoints = data.totalPoints || 0;
                this.achievements = data.achievements || [];
                this.badges = data.badges || {};
                this.level = data.level || 1;
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
    
    // Save progress to localStorage
    saveProgress() {
        try {
            const dataToSave = {
                totalPoints: this.totalPoints,
                achievements: this.achievements,
                badges: this.badges,
                level: this.level
            };
            localStorage.setItem('memoryGameProgress', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
    
    // Reset points for a new game
    resetGamePoints() {
        this.currentPoints = 0;
        this.streakCount = 0;
    }
    
    // Award points for a successful match
    awardMatchPoints(difficulty, proficiency, firstAttempt, timeTaken) {
        // Base points for a match
        let points = 10;
        
        // Apply difficulty multiplier
        points *= this.difficultyMultipliers[difficulty] || 1;
        
        // Apply proficiency multiplier
        points *= this.proficiencyMultipliers[proficiency] || 1;
        
        // First attempt bonus
        if (firstAttempt) {
            points *= 1.5;
            this.streakCount++;
            
            // Check for streak achievements
            if (this.streakCount === 5) {
                this.unlockAchievement('streak_5');
            } else if (this.streakCount === 10) {
                this.unlockAchievement('streak_10');
            }
        } else {
            this.streakCount = 0;
        }
        
        // Speed bonus (if timeTaken is provided in seconds)
        if (timeTaken && timeTaken < 5) {
            points *= 1.3; // 30% bonus for quick matches under 5 seconds
        }
        
        // Round to integer
        points = Math.round(points);
        
        // Add to current game points
        this.currentPoints += points;
        
        return points;
    }
    
    // Award points for completing a game
    awardGameCompletionPoints(difficulty, proficiency, attempts, totalPairs, timeTaken) {
        // Base completion points
        let points = 50;
        
        // Apply difficulty and proficiency multipliers
        points *= this.difficultyMultipliers[difficulty] || 1;
        points *= this.proficiencyMultipliers[proficiency] || 1;
        
        // Perfect game bonus (minimum possible attempts)
        const perfectGame = attempts === totalPairs;
        if (perfectGame) {
            points *= 2;
            this.unlockAchievement('perfect_game');
        }
        
        // Speed bonus for entire game
        if (timeTaken) {
            // Speed multiplier decreases as time increases
            const speedMultiplier = Math.max(0.5, 2 - (timeTaken / 60)); // 0.5-2x multiplier based on time
            points *= speedMultiplier;
            
            // Speed demon achievement
            if (timeTaken < 30) {
                this.unlockAchievement('speed_demon');
            }
        }
        
        // Efficiency bonus based on ratio of pairs to attempts
        const efficiency = totalPairs / attempts;
        points *= Math.min(1.5, efficiency * 1.5); // Maximum 1.5x efficiency multiplier
        
        // Round the final value
        points = Math.round(points);
        
        // Add to current game points and total points
        this.currentPoints += points;
        this.totalPoints += this.currentPoints;
        
        // Check level progression
        this.checkLevelProgression();
        
        // Check for theme-specific achievements
        this.checkThemeAchievements();
        
        // Save progress
        this.saveProgress();
        
        return {
            matchPoints: this.currentPoints - points,
            completionPoints: points,
            totalGamePoints: this.currentPoints,
            totalPoints: this.totalPoints,
            perfectGame: perfectGame
        };
    }
    
    // Unlock an achievement
    unlockAchievement(achievementId) {
        // Check if achievement already unlocked
        if (this.achievements.includes(achievementId)) {
            return null;
        }
        
        // Find achievement definition
        const achievement = this.achievementDefinitions.find(a => a.id === achievementId);
        if (!achievement) {
            return null;
        }
        
        // Add achievement to unlocked list
        this.achievements.push(achievementId);
        
        // Award achievement points
        this.totalPoints += achievement.points;
        
        // Save progress
        this.saveProgress();
        
        // Check if total points achievements should be unlocked
        if (this.totalPoints >= 1000) {
            this.unlockAchievement('master');
        }
        
        return achievement;
    }
    
    // Check for theme-specific achievements
    checkThemeAchievements() {
        const theme = document.getElementById('theme').value;
        const difficulty = document.getElementById('difficulty').value;
        const proficiency = document.getElementById('proficiency').value;
        
        // Record completed theme
        if (!this.badges[theme]) {
            this.badges[theme] = { completed: true, difficulty, proficiency };
        }
        
        // Check for Math Whiz achievement
        if (theme === 'numbers' && difficulty === 'hard' && proficiency === 'danger') {
            this.unlockAchievement('math_whiz');
        }
        
        // Check for Spelling Bee achievement
        if (theme === 'englishSpellings') {
            this.unlockAchievement('spelling_bee');
        }
        
        // Check for Linguist achievement
        if (this.badges['englishWords'] && this.badges['hindiWords']) {
            this.unlockAchievement('linguist');
        }
        
        // First match achievement
        if (this.achievements.length === 0) {
            this.unlockAchievement('first_match');
        }
    }
    
    // Check and update level progression
    checkLevelProgression() {
        // Level progression based on total points
        const newLevel = Math.floor(this.totalPoints / 500) + 1;
        
        // Check if level increased
        if (newLevel > this.level) {
            this.level = newLevel;
            return true; // Level up occurred
        }
        
        return false; // No level change
    }
    
    // Get unlocked achievements with details
    getUnlockedAchievements() {
        return this.achievements.map(id => {
            return this.achievementDefinitions.find(a => a.id === id);
        }).filter(a => a); // Filter out any undefined results
    }
    
    // Get progress to next level
    getLevelProgress() {
        const pointsForCurrentLevel = (this.level - 1) * 500;
        const pointsToNextLevel = this.level * 500;
        const progress = this.totalPoints - pointsForCurrentLevel;
        const total = pointsToNextLevel - pointsForCurrentLevel;
        
        return {
            level: this.level,
            progress: progress,
            total: total,
            percentage: Math.min(100, Math.floor((progress / total) * 100))
        };
    }
}
