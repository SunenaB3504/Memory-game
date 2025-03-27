/**
 * Predefined reward events and configurations
 */

const RewardPresets = {
    // Special events
    events: {
        doublePoints: {
            id: "doublePoints",
            name: "Double Points Weekend",
            pointMultiplier: 2.0,
            xpMultiplier: 1.5
        },
        birthdayBonus: {
            id: "birthdayBonus",
            name: "Birthday Celebration",
            pointMultiplier: 3.0,
            xpMultiplier: 2.0
        },
        mathChallenge: {
            id: "mathChallenge",
            name: "Math Challenge",
            pointMultiplier: 1.5,
            xpMultiplier: 1.5
        },
        spellingBee: {
            id: "spellingBee",
            name: "Spelling Bee Contest",
            pointMultiplier: 1.5,
            xpMultiplier: 1.5
        }
    },
    
    // Difficulty configurations
    difficulties: {
        beginner: {
            basePoints: {
                match: 15,
                gameCompletion: 75
            },
            multipliers: {
                difficulty: {
                    easy: 1.2,
                    medium: 1.6,
                    hard: 2.2
                }
            }
        },
        balanced: {
            basePoints: {
                match: 10,
                gameCompletion: 50
            },
            multipliers: {
                difficulty: {
                    easy: 1.0,
                    medium: 1.5, 
                    hard: 2.0
                }
            }
        },
        challenging: {
            basePoints: {
                match: 5,
                gameCompletion: 30
            },
            multipliers: {
                difficulty: {
                    easy: 0.8,
                    medium: 1.3,
                    hard: 1.8
                }
            }
        }
    },
    
    // Apply a preset event
    activateEvent: function(eventId) {
        if (!window.rewardController) {
            console.error("Reward controller not available");
            return false;
        }
        
        const event = this.events[eventId];
        if (!event) {
            console.error(`Event ${eventId} not defined`);
            return false;
        }
        
        // Add the event to settings if needed
        const existingEvent = window.rewardController.settings.events.find(e => e.id === eventId);
        if (!existingEvent) {
            window.rewardController.addEvent(event);
        }
        
        // Activate the event
        window.rewardController.activateEvent(eventId);
        console.log(`Event "${event.name}" activated`);
        
        return true;
    },
    
    // Apply a difficulty preset
    applyDifficultyPreset: function(presetName) {
        if (!window.rewardController) {
            console.error("Reward controller not available");
            return false;
        }
        
        const preset = this.difficulties[presetName];
        if (!preset) {
            console.error(`Preset ${presetName} not defined`);
            return false;
        }
        
        // Update settings with the preset
        if (preset.basePoints) {
            window.rewardController.settings.basePoints = { 
                ...window.rewardController.settings.basePoints,
                ...preset.basePoints
            };
        }
        
        if (preset.multipliers) {
            // Deep merge multipliers
            for (const key in preset.multipliers) {
                window.rewardController.settings.multipliers[key] = {
                    ...window.rewardController.settings.multipliers[key],
                    ...preset.multipliers[key]
                };
            }
        }
        
        // Save the updated settings
        window.rewardController.saveSettings();
        console.log(`Applied ${presetName} preset`);
        
        return true;
    }
};

// Make it globally available
window.RewardPresets = RewardPresets;
