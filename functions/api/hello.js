export async function onRequest(context) {
    const messages = [
        "سلام! به وب‌سایت ما خوش آمدید",
        "خوشحالیم که اینجا هستید",
        "امیدواریم از وب‌سایت ما لذت ببرید",
        "به جمع ما خوش آمدید"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return new Response(JSON.stringify({
        message: randomMessage,
        timestamp: new Date().toISOString()
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
} 