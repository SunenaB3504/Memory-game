/**
 * Controls and configures the reward system for the memory game
 * Allows for dynamic adjustment of point values, multipliers, and achievement requirements
 */

class RewardController {
    constructor() {
        // Initialize with default settings
        this.settings = this.getDefaultSettings();
        
        // Load any saved settings
        this.loadSettings();
        
        // Track if admin mode is active
        this.adminMode = false;
        
        // Track special events
        this.activeEvents = [];
    }
    
    // Get default reward settings
    getDefaultSettings() {
        return {
            // Base points for different actions
            basePoints: {
                match: 10,
                gameCompletion: 50
            },
            
            // Multipliers for different game settings
            multipliers: {
                difficulty: {
                    easy: 1.0,
                    medium: 1.5,
                    hard: 2.0
                },
                proficiency: {
                    easy: 1.0,
                    warning: 1.5,
                    danger: 2.0
                },
                firstAttempt: 1.5,
                speedMatch: 1.3, // For matches under 5 seconds
                perfectGame: 2.0
            },
            
            // Special bonuses
            bonuses: {
                streak: {
                    enabled: true,
                    thresholds: [
                        { count: 3, bonus: 1.1 },
                        { count: 5, bonus: 1.2 },
                        { count: 10, bonus: 1.5 }
                    ]
                },
                combo: {
                    enabled: true,
                    timeWindow: 3, // seconds
                    multiplier: 1.2
                }
            },
            
            // Achievements configuration
            achievements: {
                streak_5: { threshold: 5 },
                streak_10: { threshold: 10 },
                perfect_game: { enabled: true },
                speed_demon: { timeThreshold: 30 }, // seconds
                math_whiz: { enabled: true },
                linguist: { enabled: true },
                spelling_bee: { enabled: true }
            },
            
            // Leveling configuration
            leveling: {
                pointsPerLevel: 500,
                maxLevel: 50
            },
            
            // Special event settings (empty by default)
            events: []
        };
    }
    
    // Load settings from storage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('rewardSettings');
            if (savedSettings) {
                // Merge saved settings with defaults (to ensure any new settings are included)
                const parsed = JSON.parse(savedSettings);
                this.settings = this.mergeSettings(this.settings, parsed);
                console.log('Reward settings loaded from storage');
            }
        } catch (error) {
            console.error('Error loading reward settings:', error);
        }
    }
    
    // Save settings to storage
    saveSettings() {
        try {
            localStorage.setItem('rewardSettings', JSON.stringify(this.settings));
            console.log('Reward settings saved');
        } catch (error) {
            console.error('Error saving reward settings:', error);
        }
    }
    
    // Helper to deep merge settings
    mergeSettings(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                result[key] = this.mergeSettings(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }
    
    // Reset to default settings
    resetToDefaults() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
    }
    
    // Get match points configuration
    getMatchPointsConfig() {
        return {
            basePoints: this.settings.basePoints.match,
            difficultyMultipliers: this.settings.multipliers.difficulty,
            proficiencyMultipliers: this.settings.multipliers.proficiency,
            firstAttemptMultiplier: this.settings.multipliers.firstAttempt,
            speedMatchMultiplier: this.settings.multipliers.speedMatch,
            streakBonuses: this.settings.bonuses.streak
        };
    }
    
    // Get game completion points configuration
    getCompletionPointsConfig() {
        return {
            basePoints: this.settings.basePoints.gameCompletion,
            difficultyMultipliers: this.settings.multipliers.difficulty,
            proficiencyMultipliers: this.settings.multipliers.proficiency,
            perfectGameMultiplier: this.settings.multipliers.perfectGame
        };
    }
    
    // Get achievement configuration
    getAchievementConfig(achievementId) {
        return this.settings.achievements[achievementId] || { enabled: true };
    }
    
    // Get leveling configuration
    getLevelingConfig() {
        return this.settings.leveling;
    }
    
    // Enable admin mode (allows configuration)
    enableAdminMode(password) {
        // Simple password check (in a real app, use proper auth)
        if (password === 'admin123') {
            this.adminMode = true;
            return true;
        }
        return false;
    }
    
    // Disable admin mode
    disableAdminMode() {
        this.adminMode = false;
    }
    
    // Update a specific setting
    updateSetting(path, value) {
        if (!this.adminMode) {
            console.warn('Admin mode must be enabled to update settings');
            return false;
        }
        
        try {
            // Parse path like "multipliers.difficulty.medium"
            const parts = path.split('.');
            let current = this.settings;
            
            // Navigate to the correct location
            for (let i = 0; i < parts.length - 1; i++) {
                if (!(parts[i] in current)) {
                    console.error(`Invalid setting path: ${path}`);
                    return false;
                }
                current = current[parts[i]];
            }
            
            // Update the value
            current[parts[parts.length - 1]] = value;
            
            // Save the updated settings
            this.saveSettings();
            return true;
        } catch (error) {
            console.error('Error updating setting:', error);
            return false;
        }
    }
    
    // Check if a specific event is active
    isEventActive(eventId) {
        return this.activeEvents.includes(eventId);
    }
    
    // Add a special event
    addEvent(event) {
        if (!this.adminMode) {
            console.warn('Admin mode must be enabled to add events');
            return false;
        }
        
        // Validate event structure
        if (!event.id || !event.name) {
            console.error('Events require at least an id and name');
            return false;
        }
        
        // Add or update event in settings
        const existingIndex = this.settings.events.findIndex(e => e.id === event.id);
        if (existingIndex >= 0) {
            this.settings.events[existingIndex] = event;
        } else {
            this.settings.events.push(event);
        }
        
        this.saveSettings();
        return true;
    }
    
    // Activate a special event
    activateEvent(eventId) {
        const event = this.settings.events.find(e => e.id === eventId);
        if (!event) {
            console.error(`Event with id ${eventId} not found`);
            return false;
        }
        
        if (!this.activeEvents.includes(eventId)) {
            this.activeEvents.push(eventId);
        }
        
        console.log(`Event "${event.name}" activated`);
        return true;
    }
    
    // Deactivate a special event
    deactivateEvent(eventId) {
        const index = this.activeEvents.indexOf(eventId);
        if (index >= 0) {
            this.activeEvents.splice(index, 1);
            console.log(`Event ${eventId} deactivated`);
            return true;
        }
        return false;
    }
    
    // Get active event multipliers
    getEventMultipliers() {
        let pointMultiplier = 1.0;
        let xpMultiplier = 1.0;
        
        // Apply all active event multipliers
        this.activeEvents.forEach(eventId => {
            const event = this.settings.events.find(e => e.id === eventId);
            if (event) {
                pointMultiplier *= (event.pointMultiplier || 1.0);
                xpMultiplier *= (event.xpMultiplier || 1.0);
            }
        });
        
        return { pointMultiplier, xpMultiplier };
    }
}
