// index.js

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('intro-screen');
    const mainSection = document.getElementById('main-section');
    
    // Fade out the splash screen after a delay
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        // Make the main section visible after the splash screen is gone
        setTimeout(() => {
            mainSection.classList.remove('hidden');
        }, 1000); // This delay should match the splash-screen transition duration
    }, 2500); // Delay for the splash screen content to animate

    // New: Select the choice cards
    const choiceCards = document.querySelectorAll('.choice-card');

    if (choiceCards) {
        choiceCards.forEach(card => {
            card.addEventListener('click', () => {
                const role = card.getAttribute('data-role');
                localStorage.setItem('role', role);
                window.location.href = `${role}.html`;
            });
        });
    }
});