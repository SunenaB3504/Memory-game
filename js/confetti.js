/**
 * Confetti animation to celebrate game victory
 */

class ConfettiCelebration {
    constructor() {
        this.container = document.getElementById('confetti-container');
        this.confettiCount = 100;
        this.confettiPieces = [];
    }
    
    createConfetti() {
        // Clear any existing confetti
        this.container.innerHTML = '';
        this.confettiPieces = [];
        
        // Create new confetti pieces
        for (let i = 0; i < this.confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            
            // Random positioning and animation
            const left = Math.random() * 100;
            const animation = `confetti-fall ${Math.random() * 3 + 2}s ease-in-out forwards`;
            const delay = Math.random() * 2;
            
            confetti.style.left = `${left}%`;
            confetti.style.animation = animation;
            confetti.style.animationDelay = `${delay}s`;
            
            // Random rotation
            const rotation = Math.random() * 360;
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            this.container.appendChild(confetti);
            this.confettiPieces.push(confetti);
        }
        
        // Add some stars and sparkles too!
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'confetti-piece';
            star.innerHTML = i % 2 === 0 ? '✨' : '🌟';
            star.style.background = 'transparent';
            star.style.color = '#ffc107';
            star.style.fontSize = `${Math.random() * 20 + 15}px`;
            
            // Random positioning and animation
            const left = Math.random() * 100;
            const animation = `star-float ${Math.random() * 4 + 3}s ease-in-out forwards`;
            const delay = Math.random() * 2;
            
            star.style.left = `${left}%`;
            star.style.animation = animation;
            star.style.animationDelay = `${delay}s`;
            
            this.container.appendChild(star);
            this.confettiPieces.push(star);
        }
        
        // Add animation styles
        this.addAnimationStyles();
        
        // Remove confetti after animation completes
        setTimeout(() => {
            this.removeConfetti();
        }, 7000);
    }
    
    addAnimationStyles() {
        // Create styles for the confetti animations
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            
            @keyframes star-float {
                0% { transform: translateY(0) scale(0); opacity: 0; }
                10% { opacity: 1; transform: scale(1); }
                90% { opacity: 0.8; }
                100% { transform: translateY(80vh) scale(0.5); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    removeConfetti() {
        this.confettiPieces.forEach(piece => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        });
        this.confettiPieces = [];
    }
}

// Initialize and make it globally available
window.confetti = new ConfettiCelebration();
