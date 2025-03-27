/**
 * Provides an admin interface for configuring game rewards and settings
 */

class AdminPanel {
    constructor(rewardController) {
        this.rewardController = rewardController;
        this.isVisible = false;
        
        // Create admin panel elements
        this.createAdminPanel();
        
        // Admin toggle button (hidden by default)
        this.createAdminToggle();
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    // Create the admin toggle button
    createAdminToggle() {
        this.adminToggle = document.createElement('div');
        this.adminToggle.className = 'admin-toggle';
        this.adminToggle.innerHTML = '⚙️';
        this.adminToggle.title = 'Admin Settings (Ctrl+Shift+A)';
        this.adminToggle.style.display = 'none';
        
        document.body.appendChild(this.adminToggle);
    }
    
    // Create the admin panel UI
    createAdminPanel() {
        // Create panel elements
        this.panel = document.createElement('div');
        this.panel.className = 'admin-panel';
        this.panel.style.display = 'none';
        
        // Header with close button
        const header = document.createElement('div');
        header.className = 'admin-panel-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Reward Settings';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'admin-close-btn';
        closeBtn.addEventListener('click', () => this.hidePanel());
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Content container
        const content = document.createElement('div');
        content.className = 'admin-panel-content';
        
        // Add sections
        content.appendChild(this.createBasePointsSection());
        content.appendChild(this.createMultipliersSection());
        content.appendChild(this.createBonusesSection());
        content.appendChild(this.createAchievementsSection());
        content.appendChild(this.createLevelingSection());
        content.appendChild(this.createEventsSection());
        
        // Footer with action buttons
        const footer = document.createElement('div');
        footer.className = 'admin-panel-footer';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.className = 'admin-save-btn';
        saveBtn.addEventListener('click', () => this.saveAllSettings());
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset to Defaults';
        resetBtn.className = 'admin-reset-btn';
        resetBtn.addEventListener('click', () => this.resetToDefaults());
        
        footer.appendChild(saveBtn);
        footer.appendChild(resetBtn);
        
        // Assemble panel
        this.panel.appendChild(header);
        this.panel.appendChild(content);
        this.panel.appendChild(footer);
        
        // Add to document
        document.body.appendChild(this.panel);
    }
    
    // Create base points section
    createBasePointsSection() {
        const section = document.createElement('section');
        section.className = 'admin-section';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Base Points';
        
        const form = document.createElement('form');
        
        // Match points
        const matchGroup = this.createInputGroup(
            'match-points',
            'Match Points',
            this.rewardController.settings.basePoints.match,
            'number',
            'basePoints.match'
        );
        
        // Game completion points
        const completionGroup = this.createInputGroup(
            'completion-points',
            'Game Completion Points',
            this.rewardController.settings.basePoints.gameCompletion,
            'number',
            'basePoints.gameCompletion'
        );
        
        form.appendChild(matchGroup);
        form.appendChild(completionGroup);
        
        section.appendChild(heading);
        section.appendChild(form);
        
        return section;
    }
    
    // Create multipliers section
    createMultipliersSection() {
        const section = document.createElement('section');
        section.className = 'admin-section';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Multipliers';
        
        const form = document.createElement('form');
        
        // Difficulty multipliers
        const difficultyHeading = document.createElement('h5');
        difficultyHeading.textContent = 'Difficulty Multipliers';
        form.appendChild(difficultyHeading);
        
        const difficulties = ['easy', 'medium', 'hard'];
        difficulties.forEach(diff => {
            const multiplier = this.rewardController.settings.multipliers.difficulty[diff];
            const group = this.createInputGroup(
                `${diff}-multiplier`,
                `${diff.charAt(0).toUpperCase() + diff.slice(1)}`,
                multiplier,
                'number',
                `multipliers.difficulty.${diff}`,
                0.1,
                0.5,
                5
            );
            form.appendChild(group);
        });
        
        // Proficiency multipliers
        const proficiencyHeading = document.createElement('h5');
        proficiencyHeading.textContent = 'Proficiency Multipliers';
        form.appendChild(proficiencyHeading);
        
        const proficiencies = ['easy', 'warning', 'danger'];
        proficiencies.forEach(prof => {
            const multiplier = this.rewardController.settings.multipliers.proficiency[prof];
            const group = this.createInputGroup(
                `${prof}-multiplier`,
                `${prof.charAt(0).toUpperCase() + prof.slice(1)}`,
                multiplier,
                'number',
                `multipliers.proficiency.${prof}`,
                0.1,
                0.5,
                5
            );
            form.appendChild(group);
        });
        
        // Other multipliers
        const otherHeading = document.createElement('h5');
        otherHeading.textContent = 'Other Multipliers';
        form.appendChild(otherHeading);
        
        const firstAttemptGroup = this.createInputGroup(
            'first-attempt-multiplier',
            'First Attempt Bonus',
            this.rewardController.settings.multipliers.firstAttempt,
            'number',
            'multipliers.firstAttempt',
            0.1,
            1,
            3
        );
        
        const speedMatchGroup = this.createInputGroup(
            'speed-match-multiplier',
            'Speed Match Bonus',
            this.rewardController.settings.multipliers.speedMatch,
            'number',
            'multipliers.speedMatch',
            0.1,
            1,
            3
        );
        
        const perfectGameGroup = this.createInputGroup(
            'perfect-game-multiplier',
            'Perfect Game Bonus',
            this.rewardController.settings.multipliers.perfectGame,
            'number',
            'multipliers.perfectGame',
            0.1,
            1,
            5
        );
        
        form.appendChild(firstAttemptGroup);
        form.appendChild(speedMatchGroup);
        form.appendChild(perfectGameGroup);
        
        section.appendChild(heading);
        section.appendChild(form);
        
        return section;
    }
    
    // Create bonuses section
    createBonusesSection() {
        const section = document.createElement('section');
        section.className = 'admin-section';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Bonus Settings';
        
        const form = document.createElement('form');
        
        // Streak bonus
        const streakHeading = document.createElement('h5');
        streakHeading.textContent = 'Streak Bonuses';
        form.appendChild(streakHeading);
        
        const streakEnabledGroup = this.createCheckboxGroup(
            'streak-enabled',
            'Enable Streak Bonuses',
            this.rewardController.settings.bonuses.streak.enabled,
            'bonuses.streak.enabled'
        );
        form.appendChild(streakEnabledGroup);
        
        // Combo bonus
        const comboHeading = document.createElement('h5');
        comboHeading.textContent = 'Combo Bonuses';
        form.appendChild(comboHeading);
        
        const comboEnabledGroup = this.createCheckboxGroup(
            'combo-enabled',
            'Enable Combo Bonuses',
            this.rewardController.settings.bonuses.combo.enabled,
            'bonuses.combo.enabled'
        );
        
        const comboTimeGroup = this.createInputGroup(
            'combo-time',
            'Combo Time Window (seconds)',
            this.rewardController.settings.bonuses.combo.timeWindow,
            'number',
            'bonuses.combo.timeWindow',
            0.5,
            1,
            10
        );
        
        const comboMultiplierGroup = this.createInputGroup(
            'combo-multiplier',
            'Combo Multiplier',
            this.rewardController.settings.bonuses.combo.multiplier,
            'number',
            'bonuses.combo.multiplier',
            0.1,
            1,
            3
        );
        
        form.appendChild(comboEnabledGroup);
        form.appendChild(comboTimeGroup);
        form.appendChild(comboMultiplierGroup);
        
        section.appendChild(heading);
        section.appendChild(form);
        
        return section;
    }
    
    // Create achievements section
    createAchievementsSection() {
        const section = document.createElement('section');
        section.className = 'admin-section';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Achievement Settings';
        
        const form = document.createElement('form');
        
        // Streak achievements
        const streakHeading = document.createElement('h5');
        streakHeading.textContent = 'Streak Achievements';
        form.appendChild(streakHeading);
        
        const streak5Group = this.createInputGroup(
            'streak-5-threshold',
            'Streak 5 Threshold',
            this.rewardController.settings.achievements.streak_5.threshold,
            'number',
            'achievements.streak_5.threshold',
            1,
            3,
            10
        );
        
        const streak10Group = this.createInputGroup(
            'streak-10-threshold',
            'Streak 10 Threshold',
            this.rewardController.settings.achievements.streak_10.threshold,
            'number',
            'achievements.streak_10.threshold',
            1,
            5,
            20
        );
        
        form.appendChild(streak5Group);
        form.appendChild(streak10Group);
        
        // Speed demon achievement
        const speedDemonGroup = this.createInputGroup(
            'speed-demon-threshold',
            'Speed Demon Time Threshold (seconds)',
            this.rewardController.settings.achievements.speed_demon.timeThreshold,
            'number',
            'achievements.speed_demon.timeThreshold',
            5,
            10,
            60
        );
        form.appendChild(speedDemonGroup);
        
        // Other achievements
        const otherHeading = document.createElement('h5');
        otherHeading.textContent = 'Other Achievements';
        form.appendChild(otherHeading);
        
        const perfectGameGroup = this.createCheckboxGroup(
            'perfect-game-enabled',
            'Enable Perfect Game Achievement',
            this.rewardController.settings.achievements.perfect_game.enabled,
            'achievements.perfect_game.enabled'
        );
        
        const mathWizGroup = this.createCheckboxGroup(
            'math-wiz-enabled',
            'Enable Math Whiz Achievement',
            this.rewardController.settings.achievements.math_whiz.enabled,
            'achievements.math_whiz.enabled'
        );
        
        const linguistGroup = this.createCheckboxGroup(
            'linguist-enabled',
            'Enable Linguist Achievement',
            this.rewardController.settings.achievements.linguist.enabled,
            'achievements.linguist.enabled'
        );
        
        form.appendChild(perfectGameGroup);
        form.appendChild(mathWizGroup);
        form.appendChild(linguistGroup);
        
        section.appendChild(heading);
        section.appendChild(form);
        
        return section;
    }
    
    // Create leveling section
    createLevelingSection() {
        const section = document.createElement('section');
        section.className = 'admin-section';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Level Progression';
        
        const form = document.createElement('form');
        
        const pointsPerLevelGroup = this.createInputGroup(
            'points-per-level',
            'Points Required Per Level',
            this.rewardController.settings.leveling.pointsPerLevel,
            'number',
            'leveling.pointsPerLevel',
            100,
            100,
            2000
        );
        
        const maxLevelGroup = this.createInputGroup(
            'max-level',
            'Maximum Level',
            this.rewardController.settings.leveling.maxLevel,
            'number',
            'leveling.maxLevel',
            1,
            10,
            100
        );
        
        form.appendChild(pointsPerLevelGroup);
        form.appendChild(maxLevelGroup);
        
        section.appendChild(heading);
        section.appendChild(form);
        
        return section;
    }
    
    // Create events section
    createEventsSection() {
        const section = document.createElement('section');
        section.className = 'admin-section';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Special Events';
        
        const eventsList = document.createElement('div');
        eventsList.className = 'events-list';
        eventsList.id = 'events-list';
        
        const noEventsMsg = document.createElement('p');
        noEventsMsg.textContent = 'No special events configured.';
        noEventsMsg.className = 'no-events';
        
        if (this.rewardController.settings.events.length === 0) {
            eventsList.appendChild(noEventsMsg);
        } else {
            this.rewardController.settings.events.forEach(event => {
                const eventItem = this.createEventItem(event);
                eventsList.appendChild(eventItem);
            });
        }
        
        // Add event form
        const addEventForm = document.createElement('form');
        addEventForm.className = 'add-event-form';
        
        const eventIdGroup = this.createInputGroup(
            'new-event-id',
            'Event ID',
            '',
            'text',
            null
        );
        
        const eventNameGroup = this.createInputGroup(
            'new-event-name',
            'Event Name',
            '',
            'text',
            null
        );
        
        const eventPointsGroup = this.createInputGroup(
            'new-event-points',
            'Points Multiplier',
            '1.5',
            'number',
            null,
            0.1,
            1,
            5
        );
        
        const eventXpGroup = this.createInputGroup(
            'new-event-xp',
            'XP Multiplier',
            '1.5',
            'number',
            null,
            0.1,
            1,
            5
        );
        
        const addEventBtn = document.createElement('button');
        addEventBtn.textContent = 'Add Event';
        addEventBtn.className = 'admin-add-btn';
        addEventBtn.type = 'button';
        addEventBtn.addEventListener('click', () => this.addNewEvent());
        
        addEventForm.appendChild(eventIdGroup);
        addEventForm.appendChild(eventNameGroup);
        addEventForm.appendChild(eventPointsGroup);
        addEventForm.appendChild(eventXpGroup);
        addEventForm.appendChild(addEventBtn);
        
        section.appendChild(heading);
        section.appendChild(eventsList);
        section.appendChild(document.createElement('hr'));
        section.appendChild(addEventForm);
        
        return section;
    }
    
    // Create an event item
    createEventItem(event) {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.dataset.eventId = event.id;
        
        const eventInfo = document.createElement('div');
        eventInfo.className = 'event-info';
        
        const eventName = document.createElement('h5');
        eventName.textContent = event.name;
        
        const eventDetails = document.createElement('p');
        eventDetails.textContent = `Points: ${event.pointMultiplier}x, XP: ${event.xpMultiplier}x`;
        
        eventInfo.appendChild(eventName);
        eventInfo.appendChild(eventDetails);
        
        const eventActions = document.createElement('div');
        eventActions.className = 'event-actions';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = this.rewardController.isEventActive(event.id) ? 'Deactivate' : 'Activate';
        toggleBtn.className = this.rewardController.isEventActive(event.id) ? 'event-deactivate' : 'event-activate';
        toggleBtn.addEventListener('click', () => this.toggleEvent(event.id, toggleBtn));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'event-delete';
        deleteBtn.title = 'Delete this event';
        deleteBtn.addEventListener('click', () => this.deleteEvent(event.id));
        
        eventActions.appendChild(toggleBtn);
        eventActions.appendChild(deleteBtn);
        
        item.appendChild(eventInfo);
        item.appendChild(eventActions);
        
        return item;
    }
    
    // Create input group helper
    createInputGroup(id, label, value, type = 'text', settingPath = null, step = null, min = null, max = null) {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.htmlFor = id;
        
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;
        
        if (settingPath) {
            input.dataset.settingPath = settingPath;
        }
        
        if (step !== null) input.step = step;
        if (min !== null) input.min = min;
        if (max !== null) input.max = max;
        
        group.appendChild(labelElem);
        group.appendChild(input);
        
        return group;
    }
    
    // Create checkbox group helper
    createCheckboxGroup(id, label, checked, settingPath = null) {
        const group = document.createElement('div');
        group.className = 'checkbox-group';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = checked;
        
        if (settingPath) {
            checkbox.dataset.settingPath = settingPath;
        }
        
        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.htmlFor = id;
        
        group.appendChild(checkbox);
        group.appendChild(labelElem);
        
        return group;
    }
    
    // Initialize event listeners
    initEventListeners() {
        // Show admin panel with keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                this.showAdminPrompt();
            }
        });
        
        // Admin toggle button click
        this.adminToggle.addEventListener('click', () => this.showAdminPrompt());
        
        // Make the panel draggable
        this.makeDraggable(this.panel);
    }
    
    // Make an element draggable
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        const header = element.querySelector('.admin-panel-header');
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }
        
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // Show admin login prompt
    showAdminPrompt() {
        const password = prompt('Enter admin password:');
        if (password) {
            if (this.rewardController.enableAdminMode(password)) {
                this.showPanel();
                this.adminToggle.style.display = 'block';
            } else {
                alert('Invalid password');
            }
        }
    }
    
    // Show the admin panel
    showPanel() {
        if (this.rewardController.adminMode) {
            this.panel.style.display = 'block';
            this.isVisible = true;
        } else {
            alert('You must enable admin mode first');
        }
    }
    
    // Hide the admin panel
    hidePanel() {
        this.panel.style.display = 'none';
        this.isVisible = false;
    }
    
    // Save all changed settings
    saveAllSettings() {
        // Collect settings from form inputs
        const inputs = this.panel.querySelectorAll('input[data-setting-path]');
        
        inputs.forEach(input => {
            const path = input.dataset.settingPath;
            let value;
            
            if (input.type === 'checkbox') {
                value = input.checked;
            } else if (input.type === 'number') {
                value = parseFloat(input.value);
            } else {
                value = input.value;
            }
            
            this.rewardController.updateSetting(path, value);
        });
        
        alert('Settings saved successfully!');
    }
    
    // Reset to default settings
    resetToDefaults() {
        if (confirm('Are you sure you want to reset all reward settings to defaults?')) {
            this.rewardController.resetToDefaults();
            // Reload the panel to reflect new settings
            this.panel.remove();
            this.createAdminPanel();
            this.initEventListeners();
            if (this.isVisible) {
                this.showPanel();
            }
            alert('Settings have been reset to defaults');
        }
    }
    
    // Add a new special event
    addNewEvent() {
        const idInput = document.getElementById('new-event-id');
        const nameInput = document.getElementById('new-event-name');
        const pointsInput = document.getElementById('new-event-points');
        const xpInput = document.getElementById('new-event-xp');
        
        const id = idInput.value.trim();
        const name = nameInput.value.trim();
        const pointMultiplier = parseFloat(pointsInput.value);
        const xpMultiplier = parseFloat(xpInput.value);
        
        if (!id || !name) {
            alert('Event ID and Name are required');
            return;
        }
        
        const event = {
            id,
            name,
            pointMultiplier: isNaN(pointMultiplier) ? 1.0 : pointMultiplier,
            xpMultiplier: isNaN(xpMultiplier) ? 1.0 : xpMultiplier
        };
        
        if (this.rewardController.addEvent(event)) {
            // Clear form
            idInput.value = '';
            nameInput.value = '';
            pointsInput.value = '1.5';
            xpInput.value = '1.5';
            
            // Add to list
            const eventsList = document.getElementById('events-list');
            const noEvents = eventsList.querySelector('.no-events');
            if (noEvents) {
                noEvents.remove();
            }
            
            const eventItem = this.createEventItem(event);
            eventsList.appendChild(eventItem);
        }
    }
    
    // Toggle an event's active state
    toggleEvent(eventId, button) {
        if (this.rewardController.isEventActive(eventId)) {
            this.rewardController.deactivateEvent(eventId);
            button.textContent = 'Activate';
            button.className = 'event-activate';
        } else {
            this.rewardController.activateEvent(eventId);
            button.textContent = 'Deactivate';
            button.className = 'event-deactivate';
        }
    }
    
    // Delete an event
    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            // Remove from settings
            this.rewardController.settings.events = this.rewardController.settings.events.filter(
                e => e.id !== eventId
            );
            
            // If active, deactivate it
            this.rewardController.deactivateEvent(eventId);
            
            // Save settings
            this.rewardController.saveSettings();
            
            // Remove from UI
            const eventItem = document.querySelector(`.event-item[data-event-id="${eventId}"]`);
            if (eventItem) {
                eventItem.remove();
                
                // Check if there are no events left
                const eventsList = document.getElementById('events-list');
                if (!eventsList.querySelector('.event-item')) {
                    const noEventsMsg = document.createElement('p');
                    noEventsMsg.textContent = 'No special events configured.';
                    noEventsMsg.className = 'no-events';
                    eventsList.appendChild(noEventsMsg);
                }
            }
        }
    }
}
