const express = require('express');
const dotenv = require('dotenv');
var cn = require('../middleware/cn');
dotenv.config(); // Load environment variables

const router = express.Router();

// Judge0 API endpoint
const JUDGE0_API_URL = "https://ce.judge0.com/submissions/";

router.post('/compile', cn, async (req, res) => {
    try {
        let { code, language_id, stdin } = req.body;

        // Base64 encode source code and stdin
        const encodedCode = Buffer.from(code, "utf8").toString("base64");
        const encodedInput = stdin ? Buffer.from(stdin, "utf8").toString("base64") : "";

        const response = await fetch(JUDGE0_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                source_code: encodedCode,
                language_id: language_id,
                stdin: encodedInput,
                base64_encoded: true,  // ✅ must be inside body
                wait: true             // ✅ tells Judge0 to wait until execution finishes
            })
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
