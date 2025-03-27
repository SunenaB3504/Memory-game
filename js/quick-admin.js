// Add this to quickly access the admin panel without using keyboard shortcuts

function showAdminPanel() {
    // Check if the reward controller exists
    if (!window.rewardController) {
        console.error("Reward controller not initialized");
        return false;
    }
    
    // Enable admin mode
    if (window.rewardController.enableAdminMode("admin123")) {
        // Find the admin panel instance or create one if needed
        let adminPanel = window.adminPanel;
        if (!adminPanel) {
            adminPanel = new AdminPanel(window.rewardController);
            window.adminPanel = adminPanel;
        }
        
        // Show the panel
        adminPanel.showPanel();
        
        return true;
    }
    
    return false;
}

// Create a visible button for parent access
function createAdminButton() {
    const button = document.createElement('button');
    button.textContent = "Parent Controls";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.left = "20px";
    button.style.zIndex = "1000";
    button.style.padding = "8px 12px";
    button.style.background = "#9c27b0";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "30px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
    button.style.fontSize = "14px";
    button.style.fontFamily = "'Nunito', sans-serif";
    
    button.addEventListener('click', () => {
        const password = prompt("Enter parent password:", "");
        if (password === "admin123") {
            showAdminPanel();
        } else {
            alert("Incorrect password");
        }
    });
    
    document.body.appendChild(button);
    return button;
}

// Call this function when document is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createAdminButton, 1000);
});
