// Main navigation functions for the T-Shark platform

// Navigate to speed reading application
function goToSpeedReading() {
    // Add smooth transition effect
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = 'speed-reader.html';
    }, 200);
}

// Navigate to AI chat application
function goToAIChat() {
    // Add smooth transition effect
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = 'ai-chat.html';
    }, 200);
}

// Initialize page animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animations
    const cards = document.querySelectorAll('.option-card');
    
    // Stagger the card animations
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
    
    // Add hover effects for option cards
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click animation to buttons
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Initialize AdSense after page load
    setTimeout(() => {
        if (window.adsbygoogle) {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, 1000);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .option-button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);