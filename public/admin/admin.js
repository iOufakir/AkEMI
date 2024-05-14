const addEnvironmentBtn = document.getElementById('addEnvironmentBtn');
const addEnvironmentModal = document.getElementById('addEnvironmentModal');
const closeBtn = document.querySelector('.close');

addEnvironmentBtn.addEventListener('click', () => {
    addEnvironmentModal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    addEnvironmentModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === addEnvironmentModal) {
        addEnvironmentModal.style.display = 'none';
    }
});


// Form submission to add plants
document.querySelector('#addEnvironmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const responseData = await postData('/api/environment', Object.fromEntries(formData));
        console.info("Response is: ", responseData);

        if (responseData.success) {
            document.querySelector('#successMessage').style.display = 'block';
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.error('Failed to add a new environment!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


// To display all environments
async function displayEnvironmentList() {
    try {
        const environmentList = await getData('/api/environment');

        const tableBody = document.querySelector('#environmentTable tbody');
        tableBody.innerHTML = '';

        environmentList.forEach(env => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${env.name}</td>
                <td>${env.temperature ? env.temperature + ' °C': '-'}</td>
                <td>${env.humidity ? env.humidity + ' %': '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying environment list:', error);
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
            return { success: false, error: `Failed to add a new environment (${response.status})` };
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const displayChart = () => {
    const ctx = document.getElementById('myChart');
    // Sample data (replace this with your actual data)
    const labels = ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
    const temperatureData = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 35, 34, 33, 32, 31, 30, 29];
    const humidityData = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73];

    new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Temperature (°C)',
            data: temperatureData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
            yAxisID: 'temperature-y-axis'
          },
          {
            label: 'Humidity (%)',
            data: humidityData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            yAxisID: 'humidity-y-axis'
          }]
        },
        options: {
          scales: {
            x: {
              scaleLabel: {
                display: true,
                labelString: 'Time (Hour)'
              }
            },
            y: {
              beginAtZero: true,
              position: 'left',
              title: {
                display: true,
                text: 'Temperature (°C)',
              },
              grid: {
                display: false
              },
              ticks: {
                beginAtZero: true,
              },
              stacked: false,
            }
          }
        }
      });
}

// To display all environments
displayEnvironmentList();
// line chart
displayChart();