export async function onRequest(context) {
    const url = new URL(context.request.url);
    const secret = url.searchParams.get('secret');
    const message = url.searchParams.get('message');

    // Input validation
    if (!secret || !message) {
        return new Response('Required parameters are missing.', { status: 400 });
    }

    // Check KV binding
    const usersKV = context.env.users;
    if (!usersKV) {
        return new Response('Database not found.', { status: 500 });
    }

    // Get value from KV with timeout
    let value;
    try {
        value = await Promise.race([
            usersKV.get(secret),
            new Promise((_, reject) => setTimeout(() => reject(new Error('KV Timeout')), 2000))
        ]);
    } catch (e) {
        return new Response('Error connecting to Database: ' + e.message, { status: 504 });
    }

    if (!value) {
        return new Response('Key not found or has no value.', { status: 404 });
    }

    // Parse token and chat_id with strict validation
    const [token, chat_id] = value.split(',').map(s => s.trim());
    if (!token || !chat_id || !/^\d{9,10}:[\w-]{35,}$/.test(token) || !/^(-?\d+)$/.test(chat_id)) {
        return new Response('Invalid value format in KV.', { status: 422 });
    }

    // Prepare Telegram request
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = JSON.stringify({
        chat_id,
        text: message
    });

    // Send message to Telegram with timeout and error handling
    let telegramRes, telegramData;
    try {
        telegramRes = await Promise.race([
            fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Telegram Timeout')), 3000))
        ]);
        telegramData = await telegramRes.json();
    } catch (e) {
        return new Response('Error sending request to Telegram: ' + e.message, { status: 504 });
    }

    if (!telegramRes.ok) {
        return new Response('Invalid response from Telegram: ' + telegramRes.status, { status: telegramRes.status });
    }

    if (!telegramData.ok) {
        return new Response('Failed to send message to Telegram: ' + (telegramData.description || ''), { status: 502 });
    }

    // Success response
    return new Response('Message sent successfully.', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
} 