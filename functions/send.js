export async function onRequest(context) {
    // گرفتن secret از query string
    const url = new URL(context.request.url);
    const secret = url.searchParams.get('secret');

    if (!secret) {
        return new Response('پارامتر secret ارسال نشده است.', { status: 400 });
    }

    // بررسی وجود binding KV
    if (!context.env.users) {
        return new Response('KV namespace با نام users پیدا نشد.', { status: 500 });
    }

    // دریافت مقدار از KV
    let value;
    try {
        value = await context.env.users.get(secret);
    } catch (e) {
        return new Response('خطا در ارتباط با KV: ' + e.message, { status: 500 });
    }

    if (!value) {
        return new Response('کلید مورد نظر پیدا نشد.', { status: 404 });
    }

    // نمایش مقدار به صورت ساده روی صفحه
    return new Response(value, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
} 