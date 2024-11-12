// controllers/chatbotController.js
const path = require('path');
const fs = require('fs');
const Fuse = require('fuse.js');

// Load Q&A data
const qaFilePath = path.join(__dirname, '..', 'data', 'qa.json');
let qaData = {};

// Read Q&A data from the JSON file synchronously at startup
try {
  const data = fs.readFileSync(qaFilePath, 'utf8');
  qaData = JSON.parse(data);
} catch (err) {
  console.error('Error reading Q&A file:', err);
}

// Initialize Fuse.js for fuzzy searching
const fuse = new Fuse(Object.keys(qaData), {
  includeScore: true,
  threshold: 0.4, // Adjust based on desired sensitivity
  ignoreLocation: true, // Ignore the location of the match in the string
  keys: [] // Since we're searching an array of strings
});

/**
 * Handle chatbot messages
 */
exports.handleChatbotMessage = async (req, res) => {
  const userMessage = req.body.message ? req.body.message.toLowerCase().trim() : '';

  if (!userMessage) {
    return res.status(400).json({ reply: "Please enter a question." });
  }

  // Search for the best match using Fuse.js
  const results = fuse.search(userMessage);

  if (results.length > 0 && results[0].score < 0.5) { // Adjust score threshold as needed
    const matchedQuestion = results[0].item;
    const answer = qaData[matchedQuestion];
    return res.json({ reply: answer });
  } else {
    return res.json({ reply: "I'm sorry, I don't understand that question. Here are some things you can ask me:\n- How to transfer money\n- How to schedule a payment\n- How to reset my password" });
  }
};
