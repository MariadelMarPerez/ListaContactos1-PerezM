
const contactForm = document.getElementById('contact-form'); // ✅ FALTABA
const contactsList = document.getElementById('contacts-list');
const btnSubmit = document.getElementById('btn-submit');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');

let contacts = [];
let currentIdToDelete = null;

// 🔹 CARGAR DATOS
async function loadContacts() {
    const res = await fetch('http://localhost:3006/contactos');
    contacts = await res.json();
    render();
}

// 🔹 RENDER
function render() {
    contactsList.innerHTML = '';

    contacts.forEach(c => {

        const icon = c.gender === 'Femenino' 
            ? 'bi-person-fill text-pink-400' 
            : 'bi-person-fill text-blue-400';

        const card = document.createElement('div');
        card.className = 'contact-card';

        card.innerHTML = `
        <div class="card-header" onclick="toggleAccordion('${c.id}')">

            <span class="flex items-center gap-2">
                <i class="bi ${icon}"></i>
                <strong>${c.name}</strong>
            </span>

            <div class="flex gap-2">
                <button onclick="event.stopPropagation(); loadForEdit('${c.id}')">
                    <i class="bi bi-pencil-square text-blue-400"></i>
                </button>

                <button onclick="event.stopPropagation(); confirmDelete('${c.id}', '${c.name}')">
                    <i class="bi bi-trash3-fill text-red-400"></i>
                </button>
            </div>

        </div>

        <div id="body-${c.id}" class="card-body">

            <p class="text-sm py-1 flex items-center">
                <i class="bi bi-telephone text-blue-400 mr-2"></i>
                ${c.phone}
            </p>

            <p class="text-sm py-1 flex items-center">
                <i class="bi bi-geo-alt text-green-400 mr-2"></i>
                ${c.city}
            </p>

            <p class="text-sm py-1 flex items-center">
                <i class="bi bi-house text-orange-400 mr-2"></i>
                ${c.address}
            </p>

        </div>
        `;

        contactsList.appendChild(card);
    });
}

// 🔹 ACORDEON
function toggleAccordion(id) {
    const body = document.getElementById(`body-${id}`);
    body.classList.toggle('active');
}

// 🔹 VALIDAR
function validate() {
    let isValid = true;

    ['name', 'phone', 'city', 'address'].forEach(id => {
        const input = document.getElementById(id);
        const error = input.nextElementSibling;

        if (!input.value.trim()) {
            error.style.display = 'block';
            isValid = false;
        } else {
            error.style.display = 'none';
        }
    });

    const gender = document.querySelector('input[name="gender"]:checked');
    document.getElementById('gender-error').style.display = gender ? 'none' : 'block';

    return isValid && !!gender;
}

// 🔹 SUBMIT
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    btnSubmit.disabled = true;

    setTimeout(async () => {

        const editId = document.getElementById('edit-id').value;

        const newContact = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            gender: document.querySelector('input[name="gender"]:checked').value
        };

        try {
            if (editId) {
                await fetch(`http://localhost:3006/contactos/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newContact)
                });
                document.getElementById('modal-success').showModal();
            } else {
                await fetch('http://localhost:3006/contactos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newContact)
                });
            }

            contactForm.reset();
            document.getElementById('edit-id').value = '';
            loadContacts();

        } catch (error) {
            console.log("ERROR:", error);
        }

        btnText.innerHTML = '<i class="bi bi-person-plus-fill"></i> AÑADIR CONTACTO';
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        btnSubmit.disabled = false;

    }, 1200);
});

// 🔹 EDITAR
window.loadForEdit = (id) => {
    const c = contacts.find(x => x.id == id);

    document.getElementById('edit-id').value = c.id;
    document.getElementById('name').value = c.name;
    document.getElementById('phone').value = c.phone;
    document.getElementById('city').value = c.city;
    document.getElementById('address').value = c.address;

    document.querySelector(`input[name="gender"][value="${c.gender}"]`).checked = true;

    btnText.innerHTML = '<i class="bi bi-check-circle-fill"></i> ACTUALIZAR';
};

// 🔹 ELIMINAR
window.confirmDelete = (id, name) => {
    currentIdToDelete = id;

    document.getElementById('delete-msg').innerText = `¿Deseas eliminar a ${name}?`;
    document.getElementById('modal-confirm').showModal();
};

document.getElementById('confirm-delete').onclick = async () => {

    await fetch(`http://localhost:3006/contactos/${currentIdToDelete}`, {
        method: 'DELETE'
    });

    document.getElementById('modal-confirm').close();
    document.getElementById('modal-delete-success').showModal();

    loadContacts();
};

// 🔹 INICIO
loadContacts();
``
