const express = require('express');
const router = express.Router();
const axios = require('axios');

// Relevant UK Mortgage source links
const UK_MORTGAGE_SOURCES = [
    { name: 'MoneySavingExpert — Mortgages', url: 'https://www.moneysavingexpert.com/mortgages/' },
    { name: 'MoneySuperMarket — Mortgage Guide', url: 'https://www.moneysupermarket.com/mortgages/' },
    { name: 'UK Finance — Mortgage Data', url: 'https://www.ukfinance.org.uk/data-and-research/data/mortgages' },
    { name: 'FCA — Mortgage Conduct Rules', url: 'https://www.fca.org.uk/consumers/mortgages' },
    { name: 'Which? — Mortgage Advice', url: 'https://www.which.co.uk/money/mortgages-and-property' },
    { name: 'Bank of England — Base Rate', url: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate' },
    { name: 'GOV.UK — Help to Buy', url: 'https://www.gov.uk/help-to-buy-equity-loan' },
    { name: 'Citizens Advice — Buying a Home', url: 'https://www.citizensadvice.org.uk/housing/buying-a-home/' },
];

const getRelevantSources = (question) => {
    const q = question.toLowerCase();
    const relevant = [];

    if (q.includes('rate') || q.includes('interest') || q.includes('base rate') || q.includes('boe'))
        relevant.push(UK_MORTGAGE_SOURCES[5]);
    if (q.includes('first time') || q.includes('help to buy') || q.includes('ftb'))
        relevant.push(UK_MORTGAGE_SOURCES[6]);
    if (q.includes('fca') || q.includes('regulated') || q.includes('legal'))
        relevant.push(UK_MORTGAGE_SOURCES[3]);
    if (q.includes('borrow') || q.includes('afford') || q.includes('salary') || q.includes('income') || q.includes('how much'))
        relevant.push(UK_MORTGAGE_SOURCES[1]);
    if (q.includes('remortgage') || q.includes('switch') || q.includes('deal') || q.includes('fixed'))
        relevant.push(UK_MORTGAGE_SOURCES[0]);
    if (q.includes('buy to let') || q.includes('landlord') || q.includes('btl'))
        relevant.push(UK_MORTGAGE_SOURCES[1]);
    if (q.includes('protect') || q.includes('insurance') || q.includes('critical') || q.includes('life'))
        relevant.push(UK_MORTGAGE_SOURCES[4]);
    if (q.includes('data') || q.includes('statistic') || q.includes('market'))
        relevant.push(UK_MORTGAGE_SOURCES[2]);

    if (relevant.length === 0) {
        relevant.push(UK_MORTGAGE_SOURCES[0], UK_MORTGAGE_SOURCES[4]);
    } else if (relevant.length === 1) {
        relevant.push(UK_MORTGAGE_SOURCES[0]);
    }

    // Deduplicate and limit to 3
    return [...new Map(relevant.map(s => [s.url, s])).values()].slice(0, 3);
};

const SYSTEM_PROMPT = `You are an expert UK Mortgage and Protection Advisor for MKWise Financial, an FCA-regulated broker.

Your expertise covers:
- UK mortgage products: fixed-rate, tracker, variable, offset, interest-only
- Buyer types: first-time buyers, remortgagers, buy-to-let investors, shared ownership
- Affordability: stress tests, LTV, income multiples (typically 4.5x salary)
- Protection products: life insurance, critical illness cover, income protection

Guidelines:
- Provide answers as a concise summary in 5-6 bullet points where possible.
- Keep total response length very short andSurmised.
- For mortgage rate queries: ONLY provide the current Bank of England (BoE) Base Rate. Explain that specific product rates vary significantly based on LTV and personal circumstances.
- Always advise checking current market rates with an advisor for a fair representation.
- For personalised advice, direct users to "SEEK AN ADVISOR" at MKWise.
- Do NOT answer questions unrelated to UK mortgages or protection finance.`;

// POST /api/chatbot
router.post('/', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
        return res.status(503).json({
            reply: 'The AI assistant is not yet configured. Please add a GROQ_API_KEY to the backend .env file.',
            sources: getRelevantSources(message)
        });
    }

    try {
        // Build messages array in OpenAI format (Groq is OpenAI-compatible)
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            // Include last 6 messages of history for context
            ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message }
        ];

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.1-8b-instant',
                messages,
                max_tokens: 300,
                temperature: 0.7,
                stream: false
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content?.trim() ||
            'I couldn\'t generate a response. Please try rephrasing your question.';

        const sources = getRelevantSources(message);

        res.json({ reply, sources });

    } catch (error) {
        console.error('Groq API error:', error?.response?.data || error.message);

        if (error?.response?.status === 401) {
            return res.status(401).json({ error: 'Invalid Groq API key. Please check your .env configuration.' });
        }
        if (error?.response?.status === 429) {
            return res.json({
                reply: 'Rate limit reached. Please wait a moment and try again.',
                sources: getRelevantSources(message)
            });
        }

        res.status(500).json({ error: 'The AI assistant is temporarily unavailable. Please contact our advisors directly.' });
    }
});

module.exports = router;
