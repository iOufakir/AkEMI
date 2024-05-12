const addPlantBtn = document.getElementById('addPlantBtn');
const addPlantModal = document.getElementById('addPlantModal');
const closeBtn = document.querySelector('.close');

addPlantBtn.addEventListener('click', () => {
    addPlantModal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    addPlantModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === addPlantModal) {
        addPlantModal.style.display = 'none';
    }
});


// Form submission to add plants
document.querySelector('#addPlantForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const responseData = await postData('/api/plant', Object.fromEntries(formData));
        console.info("Response is: ", responseData);

        if (responseData.success) {
            document.querySelector('#successMessage').style.display = 'block';
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.error('Failed to add plant');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


// To display all plants
async function displayPlants() {
    try {
        const plants = await getData('/api/plants');

        const tableBody = document.querySelector('#plantTable tbody');
        tableBody.innerHTML = '';

        plants.forEach(plant => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plant.name}</td>
                <td>${plant.growing_season}</td>
                <td>${plant.light_requirement}</td>
                <td>${plant.temperature_requirement}</td>
                <td>${plant.liquid_fertilizer_need}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying plants:', error);
    }
}

async function getData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.status >= 200 && response.status < 300) {
            return { success: true };
        } else {
            return { success: false, error: `Failed to add plant (${response.status})` };
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



// To display all plants
displayPlants();