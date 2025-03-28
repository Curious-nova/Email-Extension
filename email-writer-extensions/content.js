console.log("Email Writer extension");

const getEmailContent = () => {
    const selectors = [
        '.h7',
        '.3s.aiL',
        '[role="presentation"]',
        '.gmail_quote'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
};

const findComposeToolbar = () => {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
};

const createAIButton = () => {
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';
    buttonContainer.style.display = 'inline-flex';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.marginRight = '8px';

    // Create AI Reply button
    const button = document.createElement('div');
    button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
    button.innerHTML = "AI Reply";
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    button.style.padding = '8px 12px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    // Create dropdown arrow (caret ▼)
    const caret = document.createElement('div');
    caret.innerHTML = '▼';
    caret.style.marginLeft = '6px';
    caret.style.fontSize = '12px';
    caret.style.cursor = 'pointer';

    // Create dropdown for tone selection
    const dropdown = document.createElement('div');
    dropdown.className = 'ai-reply-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.left = '0';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.borderRadius = '4px';
    dropdown.style.backgroundColor = '#fff';
    dropdown.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    dropdown.style.width = '150px';
    dropdown.style.padding = '5px 0';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = '9999';

    // Add tone options
    const tones = ['Professional', 'Friendly', 'Concise', 'Casual', 'Persuasive'];
    tones.forEach(tone => {
        const option = document.createElement('div');
        option.innerText = tone;
        option.style.padding = '8px 12px';
        option.style.cursor = 'pointer';
        option.style.fontSize = '14px';

        // Add hover effect
        option.addEventListener('mouseover', () => {
            option.style.backgroundColor = '#f1f1f1';
        });
        option.addEventListener('mouseout', () => {
            option.style.backgroundColor = '#fff';
        });

        // Handle tone selection
        option.addEventListener('click', async (e) => {
            e.stopPropagation();
            const selectedTone = tone.toLowerCase();
            console.log(`Selected tone: ${selectedTone}`);
            dropdown.style.display = 'none'; // Hide dropdown after selecting

            // Generate reply with selected tone
            await generateAIReply(selectedTone, button);
        });

        dropdown.appendChild(option);
    });

    // Show/hide dropdown on caret click
    caret.addEventListener('click', (e) => {
        e.stopPropagation();

        // Get button position
        const rect = button.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;

        // Check if enough space below, else show above
        if (spaceBelow < 150) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = '100%'; // Show dropdown above
            dropdown.style.marginBottom = '4px';
        } else {
            dropdown.style.top = '100%';
            dropdown.style.bottom = 'auto'; // Show dropdown below
            dropdown.style.marginTop = '4px';
        }

        // Toggle dropdown visibility
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!buttonContainer.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Add elements to button container
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(caret);
    buttonContainer.appendChild(dropdown);

    return buttonContainer;
};

const generateAIReply = async (selectedTone, button) => {
    try {
        button.innerHTML = "Generating...";
        button.disabled = true;

        const emailContent = getEmailContent();

        const response = await fetch('http://localhost:8080/api/email/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailContent: emailContent,
                tone: selectedTone
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const generatedReply = await response.text();
        const composeBox = document.querySelector('[role="textbox"],[g_editable="true"]');

        if (composeBox) {
            composeBox.focus();
            document.execCommand('insertText', false, generatedReply);
        } else {
            throw new Error("Compose box was not found");
        }
    } catch (error) {
        console.error(error);
        alert("Failed to generate reply");
    } finally {
        button.innerHTML = 'AI Reply';
        button.disabled = false;
    }
};

const injectButton = () => {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolBar = findComposeToolbar();

    if (!toolBar) {
        console.log("Toolbar not found");
        return;
    } else {
        console.log("Toolbar found, creating AI button");

        // Create button and dropdown
        const buttonContainer = createAIButton();
        buttonContainer.classList.add('ai-reply-button');

        toolBar.insertBefore(buttonContainer, toolBar.firstChild);
    }
};

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return false;
            }

            if (node.classList &&
                (node.classList.contains('aDh') ||
                    node.classList.contains('btC') ||
                    node.getAttribute('role') === 'dialog')) {
                return true;
            }

            return !!(node.querySelector && (
                node.querySelector('.aDh') ||
                node.querySelector('.btC') ||
                node.querySelector('[role="dialog"]')
            ));
        });

        if (hasComposeElements) {
            setTimeout(injectButton, 500);
        }
    }
});

// Start observing changes in the document body
observer.observe(document.body, {
    childList: true,
    subtree: true
});
