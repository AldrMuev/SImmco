// Store the token in a more secure way
const TELEGRAM_BOT_TOKEN = '7133024348:AAHEOIyZhZ327elQWfcdgqnFPpvcLBbQEFQ';
let TELEGRAM_CHAT_ID = ''; // We'll set this after getting it from the API

// Function to get chat ID
async function getChatId() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            // Get the most recent chat ID
            const chatId = data.result[0].message.chat.id;
            return chatId;
        }
        throw new Error('No chat history found. Please send a message to the bot first.');
    } catch (error) {
        console.error('Error getting chat ID:', error);
        return null;
    }
}

// Initialize the form handler
async function initializeForm() {
    // Get the chat ID
    TELEGRAM_CHAT_ID = await getChatId();
    if (!TELEGRAM_CHAT_ID) {
        console.error('Could not get chat ID. Please send a message to the bot first: @Form_101bot');
    }
}

// Call initialize function when page loads
document.addEventListener('DOMContentLoaded', initializeForm);

// Add event listener to the form
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!TELEGRAM_CHAT_ID) {
        alert('Bot setup incomplete. Please try again in a few moments.');
        return;
    }
    
    // Get form values
    const name = document.querySelector('input[type="text"]').value.trim();
    const email = document.querySelector('input[type="email"]').value.trim();
    const phone = document.querySelector('input[type="tel"]').value.trim();
    const question = document.querySelector('.form-textarea').value.trim();
    
    // Basic validation
    if (!name || !email || !phone || !question) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create message text with timestamp
    const messageText = `
🔔 New Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
❓ Question: ${question}
⏰ Time: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    try {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send to Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        // Show success message and reset form
        alert('Thank you! Your message has been sent successfully.');
        e.target.reset();

    } catch (error) {
        console.error('Error sending message:', error);
        alert('Sorry, there was an error sending your message. Please try again later.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});