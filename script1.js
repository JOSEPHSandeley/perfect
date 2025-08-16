// Stockage des données du formulaire
document.getElementById('monFormulaire').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupération des données
    const formData = new FormData(this);
    const donnees = {};
    
    for (let [key, value] of formData.entries()) {
        donnees[key] = value;
    }
    
    // Stockage en mémoire
    window.donneesStockees = donnees;
    
    // Ou stockage en JSON
    const donneesJSON = JSON.stringify(donnees);
    
    // Ou ajout dans un tableau
    if (!window.listeDonnees) window.listeDonnees = [];
    window.listeDonnees.push(donnees);
});
// Alternative plus courte
document.getElementById('monFormulaire').onsubmit = function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    window.donneesForm = data;
};
// Récupération individuelle des champs
const nom = document.getElementById('nom').value;
const email = document.getElementById('email').value;
const donnees = { nom: nom, email: email };
function rechercher() {
  const recherche = document.getElementById("searchInput").value.toLowerCase();
  if (listeElements.includes(recherche)) {
    document.getElementById("resultat").innerText = "Trouvé : " + recherche;
    localStorage.setItem("derniereRecherche", recherche);
  } else {
    document.getElementById("resultat").innerText = "Élément non trouvé.";
  }
}
