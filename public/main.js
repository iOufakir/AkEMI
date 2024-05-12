document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const responseData = await postData('/api/auth', { username, password });
            if (responseData.status === 200) {
                location.href = 'admin/admin.html';
            } else {
                alert('You are not authorized to login!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
