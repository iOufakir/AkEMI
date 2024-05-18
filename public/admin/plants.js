const addPlantBtn = document.getElementById('addPlantBtn');
const addPlantModal = document.getElementById('addPlantModal');
const closeBtn = document.querySelector('.close');
const environmentMessageError = document.querySelector("#environment-message-error");
const content = document.querySelector(".plants-content");
const temperatureBlock = document.querySelector("#temperatureValue");
const humidityBlock = document.querySelector("#humidityValue");
const environmentNameBlock = document.querySelector("#environment-name");


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
const displayPlants = async () => {
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

const displayEnvironmentStates = async (environmentId) => {
    const environmentData = await getData(`/api/environment/${environmentId}/data`);
    console.log(environmentData);

    if (environmentData && environmentData.length > 0) {
        const lastValue = environmentData[environmentData.length - 1];
        temperatureBlock.innerHTML = lastValue.temperature;
        humidityBlock.innerHTML = lastValue.humidity;
        environmentNameBlock.innerHTML = lastValue.name;
    } else {
        temperatureBlock.innerHTML = '-';
        humidityBlock.innerHTML = '-';
    }
}

const getData = async (url) => {
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

const checkEnvironment = async () => {
    try {
        const environmentList = await getData('/api/environment');
        if (environmentList && environmentList.length > 0) {
            await displayEnvironmentStates(environmentList.find(env => env.temperature).id);
            await displayPlants();
        } else {
            content.style.display = 'none';
            environmentMessageError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error displaying environment list:', error);
    }
}

// Check if the environment is already created before displaying plants
checkEnvironment();

