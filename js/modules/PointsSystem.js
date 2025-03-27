// Manages the points, rewards, and achievements for the memory game

class PointsSystem {
    constructor(rewardController) {
        // Initialize points and achievement tracking
        this.currentPoints = 0;
        this.totalPoints = 0;
        this.streakCount = 0;
        this.achievements = [];
        this.badges = {};
        this.level = 1;
        this.lastMatchTime = null;
        
        // Get reward controller instance
        this.rewardController = rewardController || window.rewardController;
        
        // Load saved data if available
        this.loadProgress();
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
        this.lastMatchTime = Date.now();
    }
    
    // Award points for a successful match
    awardMatchPoints(difficulty, proficiency, firstAttempt, timeTaken) {
        // Get point configuration from reward controller
        const config = this.rewardController ? 
            this.rewardController.getMatchPointsConfig() : 
            {
                basePoints: 10,
                difficultyMultipliers: { easy: 1, medium: 1.5, hard: 2 },
                proficiencyMultipliers: { easy: 1, warning: 1.5, danger: 2 },
                firstAttemptMultiplier: 1.5,
                speedMatchMultiplier: 1.3,
                streakBonuses: { enabled: true, thresholds: [{ count: 5, bonus: 1.2 }, { count: 10, bonus: 1.5 }] }
            };
        
        // Base points
        let points = config.basePoints;
        
        // Apply difficulty multiplier
        points *= config.difficultyMultipliers[difficulty] || 1;
        
        // Apply proficiency multiplier
        points *= config.proficiencyMultipliers[proficiency] || 1;
        
        // First attempt bonus
        if (firstAttempt) {
            points *= config.firstAttemptMultiplier;
            this.streakCount++;
            
            // Check for streak achievements
            if (config.streakBonuses && config.streakBonuses.enabled) {
                // Apply streak bonus if applicable
                const streakBonus = config.streakBonuses.thresholds.find(t => t.count === this.streakCount);
                if (streakBonus) {
                    points *= streakBonus.bonus;
                }
                
                // Check for streak achievements
                if (this.streakCount === 5) {
                    this.unlockAchievement('streak_5');
                } else if (this.streakCount === 10) {
                    this.unlockAchievement('streak_10');
                }
            }
        } else {
            this.streakCount = 0;
        }
        
        // Speed bonus (if timeTaken is provided in seconds)
        if (timeTaken && timeTaken < 5) {
            points *= config.speedMatchMultiplier;
        }
        
        // Check for combo bonus
        if (this.rewardController && this.lastMatchTime) {
            const comboConfig = this.rewardController.settings.bonuses.combo;
            if (comboConfig.enabled) {
                const currentTime = Date.now();
                const timeSinceLastMatch = (currentTime - this.lastMatchTime) / 1000;
                
                if (timeSinceLastMatch <= comboConfig.timeWindow) {
                    points *= comboConfig.multiplier;
                    console.log(`Combo bonus applied! (${comboConfig.multiplier}x)`);
                }
            }
            this.lastMatchTime = Date.now();
        }
        
        // Apply event multipliers
        if (this.rewardController) {
            const { pointMultiplier } = this.rewardController.getEventMultipliers();
            if (pointMultiplier > 1.0) {
                points *= pointMultiplier;
                console.log(`Event multiplier applied! (${pointMultiplier}x)`);
            }
        }
        
        // Round to integer
        points = Math.round(points);
        
        // Add to current game points
        this.currentPoints += points;
        
        return points;
    }
    
    // Award points for completing a game
    awardGameCompletionPoints(difficulty, proficiency, attempts, totalPairs, timeTaken) {
        // Get completion point configuration
        const config = this.rewardController ? 
            this.rewardController.getCompletionPointsConfig() : 
            {
                basePoints: 50,
                difficultyMultipliers: { easy: 1, medium: 1.5, hard: 2 },
                proficiencyMultipliers: { easy: 1, warning: 1.5, danger: 2 },
                perfectGameMultiplier: 2
            };
        
        // Base completion points
        let points = config.basePoints;
        
        // Apply difficulty and proficiency multipliers
        points *= config.difficultyMultipliers[difficulty] || 1;
        points *= config.proficiencyMultipliers[proficiency] || 1;
        
        // Perfect game bonus (minimum possible attempts)
        const perfectGame = attempts === totalPairs;
        if (perfectGame) {
            points *= config.perfectGameMultiplier;
            
            // Check if perfect game achievements are enabled
            if (!this.rewardController || this.rewardController.getAchievementConfig('perfect_game').enabled) {
                this.unlockAchievement('perfect_game');
            }
        }
        
        // Speed bonus for entire game
        if (timeTaken) {
            // Speed multiplier decreases as time increases
            const speedMultiplier = Math.max(0.5, 2 - (timeTaken / 60)); // 0.5-2x multiplier based on time
            points *= speedMultiplier;
            
            // Speed demon achievement
            const speedConfig = this.rewardController ? 
                this.rewardController.getAchievementConfig('speed_demon') : 
                { timeThreshold: 30 };
                
            if (timeTaken < speedConfig.timeThreshold) {
                this.unlockAchievement('speed_demon');
            }
        }
        
        // Efficiency bonus based on ratio of pairs to attempts
        const efficiency = totalPairs / attempts;
        points *= Math.min(1.5, efficiency * 1.5); // Maximum 1.5x efficiency multiplier
        
        // Apply event multipliers
        if (this.rewardController) {
            const { pointMultiplier, xpMultiplier } = this.rewardController.getEventMultipliers();
            if (pointMultiplier > 1.0) {
                points *= pointMultiplier;
                console.log(`Event point multiplier applied! (${pointMultiplier}x)`);
            }
        }
        
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
        
        // Show next reward milestone if available
        if (window._gameController && window._gameController.ui) {
            setTimeout(() => {
                window._gameController.ui.showNextRewardMilestone(this.totalPoints);
            }, 2000); // Show after game completion summary
        }
        
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
        
        // Get achievement config to check if enabled
        if (this.rewardController) {
            const achievementConfig = this.rewardController.getAchievementConfig(achievementId);
            if (achievementConfig && achievementConfig.enabled === false) {
                console.log(`Achievement ${achievementId} is disabled`);
                return null;
            }
        }
        
        // Find achievement definition
        const achievement = this.getAchievementDefinition(achievementId);
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
    
    // Get achievement definition
    getAchievementDefinition(id) {
        const achievementDefinitions = [
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
        
        return achievementDefinitions.find(a => a.id === id);
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
        
        // Check if math whiz achievement is enabled
        const mathWizEnabled = !this.rewardController || this.rewardController.getAchievementConfig('math_whiz').enabled;
        if (mathWizEnabled && theme === 'numbers' && difficulty === 'hard' && proficiency === 'danger') {
            this.unlockAchievement('math_whiz');
        }
        
        // Check if spelling bee achievement is enabled
        const spellingBeeEnabled = !this.rewardController || this.rewardController.getAchievementConfig('spelling_bee').enabled;
        if (spellingBeeEnabled && theme === 'englishSpellings') {
            this.unlockAchievement('spelling_bee');
        }
        
        // Check if linguist achievement is enabled
        const linguistEnabled = !this.rewardController || this.rewardController.getAchievementConfig('linguist').enabled;
        if (linguistEnabled && this.badges['englishWords'] && this.badges['hindiWords']) {
            this.unlockAchievement('linguist');
        }
        
        // First match achievement
        if (this.achievements.length === 0) {
            this.unlockAchievement('first_match');
        }
    }
    
    // Check and update level progression
    checkLevelProgression() {
        // Get level configuration
        const levelConfig = this.rewardController ? 
            this.rewardController.getLevelingConfig() : 
            { pointsPerLevel: 500, maxLevel: 50 };
        
        // Level progression based on total points
        const newLevel = Math.min(
            levelConfig.maxLevel,
            Math.floor(this.totalPoints / levelConfig.pointsPerLevel) + 1
        );
        
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
            return this.getAchievementDefinition(id);
        }).filter(a => a); // Filter out any undefined results
    }
    
    // Get progress to next level
    getLevelProgress() {
        // Get level configuration
        const levelConfig = this.rewardController ? 
            this.rewardController.getLevelingConfig() : 
            { pointsPerLevel: 500, maxLevel: 50 };
        
        const pointsPerLevel = levelConfig.pointsPerLevel;
        const maxLevel = levelConfig.maxLevel;
        
        // If at max level, show 100%
        if (this.level >= maxLevel) {
            return {
                level: maxLevel,
                progress: pointsPerLevel,
                total: pointsPerLevel,
                percentage: 100
            };
        }
        
        const pointsForCurrentLevel = (this.level - 1) * pointsPerLevel;
        const pointsToNextLevel = this.level * pointsPerLevel;
        const progress = this.totalPoints - pointsForCurrentLevel;
        const total = pointsPerLevel;
        
        return {
            level: this.level,
            progress: progress,
            total: total,
            percentage: Math.min(100, Math.floor((progress / total) * 100))
        };
    }
}
