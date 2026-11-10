const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const programInput = document.getElementById("program");
const studentTableBody = document.getElementById("studentTableBody");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const messageDiv = document.getElementById("message");

let students = JSON.parse(localStorage.getItem("students")) || [
    { id: 1, name: "Anna", email: "ana@gmail.com", program: "BSIT" },
    { id: 2, name: "Almeya", email: "alm@yahoo.com", program: "BSIS" },
    { id: 3, name: "ian", email: "ian@gmail.com", program: "BSIS" }
];
let editingId = null;

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function showMessage(text, isError = false) {
    messageDiv.textContent = text;
    messageDiv.style.color = isError ? "#dc3545" : "#2e7d32";
    setTimeout(() => {
        messageDiv.textContent = "";
    }, 3000);
}

function renderTable() {
    studentTableBody.innerHTML = "";
    students.forEach(student => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.program}</td>
            <td>
                <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });
}

studentForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const program = programInput.value;

    if (!name || !email || !program) return;

    if (editingId !== null) {
        students = students.map(s => s.id === editingId ? { ...s, name, email, program } : s);
        showMessage("Student updated successfully.");
        resetForm();
    } else {
        const newStudent = {
            id: Date.now(),
            name,
            email,
            program
        };
        students.push(newStudent);
        showMessage("Student added successfully.");
        studentForm.reset();
    }

    saveStudents();
    renderTable();
});

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    nameInput.value = student.name;
    emailInput.value = student.email;
    programInput.value = student.program;

    editingId = id;
    submitBtn.textContent = "Update Student";
    cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderTable();
        showMessage("Student deleted successfully.");
    }
}


function resetForm() {
    studentForm.reset();
    editingId = null;
    submitBtn.textContent = "Add Student";
    cancelBtn.classList.add("hidden");
}

renderTable();

