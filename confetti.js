// Confetti Animation System
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ade80', '#fbbf24'];
    const confettiCount = 50;
    const container = document.body;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(container, colors);
    }
}

function createConfettiPiece(container, colors) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random properties
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * window.innerWidth;
    const delay = Math.random() * 3;
    const duration = Math.random() * 3 + 2;
    
    // Set styles
    confetti.style.backgroundColor = color;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    confetti.style.left = left + 'px';
    confetti.style.top = '-10px';
    confetti.style.animationDelay = delay + 's';
    confetti.style.animationDuration = duration + 's';
    confetti.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
    
    // Add rotation
    const rotation = Math.random() * 360;
    confetti.style.transform = `rotate(${rotation}deg)`;
    
    container.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, (duration + delay) * 1000);
}

// Add confetti animation CSS
const confettiStyles = document.createElement('style');
confettiStyles.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(${window.innerHeight + 20}px) rotate(720deg);
            opacity: 0;
        }
    }
    
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        pointer-events: none;
        z-index: 10000;
        border-radius: 2px;
    }
`;
document.head.appendChild(confettiStyles);

// Particle burst effect for special celebrations
function createParticleBurst(x, y) {
    const particleCount = 20;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ade80', '#fbbf24'];
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(x, y, colors);
    }
}

function createParticle(x, y, colors) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 6 + 3;
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = Math.random() * 100 + 50;
    
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    
    document.body.appendChild(particle);
    
    // Animate particle
    const deltaX = Math.cos(angle) * velocity;
    const deltaY = Math.sin(angle) * velocity;
    
    particle.animate([
        {
            transform: 'translate(0, 0) scale(1)',
            opacity: 1
        },
        {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`,
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    };
}

// Celebration text effect
function createCelebrationText(text, x, y) {
    const element = document.createElement('div');
    element.textContent = text;
    element.style.position = 'fixed';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.fontSize = '24px';
    element.style.fontWeight = 'bold';
    element.style.color = '#667eea';
    element.style.pointerEvents = 'none';
    element.style.zIndex = '10001';
    element.style.fontFamily = 'Poppins, sans-serif';
    element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
    
    document.body.appendChild(element);
    
    // Animate text
    element.animate([
        {
            transform: 'translateY(0) scale(0.5)',
            opacity: 0
        },
        {
            transform: 'translateY(-50px) scale(1.2)',
            opacity: 1,
            offset: 0.5
        },
        {
            transform: 'translateY(-100px) scale(1)',
            opacity: 0
        }
    ], {
        duration: 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };
}

// Enhanced confetti for special occasions
function createSpecialConfetti(type = 'celebration') {
    switch (type) {
        case 'levelup':
            createConfetti();
            setTimeout(() => createConfetti(), 500);
            createCelebrationText('LEVEL UP!', window.innerWidth / 2 - 50, window.innerHeight / 2);
            break;
            
        case 'gameunlock':
            createConfetti();
            createCelebrationText('NEW GAME!', window.innerWidth / 2 - 50, window.innerHeight / 2);
            break;
            
        case 'taskComplete':
            // Quick burst of confetti
            const colors = ['#667eea', '#4ade80', '#fbbf24'];
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createConfettiPiece(document.body, colors), i * 50);
            }
            break;
            
        default:
            createConfetti();
    }
}

// Export functions for use in other modules
window.createConfetti = createConfetti;
window.createParticleBurst = createParticleBurst;
window.createSpecialConfetti = createSpecialConfetti;
