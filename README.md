# Memory Game with Reward System

## Features

- Classic memory matching game with various themes
- Multiple difficulty and proficiency levels
- Points system with rewards, achievements, and levels
- Special events to enhance gameplay

## Reward Control System

### Admin Mode

To access the admin panel:
1. Press `Ctrl+Shift+A` or use the gear icon in the bottom right corner
2. Enter the password: `admin123`

### Configuring Rewards

In the admin panel, you can adjust:
- Base points for matches and game completion
- Multipliers for different difficulty and proficiency levels
- Bonus settings for streaks and combos
- Achievement requirements
- Leveling progression

### Special Events

Special events allow you to temporarily boost rewards:

1. Create an event in the admin panel with:
   - ID: A unique identifier
   - Name: Display name
   - Points Multiplier: How much to boost points (e.g., 1.5x)
   - XP Multiplier: How much to boost XP (e.g., 1.5x)

2. Activate/Deactivate events:
   - Click the "Activate" button next to an event
   - Active events display at the top of the game

3. Activate via URL:
   - Add `?event=EVENT_ID` to the URL to activate an event
   - Example: `index.html?event=doublePoints`

## Debug Tools

In the browser console:
- `DebugMatching.validateAllMatches()` - Validate card match groups
- `DebugMatching.checkGameCompletionStatus()` - Check game completion status
- `rewardController.settings` - View all reward settings
- `rewardController.activateEvent('eventId')` - Activate an event
