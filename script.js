document.addEventListener('DOMContentLoaded', () => {
    const changeColorBtn = document.getElementById('changeColorBtn');
    const getMessageBtn = document.getElementById('getMessageBtn');
    const messageDiv = document.getElementById('message');
    const colors = ['#f0f0f0', '#e6f3ff', '#ffe6e6', '#e6ffe6', '#f0e6ff'];
    let currentColorIndex = 0;

    // تابع دریافت پیام از API
    async function getMessage() {
        try {
            const response = await fetch('/api/hello');
            const data = await response.json();
            messageDiv.textContent = data.message;
            messageDiv.style.display = 'block';
        } catch (error) {
            console.error('خطا در دریافت پیام:', error);
            messageDiv.textContent = 'متأسفانه در دریافت پیام مشکلی پیش آمده است.';
        }
    }

    // تغییر رنگ پس‌زمینه
    changeColorBtn.addEventListener('click', () => {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[currentColorIndex];
    });

    // دریافت پیام جدید
    getMessageBtn.addEventListener('click', getMessage);

    // دریافت پیام اولیه
    getMessage();
}); 