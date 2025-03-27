/**
 * Manages sound effects and background music for the memory game
 */

class SoundManager {
    constructor() {
        // Initialize sound effects
        this.sounds = {};
        this.soundsLoaded = false;
        
        // Initialize background music
        this.backgroundMusic = null;
        this.musicLoaded = false;
        
        // Set default volumes
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume') || 0.3); // Default to 30%
        this.effectsVolume = parseFloat(localStorage.getItem('effectsVolume') || 0.7); // Default to 70%
        
        // Sound state
        this.muted = localStorage.getItem('soundMuted') === 'true';
        this.musicMuted = localStorage.getItem('musicMuted') === 'true';
        
        // Initialization
        this.loadSounds();
        
        // Create UI controls
        this.createMuteButton();
        this.createMusicControls();
        
        // Add play music button that's more visible
        this.createPlayMusicButton();
        
        // Auto-play music after user interaction (if not muted)
        document.addEventListener('click', () => {
            if (!this.musicMuted && this.backgroundMusic && this.backgroundMusic.paused) {
                console.log("User clicked - attempting to play background music");
                this.playBackgroundMusic();
            }
        }, { once: true });
    }
    
    // Load all sound assets
    loadSounds() {
        console.log("Loading sound assets...");
        
        // Load sound effects
        const soundEffects = {
            correct: 'sounds/correct.mp3',
            incorrect: 'sounds/incorrect.mp3',
            success: 'sounds/success.mp3',
            click: 'sounds/click.mp3'
        };
        
        // Check if sounds directory exists
        this.checkResourceExists('sounds/').then(exists => {
            if (!exists) {
                console.warn("Sounds directory not found. Creating directory structure...");
                this.createSoundDirectory();
                return;
            }
            
            // Load each sound effect
            Object.entries(soundEffects).forEach(([name, path]) => {
                const sound = new Audio();
                
                // Add event listeners to track loading state
                sound.addEventListener('canplaythrough', () => {
                    console.log(`Sound loaded: ${name}`);
                    this.sounds[name] = sound;
                    
                    // Check if all sounds are loaded
                    if (Object.keys(this.sounds).length === Object.keys(soundEffects).length) {
                        console.log("All sound effects loaded successfully");
                        this.soundsLoaded = true;
                    }
                });
                
                sound.addEventListener('error', (e) => {
                    console.warn(`Error loading sound ${name}:`, e);
                });
                
                // Set initial volume
                sound.volume = this.muted ? 0 : this.effectsVolume;
                
                // Load the sound
                sound.src = path;
                sound.load();
            });
        });
        
        // Load background music
        this.checkResourceExists('sounds/background.mp3').then(exists => {
            if (!exists) {
                console.warn("Background music file not found.");
                return;
            }
            
            this.backgroundMusic = new Audio('sounds/background.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicMuted ? 0 : this.musicVolume;
            
            this.backgroundMusic.addEventListener('canplaythrough', () => {
                console.log("Background music loaded successfully");
                this.musicLoaded = true;
            });
            
            this.backgroundMusic.addEventListener('error', (e) => {
                console.warn("Error loading background music:", e);
            });
            
            this.backgroundMusic.addEventListener('play', () => {
                console.log("Background music started playing");
            });
            
            this.backgroundMusic.load();
        });
    }
    
    // Check if a resource exists
    async checkResourceExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.warn(`Error checking resource ${url}:`, error);
            return false;
        }
    }
    
    // Create sound directory and placeholder files if missing
    createSoundDirectory() {
        console.log("Note: Please make sure a 'sounds' directory exists with the following audio files:");
        console.log("- sounds/background.mp3 (background music)");
        console.log("- sounds/correct.mp3 (correct match sound)");
        console.log("- sounds/incorrect.mp3 (incorrect match sound)");
        console.log("- sounds/success.mp3 (game completion sound)");
        console.log("- sounds/click.mp3 (card click sound)");
        
        // Create a simple placeholder audio object for each sound
        this.sounds = {
            correct: new Audio(),
            incorrect: new Audio(),
            success: new Audio(),
            click: new Audio()
        };
        
        this.backgroundMusic = new Audio();
        this.backgroundMusic.loop = true;
        
        // Set to loaded to avoid errors
        this.soundsLoaded = true;
        this.musicLoaded = true;
    }
    
    // Play a sound effect if not muted
    play(soundName) {
        if (this.muted || !this.soundsLoaded) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            try {
                // Clone the audio to avoid playback issues with rapid sounds
                const soundClone = sound.cloneNode();
                soundClone.volume = this.muted ? 0 : this.effectsVolume;
                
                // Play with error handling
                soundClone.play()
                    .catch(error => {
                        console.log(`Couldn't play ${soundName} sound:`, error.message);
                    });
            } catch (error) {
                console.warn(`Error with sound ${soundName}:`, error);
            }
        }
    }
    
    // Play background music with robust error handling
    playBackgroundMusic() {
        if (this.musicMuted || !this.musicLoaded || !this.backgroundMusic) return;
        
        console.log("Attempting to play background music...");
        
        // Set volume before playing
        this.backgroundMusic.volume = this.musicVolume;
        
        // Play with proper error handling
        const playPromise = this.backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log("Background music playing successfully");
                    // Update button icon
                    this.updateMusicButtonIcon();
                })
                .catch(error => {
                    console.warn("Background music autoplay prevented:", error);
                    
                    // Show a message about needing user interaction
                    this.showPlayMusicButton(true);
                    
                    // Update UI to show music is not playing
                    this.musicMuted = true;
                    this.updateMusicButtonIcon();
                });
        }
    }
    
    // Pause background music
    pauseBackgroundMusic() {
        if (!this.backgroundMusic) return;
        
        try {
            this.backgroundMusic.pause();
            console.log("Background music paused");
        } catch (error) {
            console.warn("Error pausing background music:", error);
        }
    }
    
    // Toggle mute state for sound effects
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);
        
        // Update volumes
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.muted ? 0 : this.effectsVolume;
        });
        
        // Update button icon
        this.updateMuteButtonIcon();
    }
    
    // Toggle music playback
    toggleMusic() {
        this.musicMuted = !this.musicMuted;
        localStorage.setItem('musicMuted', this.musicMuted);
        
        if (this.musicMuted) {
            this.pauseBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
        
        // Update button icon
        this.updateMusicButtonIcon();
    }
    
    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = volume;
        localStorage.setItem('musicVolume', volume);
        
        if (!this.musicMuted && this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
        }
    }
    
    // Set sound effects volume
    setEffectsVolume(volume) {
        this.effectsVolume = volume;
        localStorage.setItem('effectsVolume', volume);
        
        if (!this.muted) {
            Object.values(this.sounds).forEach(sound => {
                if (sound) sound.volume = volume;
            });
        }
    }
    
    // Create a prominent play music button for when autoplay fails
    createPlayMusicButton() {
        const button = document.createElement('button');
        button.className = 'play-music-btn';
        button.innerHTML = '🎵 Play Music';
        button.setAttribute('title', 'Start Background Music');
        
        // Style the button
        Object.assign(button.style, {
            position: "fixed",
            bottom: "240px",
            right: "20px",
            padding: "8px 15px",
            borderRadius: "30px",
            background: "linear-gradient(135deg, #ffc107 0%, #ffeb3b 100%)",
            color: "#9c27b0",
            border: "2px solid #9c27b0",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
            zIndex: "1000",
            display: "none", // Hidden by default
            animation: "pulse-music 2s infinite",
            transition: "all 0.3s"
        });
        
        // Add hover effect
        button.onmouseenter = () => {
            button.style.transform = "scale(1.05)";
        };
        
        button.onmouseleave = () => {
            button.style.transform = "scale(1)";
        };
        
        // Add click event
        button.onclick = () => {
            this.musicMuted = false;
            localStorage.setItem('musicMuted', false);
            this.playBackgroundMusic();
            button.style.display = "none";
        };
        
        // Add to document
        document.body.appendChild(button);
        this.playMusicButton = button;
        
        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-music {
                0% { box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(156, 39, 176, 0); }
                100% { box-shadow: 0 0 0 0 rgba(156, 39, 176, 0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show or hide the play music button
    showPlayMusicButton(show = true) {
        if (this.playMusicButton) {
            this.playMusicButton.style.display = show ? "block" : "none";
        }
    }
    
    // Create a mute toggle button for sound effects
    createMuteButton() {
        const button = document.createElement('button');
        button.className = 'sound-toggle-btn';
        button.setAttribute('title', this.muted ? 'Unmute Sounds' : 'Mute Sounds');
        
        // Style the button
        Object.assign(button.style, {
            position: "fixed",
            bottom: "130px",
            right: "20px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#9c27b0",
            color: "white",
            border: "2px solid #ffc107",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: "1000",
            fontSize: "18px"
        });
        
        // Add hover effect
        button.onmouseenter = () => {
            button.style.transform = "scale(1.1)";
        };
        button.onmouseleave = () => {
            button.style.transform = "scale(1)";
        };
        
        // Add click event
        button.onclick = () => this.toggleMute();
        
        // Set initial icon based on mute state
        this.muteButton = button;
        this.updateMuteButtonIcon();
        
        // Add to document
        document.body.appendChild(button);
    }
    
    // Create music controls (play/pause button and volume slider)
    createMusicControls() {
        // Create wrapper for music controls
        const wrapper = document.createElement('div');
        wrapper.className = 'music-controls-wrapper';
        
        // Style the wrapper
        Object.assign(wrapper.style, {
            position: "fixed",
            bottom: "185px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            zIndex: "1000"
        });
        
        // Create music toggle button
        const musicButton = document.createElement('button');
        musicButton.className = 'music-toggle-btn';
        
        // Style the button
        Object.assign(musicButton.style, {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#9c27b0",
            color: "white",
            border: "2px solid #ffc107",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            fontSize: "18px",
            transition: "transform 0.2s"
        });
        
        // Add hover effect
        musicButton.onmouseenter = () => {
            musicButton.style.transform = "scale(1.1)";
        };
        musicButton.onmouseleave = () => {
            musicButton.style.transform = "scale(1)";
        };
        
        // Add click event
        musicButton.onclick = () => this.toggleMusic();
        
        // Set initial icon based on music state
        this.musicButton = musicButton;
        this.updateMusicButtonIcon();
        
        // Create volume control panel with slider
        const volumePanel = document.createElement('div');
        volumePanel.className = 'volume-panel';
        volumePanel.style.display = 'none'; // Hidden by default
        
        // Style the volume panel
        Object.assign(volumePanel.style, {
            background: "rgba(255, 255, 255, 0.9)",
            padding: "15px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            border: "2px solid #ffc107",
            position: "absolute",
            right: "50px",
            bottom: "0",
            width: "220px",
            transition: "opacity 0.3s"
        });
        
        // Volume slider for music
        const musicVolSlider = this.createVolumeSlider(
            "Music Volume", 
            this.musicVolume, 
            (value) => this.setMusicVolume(value)
        );
        
        // Volume slider for effects
        const effectsVolSlider = this.createVolumeSlider(
            "Sound Effects Volume", 
            this.effectsVolume, 
            (value) => this.setEffectsVolume(value)
        );
        
        volumePanel.appendChild(musicVolSlider);
        volumePanel.appendChild(effectsVolSlider);
        
        // Create volume icon button to toggle panel visibility
        const volumeIcon = document.createElement('button');
        volumeIcon.className = 'volume-icon';
        volumeIcon.innerHTML = '🔊';
        volumeIcon.title = 'Volume Controls';
        
        // Style the volume icon
        Object.assign(volumeIcon.style, {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#ffc107",
            color: "#7b1fa2",
            border: "2px solid #9c27b0",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            fontSize: "18px",
            position: "relative",
            transition: "transform 0.2s"
        });
        
        // Add hover effect
        volumeIcon.onmouseenter = () => {
            volumeIcon.style.transform = "scale(1.1)";
            volumePanel.style.display = 'block';
        };
        
        // Hide panel when mouse leaves the whole control area
        wrapper.onmouseleave = () => {
            volumeIcon.style.transform = "scale(1)";
            volumePanel.style.display = 'none';
        };
        
        // Add components to wrapper
        wrapper.appendChild(musicButton);
        wrapper.appendChild(volumeIcon);
        wrapper.appendChild(volumePanel);
        
        // Add wrapper to document
        document.body.appendChild(wrapper);
    }
    
    // Create a volume slider element
    createVolumeSlider(label, initialValue, onChange) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            marginBottom: "15px"
        });
        
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        Object.assign(labelElement.style, {
            marginBottom: "8px",
            color: "#9c27b0",
            fontSize: "14px",
            fontWeight: "bold"
        });
        
        const sliderContainer = document.createElement('div');
        Object.assign(sliderContainer.style, {
            display: "flex",
            alignItems: "center",
            gap: "10px"
        });
        
        const slider = document.createElement('input');
        slider.type = "range";
        slider.min = "0";
        slider.max = "1";
        slider.step = "0.01";
        slider.value = initialValue;
        
        // Style the slider
        Object.assign(slider.style, {
            width: "150px",
            accentColor: "#9c27b0"
        });
        
        // Add value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = `${Math.round(initialValue * 100)}%`;
        Object.assign(valueDisplay.style, {
            fontSize: "14px",
            minWidth: "40px",
            textAlign: "right"
        });
        
        // Add change event listener
        slider.oninput = () => {
            const value = parseFloat(slider.value);
            onChange(value);
            valueDisplay.textContent = `${Math.round(value * 100)}%`;
        };
        
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        
        container.appendChild(labelElement);
        container.appendChild(sliderContainer);
        
        return container;
    }
    
    // Update the sound mute button icon based on current mute state
    updateMuteButtonIcon() {
        if (!this.muteButton) return;
        
        this.muteButton.innerHTML = this.muted ? '🔇' : '🔊';
        this.muteButton.setAttribute('title', this.muted ? 'Unmute Sound Effects' : 'Mute Sound Effects');
    }
    
    // Update the music button icon based on current play/pause state
    updateMusicButtonIcon() {
        if (!this.musicButton) return;
        
        this.musicButton.innerHTML = this.musicMuted ? '🎵' : '⏸️';
        this.musicButton.setAttribute('title', this.musicMuted ? 'Play Music' : 'Pause Music');
    }
}

// Initialize sound manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        window.soundManager = new SoundManager();
    }, 1000);
});
