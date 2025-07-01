// content.js - This script runs directly on the Allen video page for the speed control extension.
// It applies a user-defined playback rate and consistently enforces it.

console.log('Neo says: Allen Video Speed Controller content script loaded (Auto-Run Version).');

(function() {
    const targetSpeed = 2.5;
    let enforceInterval = null; // Stores the interval ID for toggling
    let isSpeedEnforced = false; // Tracks the current state
    const buttonId = 'neo-speed-toggle-button';
    const consoleLogPrefix = 'Neo says: Console: ';

    /**
     * Applies the given playback speed to a specific video element
     * and sets up persistent listeners.
     * @param {HTMLVideoElement} videoElement The video element to control.
     * @param {number} speed The desired playback rate.
     */
    function applySpeedToVideo(videoElement, speed) {
        if (!videoElement) {
            return;
        }

        // Set speed immediately if it's not already at the desired rate
        if (videoElement.playbackRate !== speed) {
            videoElement.playbackRate = speed;
            console.log(`${consoleLogPrefix}Applied ${speed}x speed to video.`);
        }

        // Attach event listeners only once to prevent duplicates
        if (!videoElement.__neo_console_listeners_added) {
            console.log(`${consoleLogPrefix}Attaching persistent speed listeners to video.`);

            videoElement.onratechange = () => {
                if (isSpeedEnforced && videoElement.playbackRate !== speed) {
                    videoElement.playbackRate = speed;
                    console.warn(`${consoleLogPrefix}Video tried to change speed, forced back to ${speed}x! (onratechange)`);
                }
            };

            videoElement.onloadedmetadata = () => {
                if (isSpeedEnforced && videoElement.playbackRate !== speed) {
                    videoElement.playbackRate = speed;
                    console.log(`${consoleLogPrefix}Metadata loaded, re-applied ${speed}x speed. (onloadedmetadata)`);
                }
            };

            videoElement.onplay = () => {
                if (isSpeedEnforced && videoElement.playbackRate !== speed) {
                    videoElement.playbackRate = speed;
                    console.log(`${consoleLogPrefix}Video started playing, ensured ${speed}x speed. (onplay)`);
                }
            };

            videoElement.onseeking = () => {
                if (isSpeedEnforced && videoElement.playbackRate !== speed) {
                    videoElement.playbackRate = speed;
                    console.log(`${consoleLogPrefix}Video seeking, ensured ${speed}x speed. (onseeking)`);
                }
            };

            videoElement.__neo_console_listeners_added = true;
        }
    }

    /**
     * Finds all video elements and applies the target speed if enforcement is on.
     */
    function enforceSpeed() {
        if (!isSpeedEnforced) return; // Only enforce if enabled

        const videos = document.querySelectorAll('video');
        if (videos.length === 0) {
            // console.log(`${consoleLogPrefix}No video elements found during check.`); // Less noisy
        } else {
            videos.forEach(video => {
                applySpeedToVideo(video, targetSpeed);
            });
            // console.log(`${consoleLogPrefix}Speed enforcement check complete. Videos found: ${videos.length}`); // Less noisy
        }
    }

    /**
     * Starts the periodic speed enforcement.
     */
    function startEnforcement() {
        if (enforceInterval) {
            clearInterval(enforceInterval);
        }
        isSpeedEnforced = true;
        enforceSpeed(); // Initial immediate application
        enforceInterval = setInterval(enforceSpeed, 500); // Check every 500ms
        console.log(`${consoleLogPrefix}2x Speed enforcement ON.`);
    }

    /**
     * Stops the periodic speed enforcement.
     */
    function stopEnforcement() {
        if (enforceInterval) {
            clearInterval(enforceInterval);
            enforceInterval = null;
        }
        isSpeedEnforced = false;
        console.log(`${consoleLogPrefix}2x Speed enforcement OFF.`);
    }

    /**
     * Toggles the speed enforcement on/off.
     */
    function toggleSpeedEnforcement() {
        if (isSpeedEnforced) {
            stopEnforcement();
            this.textContent = '2x Speed OFF';
            this.style.backgroundColor = '#f44336'; // Red for OFF
        } else {
            startEnforcement();
            this.textContent = '2x Speed ON';
            this.style.backgroundColor = '#4CAF50'; // Green for ON
        }
    }

    // Check if the button already exists to prevent duplicates
    let toggleButton = document.getElementById(buttonId);
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = buttonId;
        toggleButton.textContent = '2x Speed ON'; // Initial state text
        toggleButton.style.cssText = `
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background-color: #4CAF50; /* Green */
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 8px; /* Rounded corners */
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 99999; /* Ensure it's on top */
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
        `;
        toggleButton.onmouseover = () => toggleButton.style.transform = 'translateY(-50%) scale(1.05)';
        toggleButton.onmouseout = () => toggleButton.style.transform = 'translateY(-50%) scale(1)';
        toggleButton.onmousedown = () => toggleButton.style.transform = 'translateY(-50%) scale(0.95)';
        toggleButton.onmouseup = () => toggleButton.style.transform = 'translateY(-50%) scale(1)';

        toggleButton.addEventListener('click', toggleSpeedEnforcement);
        document.body.appendChild(toggleButton);
        console.log(`${consoleLogPrefix}Toggle button added to page.`);
    } else {
        console.log(`${consoleLogPrefix}Toggle button already exists.`);
    }

    // Initialize speed enforcement to ON when the script runs
    startEnforcement();

    // Add a cleanup listener for the interval when the page is unloaded
    window.addEventListener('beforeunload', () => {
        stopEnforcement(); // Ensure interval is cleared on page navigation/close
        if (toggleButton && toggleButton.parentElement) {
            toggleButton.parentElement.removeChild(toggleButton); // Remove button
            console.log(`${consoleLogPrefix}Removed toggle button on page unload.`);
        }
    });

    console.log(`${consoleLogPrefix}Console script initialized.`);

})();
