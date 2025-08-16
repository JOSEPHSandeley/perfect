// Variables globales pour stocker les données
let students = [];
let grades = {};
let isLoggedIn = false;

// Fonction de connexion
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const alertDiv = document.getElementById('loginAlert');

    if (username === 'Univers' && password === '20252024') {
        isLoggedIn = true;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('loggedInHeader').style.display = 'block';
        showPage('inscriptions');
        alertDiv.innerHTML = '<div class="alert alert-success">Connexion réussie!</div>';
        setTimeout(() => alertDiv.innerHTML = '', 3000);
    } else {
        alertDiv.innerHTML = '<div class="alert alert-error">Nom d\'utilisateur ou mot de passe incorrect!</div>';
    }
}

// Fonction de déconnexion
function logout() {
    isLoggedIn = false;
    document.getElementById('loggedInHeader').style.display = 'none';
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Fonction pour afficher une page
function showPage(pageId) {
    if (!isLoggedIn) return;
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId + 'Page').classList.add('active');
    
    if (pageId === 'performances') {
        updateStudentSelect();
        displayPerformances();
    } else if (pageId === 'inscriptions') {
        displayStudents();
        updateStats();
    }
}
// Fonction pour ajouter un élève
function addStudent(event) {
    event.preventDefault();
    const alertDiv = document.getElementById('inscriptionAlert');
  
    
    // Vérifications des champs obligatoires
    const name = document.getElementById('studentName').value.trim();
    const age = document.getElementById('studentAge').value;
    const studentClass = document.getElementById('studentClass').value;
    const parentName = document.getElementById('parentName').value.trim();
    const parentPhone = document.getElementById('parentPhone').value.trim();
    
    
    // Validation des données
    if (!name || !age || !studentClass || !parentName || !parentPhone) {
        alertDiv.innerHTML = '<div class="alert alert-error">Veuillez remplir tous les champs obligatoires!</div>';
        setTimeout(() => alertDiv.innerHTML = '', 3000);
        return;
    }
    
    // Vérifier si l'élève existe déjà
    const existingStudent = students.find(s => 
        s.name.toLowerCase() === name.toLowerCase() && s.class === studentClass
    );
    
    if (existingStudent) {
        alertDiv.innerHTML = '<div class="alert alert-error">Cet élève est déjà inscrit dans cette classe!</div>';
        setTimeout(() => alertDiv.innerHTML = '', 3000);
        return;
    }
    
    const student = {
        id: Date.now(),
        name: name,
        age: parseInt(age),
        class: studentClass,
        parentName: parentName,
        parentPhone: parentPhone,
        enrollmentDate: new Date().toLocaleDateString('fr-FR')
    };

    students.push(student);
    grades[student.id] = [];

    // Réinitialiser le formulaire
    event.target.reset();
    
    alertDiv.innerHTML = '<div class="alert alert-success">Élève inscrit avec succès!</div>';
    setTimeout(() => alertDiv.innerHTML = '', 5000);
    
    displayStudents();
    updateStats();
}

// Fonction pour afficher la liste des élèves
function displayStudents() {
    const container = document.getElementById('studentsList');
    
    if (!container) {
        console.error('Élément studentsList introuvable');
        return;
    }
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic; padding: 20px;">Aucun élève inscrit pour le moment.</p>';
        return;
    }

    const studentsHtml = students.map(student => `
        <div class="student-card">
            <div class="student-name">${escapeHtml(student.name)}</div>
            <p><strong>Âge:</strong> ${student.age} ans</p>
            <p><strong>Classe:</strong> ${escapeHtml(student.class)}</p>
            <p><strong>Parent/Tuteur:</strong> ${escapeHtml(student.parentName)}</p>
            <p><strong>Téléphone:</strong> ${escapeHtml(student.parentPhone)}</p>
            <p><strong>Date d'inscription:</strong> ${student.enrollmentDate}</p>
            <button class="btn" style="background: #e53e3e; font-size: 12px; padding: 5px 10px; margin-top: 10px;" 
                    onclick="removeStudent(${student.id})">
                🗑 Supprimer
            </button>
        </div>
    `).join('');

    container.innerHTML = studentsHtml;
}

// Fonction pour supprimer un élève
function removeStudent(studentId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
        students = students.filter(student => student.id !== studentId);
        delete grades[studentId];
        
        displayStudents();
        updateStats();
        updateStudentSelect();
        
        const alertDiv = document.getElementById('inscriptionAlert');
        alertDiv.innerHTML = '<div class="alert alert-success">Élève supprimé avec succès!</div>';
        setTimeout(() => alertDiv.innerHTML = '', 3000);
    }
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const totalStudentsElement = document.getElementById('totalStudents');
    const totalClassesElement = document.getElementById('totalClasses');
    
    if (totalStudentsElement) {
        totalStudentsElement.textContent = students.length;
    }
    
    if (totalClassesElement) {
        const uniqueClasses = [...new Set(students.map(s => s.class).filter(c => c))];
        totalClassesElement.textContent = uniqueClasses.length;
    }
}

// Fonction pour mettre à jour la liste des élèves dans le sélecteur
function updateStudentSelect() {
    const select = document.getElementById('gradeStudent');
    
    if (!select) {
        console.error('Élément gradeStudent introuvable');
        return;
    }
    
   select.innerHTML = '<option value="">Choisir un élève</option>';

students.forEach(student => {
    const option = document.createElement('option');
    option.value = escapeHtml(student.id);
    option.textContent = `${escapeHtml(student.name)} (${escapeHtml(student.class)})`;
    select.appendChild(option);
});

// Fonction utilitaire pour échapper le HTML (sécurité)
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
}
// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonction pour ajouter une note
function addGrade(event) {
    event.preventDefault();
    const alertDiv = document.getElementById('performanceAlert');

    const studentId = document.getElementById('gradeStudent').value;
    const subject = document.getElementById('subject').value.trim();
    const gradeValue = document.getElementById('grade').value;
    const grade = parseFloat(gradeValue);
    const comment = document.getElementById('comment').value.trim();

    if (!studentId) {
        alertDiv.innerHTML = '<div class="alert alert-error">Veuillez sélectionner un élève !</div>';
        return;
    }

    if (isNaN(grade) || grade < 0 || grade > 20) {
        alertDiv.innerHTML = '<div class="alert alert-error">Veuillez entrer une note valide entre 0 et 20.</div>';
        return;
    }

    if (!grades[studentId]) {
        grades[studentId] = []; // Initialiser le tableau si inexistant
    }

    const gradeEntry = {
        subject: escapeHtml(subject),
        grade: grade,
        comment: escapeHtml(comment),
        date: new Date().toLocaleDateString('fr-FR')
    };

    grades[studentId].push(gradeEntry);

    // Réinitialiser le formulaire
    event.target.reset();

    alertDiv.innerHTML = '<div class="alert alert-success">Note ajoutée avec succès !</div>';
    setTimeout(() => alertDiv.innerHTML = '', 3000);

    displayPerformances();
}

// Fonction pour afficher les performances
function displayPerformances() {
    const container = document.getElementById('performancesList');

    if (!students || students.length === 0) {
        container.innerHTML = '<p>Aucun élève inscrit pour afficher les performances.</p>';
        return;
    }

    const performancesHtml = students.map(student => {
        const studentGrades = grades[student.id] || [];
        const avgGrade = studentGrades.length > 0
            ? (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length).toFixed(1)
            : 'N/A';

        const subjectGrades = {};
        studentGrades.forEach(g => {
            if (!subjectGrades[g.subject]) subjectGrades[g.subject] = [];
            subjectGrades[g.subject].push(g);
        });

        const subjectsHtml = Object.entries(subjectGrades).map(([subject, gradeList]) => {
            const subjectAvg = (gradeList.reduce((sum, g) => sum + g.grade, 0) / gradeList.length).toFixed(1);
            const percentage = (subjectAvg / 20) * 100;

            return `
                <div style="margin: 10px 0;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>${escapeHtml(subject)}</span>
                        <span class="grade">${subjectAvg}/20</span>
                    </div>
                    <div class="performance-bar">
                        <div class="performance-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="student-card">
                <div class="student-name">${escapeHtml(student.name)} (${escapeHtml(student.class)})</div>
                <p><strong>Moyenne générale:</strong> <span class="grade">${avgGrade}/20</span></p>
                <p><strong>Nombre de notes:</strong> ${studentGrades.length}</p>
                ${subjectsHtml}
                ${studentGrades.length === 0 ? '<p style="color: #666; font-style: italic;">Aucune note enregistrée</p>' : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = performancesHtml;
}
// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Données d'exemple pour la démonstration
    const exampleStudents = [
        {
            id: 1,
            name: "Saint-Jean Etienne",
            age: 24,
            class: "Nouveau secondaire III",
            parentName: "Mike Saint-Jean",
            parentPhone: "3292-7722",
            enrollmentDate: "16/08/2025"
        },
        {
            id: 2,
            name: "Joseph Sandeley",
            age: 21,
            class: "Nouveau Secondaire II",
            parentName: "Jesulene PIERRE",
            parentPhone: "4045-2923",
            enrollmentDate: "16/08/2025"
        
        }
    ];

    // Ajouter les données d'exemple
    students = [...exampleStudents];
    grades = {
        1: [
            { subject: "Mathématiques", grade: 15.5, comment: "Très bon travail", date: "05/08/2025" },
            { subject: "Français", grade: 13, comment: "Peut mieux faire", date: "06/08/2025" },
            { subject: "Sciences", grade: 16, comment: "Excellent!", date: "07/08/2025" }
        ],
        2: [
            { subject: "Mathématiques", grade: 12, comment: "Travail correct", date: "05/08/2025" },
            { subject: "Histoire-Géographie", grade: 17, comment: "Très bien", date: "08/08/2025" }
        ]
    };
});


window.addEventListener ('load', function (){
    document.getElementById('LOGO.png').classList.add('animate');
});



window.addEventListener('load',function (){
    document.getElementById('LOGO.png').classList.add('animate');
});
function toggleTheme() {
    let currentTheme = document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        document.getElementById("themeIcon").textContent = "🌙";
        document.getElementById("themeText").textContent = "Mode sombre";
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        document.getElementById("themeIcon").textContent = "🌞";
        document.getElementById("themeText").textContent = "Mode clair";
    }
}

// Charger le thème sauvegardé
(function () {
    let savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (savedTheme === "dark") {
        document.getElementById("themeIcon").textContent = "🌞";
        document.getElementById("themeText").textContent = "";
    } else {
        document.getElementById("themeIcon").textContent = "🌙";
        document.getElementById("themeText").textContent = "";
    }
})();
