document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', async () => {
        const password = document.getElementById('passwordInput').value;
        const plantName = document.getElementById('plantInput').value;

        try {
            const responseData = await postData('http://localhost:3000/api/auth', { plantName, password });
            alert('Response from the server: '+ responseData.message);
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

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
