/**
 * Helper script to ensure background music works properly
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Music fix script loaded");
    
    // Wait for sound manager initialization
    setTimeout(() => {
        if (!window.soundManager) {
            console.warn("Sound manager not found, creating one");
            window.soundManager = new SoundManager();
            return;
        }
        
        // Check if music is playing
        const checkMusicPlaying = () => {
            console.log("Checking if music is playing...");
            
            if (window.soundManager && 
                window.soundManager.backgroundMusic && 
                window.soundManager.backgroundMusic.paused) {
                
                console.log("Music is not playing. Creating play button...");
                window.soundManager.showPlayMusicButton(true);
                
                // Also show a notification message
                showMusicNotification();
            } else {
                console.log("Music seems to be playing or not available");
            }
        };
        
        // Create notification to inform user about music
        const showMusicNotification = () => {
            const notification = document.createElement('div');
            notification.className = 'music-notification';
            
            Object.assign(notification.style, {
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "15px 20px",
                background: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #9c27b0",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: "2000",
                textAlign: "center",
                fontFamily: "'Nunito', sans-serif",
                color: "#7b1fa2",
                maxWidth: "80%",
                animation: "fade-in 1s"
            });
            
            notification.innerHTML = `
                <strong style="display: block; margin-bottom: 8px; font-size: 16px;">
                    🎵 Background Music Available!
                </strong>
                <p style="margin: 0; font-size: 14px;">
                    Click the music button on the right to start playing background music!
                </p>
            `;
            
            document.body.appendChild(notification);
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fade-in {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `;
            document.head.appendChild(style);
            
            // Auto-remove after 8 seconds
            setTimeout(() => {
                notification.style.opacity = "0";
                notification.style.transition = "opacity 0.5s";
                
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 8000);
        };
        
        // Check after some time to allow for user interactions
        setTimeout(checkMusicPlaying, 5000);
        
        // Also check after user interaction
        document.addEventListener('click', () => {
            setTimeout(checkMusicPlaying, 2000);
        }, { once: true });
        
    }, 3000);
});
