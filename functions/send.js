export async function onRequest(context) {
    try {
        // بررسی وجود KV
        if (!context.env.users) {
            console.error('KV namespace "users" یافت نشد');
            return new Response(JSON.stringify({
                error: 'تنظیمات KV نامعتبر است'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // دریافت secret از query string
        const url = new URL(context.request.url);
        const secret = url.searchParams.get('secret');

        if (!secret) {
            return new Response(JSON.stringify({
                error: 'لطفاً secret را در query string وارد کنید'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        console.log('درخواست برای secret:', secret);

        // دریافت مقدار از KV
        const value = await context.env.users.get(secret);
        console.log('مقدار دریافت شده:', value);

        if (!value) {
            return new Response(JSON.stringify({
                error: 'secret نامعتبر است'
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // نمایش مقدار
        return new Response(JSON.stringify({
            value: value
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('خطا:', error);
        return new Response(JSON.stringify({
            error: 'خطا در پردازش درخواست',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 