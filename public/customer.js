// customer.js
const API_URL = 'http://localhost:3000'; // Replace with your Vercel URL

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('customer-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleCustomerRegister);
    }
    
    const requestForm = document.getElementById('service-request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', handleServiceRequest);
    }
});

async function handleCustomerRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const phone = document.getElementById('phone').value;
    const language = document.getElementById('language').value;

    try {
        const res = await fetch(`${API_URL}/customer/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, location, phone, language })
        });
        const message = await res.text();
        alert(message);
        if (res.ok) {
            localStorage.setItem('registered', 'customer');
            localStorage.setItem('phone', phone);
        }
    } catch (error) {
        alert('Registration failed.');
    }
}

async function handleServiceRequest(e) {
    e.preventDefault();
    const service = document.getElementById('service').value;
    const location = document.getElementById('location').value;
    const customerPhone = localStorage.getItem('phone');
    const matchesDiv = document.getElementById('matches');
    matchesDiv.innerHTML = '';

    try {
        const res = await fetch(`${API_URL}/request-service`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service, location, phone: customerPhone })
        });
        const data = await res.json();
        
        if (data.message) {
            matchesDiv.innerHTML = `<p class="body-text">${data.message}</p>`;
        } else {
            data.forEach(worker => {
                matchesDiv.innerHTML += `
                    <div class="card-small fade-in">
                        <p class="card-title">${worker.name}</p>
                        <p class="body-text">Rating: ${worker.rating} ⭐</p>
                        <p class="body-text">Price: ${worker.price}</p>
                        <button onclick="bookWorker('${customerPhone}', '${worker.name}', '${service}')" class="button-primary">Yes</button>
                    </div>
                `;
            });
        }
    } catch (error) {
        alert('Failed to find workers.');
    }
}

async function bookWorker(customerPhone, workerName, service) {
    try {
        const res = await fetch(`${API_URL}/book-worker`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerPhone, workerName, service })
        });
        const message = await res.text();
        alert(message);
    } catch (error) {
        alert('Booking failed.');
    }
}

// Attach functions to global window object
window.bookWorker = bookWorker;