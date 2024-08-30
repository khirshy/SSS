document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the username from localStorage
    const username = localStorage.getItem('username');
    var today = new Date();
    var hour_now = today.getHours();
    var greetings;

    if (hour_now > 18) {
        greetings = 'Good evening!';
    } else if (hour_now > 12) {
        greetings = 'Good afternoon!';
    } else if (hour_now > 0) {
        greetings = 'Good morning!';
    } else {
        greetings = 'Hello!';
    }

    if (username) {
        document.getElementById('greeting').innerText = `Hello, ${username}`;
        document.getElementById('welcome-message').innerText = `Welcome, ${greetings}!`;
    } else {
        document.getElementById('welcome-message').innerText = `Welcome!`;
    }

    // Load saved passwords
    loadPasswords();

    // Handle form submission
    document.getElementById('password-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const siteName = document.getElementById('site-name').value;
        const siteUrl = document.getElementById('site-url').value;
        const siteUsername = document.getElementById('site-username').value;
        const sitePassword = document.getElementById('site-password').value;

        // Create a new password entry object
        const passwordEntry = {
            siteName,
            siteUrl,
            siteUsername,
            sitePassword
        };

        // Save the password entry to localStorage
        savePassword(passwordEntry);

        // Clear the form
        document.getElementById('password-form').reset();

        // Reload the password list
        loadPasswords();
    });

    // Function to save a password entry to localStorage
    function savePassword(passwordEntry) {
        if (!username) {
            alert('No user is logged in!');
            return;
        }
        let userPasswords = JSON.parse(localStorage.getItem(`passwords_${username}`)) || [];
        userPasswords.push(passwordEntry);
        localStorage.setItem(`passwords_${username}`, JSON.stringify(userPasswords));
    }

    // Function to load passwords from localStorage and display them
    function loadPasswords() {
        const passwordList = document.getElementById('password-list');
        passwordList.innerHTML = ''; // Clear existing list

        if (!username) {
            alert('No user is logged in!');
            return;
        }

        let userPasswords = JSON.parse(localStorage.getItem(`passwords_${username}`)) || [];
        userPasswords.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Site:</strong> <a href="${entry.siteUrl}" target="_blank">${entry.siteName}</a><br>
                <strong>Username:</strong> ${entry.siteUsername}<br>
                <strong>Password:</strong> <span class="password">${entry.sitePassword}</span>
                <div class="actions">
                    <button class="copy">Copy</button>
                    <button class="delete">Delete</button>
                </div>
            `;

            // Handle copy button
            listItem.querySelector('.copy').addEventListener('click', () => {
                copyToClipboard(entry.sitePassword);
                alert('Password copied to clipboard');
            });

            // Handle delete button
            listItem.querySelector('.delete').addEventListener('click', () => {
                userPasswords.splice(index, 1);
                localStorage.setItem(`passwords_${username}`, JSON.stringify(userPasswords));
                loadPasswords();
            });

            passwordList.appendChild(listItem);
        });
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = text;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // Password generator
    document.getElementById('generate-password').addEventListener('click', function() {
        const generatedPassword = generatePassword(12);
        document.getElementById('site-password').value = generatedPassword;
        checkPasswordStrength(generatedPassword);
    });

    // Function to generate a random password
    function generatePassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    // Password strength checker
    document.getElementById('site-password').addEventListener('input', function() {
        const password = this.value;
        checkPasswordStrength(password);
    });

    function checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
        let strength = 0;
        if (password.length > 7) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[@$!%*?&#]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                strengthIndicator.textContent = "Weak";
                strengthIndicator.style.color = "red";
                break;
            case 2:
                strengthIndicator.textContent = "Moderate";
                strengthIndicator.style.color = "orange";
                break;
            case 3:
                strengthIndicator.textContent = "Strong";
                strengthIndicator.style.color = "green";
                break;
            case 4:
                strengthIndicator.textContent = "Very Strong";
                strengthIndicator.style.color = "darkgreen";
                break;
        }
    }

    // Find password functionality
    document.getElementById('find-password').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const passwordItems = document.querySelectorAll('#password-list li');

        passwordItems.forEach(item => {
            const siteName = item.querySelector('a').textContent.toLowerCase();
            if (siteName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
