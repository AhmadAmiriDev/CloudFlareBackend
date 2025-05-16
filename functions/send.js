export async function onRequest(context) {
    try {
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

        // دریافت مقدار از KV
        const value = await context.env.users.get(secret);

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
        return new Response(JSON.stringify({
            error: 'خطا در پردازش درخواست'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 