let modeNotes = false; // Variable interrupteur

// Une grille de base pour commencer
let grilleInitiale = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
]

// --- 1. FONCTIONS DE LOGIQUE (Règles du jeu) ---

// Est-ce que la grille est fonctionnelle ?
function nouvelleGrille(grille, row, col, num) {
    // Je vérifie la ligne et la colonne
    for (let x = 0; x < 9; x++) if (grille[row][x] === num) return false;
    for (let x = 0; x < 9; x++) if (grille[x][col] === num) return false;
    
    // Je vérifie le carré 3x3
    const startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (grille[i + startRow][j + startCol] === num) return false;
            
    return true; // Si tout est bon, je valide
}

// Générateur de grille
function genererNouvelleGrille() {
    let grille = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    function remplir(g) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (g[i][j] === 0) {
                    // On essaie les chiffres 1 à 9 dans le désordre
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (nouvelleGrille(g, i, j, num)) {
                            g[i][j] = num; // On pose le chiffre
                            if (remplir(g)) return true; // On continue...
                            g[i][j] = 0; // Si ça bloque plus loin, on efface et on revient en arrière
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    remplir(grille);

    // On fait des trous
    const minTrous = 30; 
    const maxTrous = 50; 
    let trous = Math.floor(Math.random() * (maxTrous - minTrous + 1)) + minTrous;
    while (trous > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (grille[row][col] !== 0) {
            grille[row][col] = 0; // On vide la case
            trous--; 
        }
    }
    return grille;
}

// --- 2. FONCTIONS D'AFFICHAGE (Dessiner le jeu) ---

function afficherGrille(grille) {
    const conteneur = document.getElementById("sudoku-grid");
    conteneur.innerHTML = "";  // On vide tout avant de redessiner
    
    // On crée les 81 cases
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const valeur = grille[i][j];
            
            // On fabrique les éléments HTML à la main
            const cellule = document.createElement("div"); // La boîte (Cellule)
            cellule.className = "cellule";
            
            const notesDiv = document.createElement("div"); // La zone de notes
            notesDiv.className = "notes";
            cellule.appendChild(notesDiv);
            
            const caseInput = document.createElement("input"); // La zone de saisie
            caseInput.className = "case";
            
            // --- GESTION DU CLAVIER ---
            caseInput.addEventListener("keydown", function(e) {
                const key = e.key;
                
                // Si c'est un chiffre (1-9)
                if (key >= '1' && key <= '9') {
                    e.preventDefault(); // On bloque l'affichage normal pour gérer nous-même
                    
                    if (modeNotes) {
                        // LOGIQUE NOTES : On ajoute ou on enlève le petit chiffre
                        let notesActuelles = notesDiv.innerText.split(" ");
                        notesActuelles = notesActuelles.filter(n => n !== "");
                        
                        if (notesActuelles.includes(key)) {
                            notesActuelles = notesActuelles.filter(n => n !== key);
                        } else {
                            notesActuelles.push(key);
                        }
                        notesDiv.innerText = notesActuelles.sort().join(" ");
                        
                    } else {
                        // LOGIQUE REPONSE : On écrit le gros chiffre
                        this.value = key; 
                    }
                } 
                // Si c'est pour effacer
                else if (key === "Backspace" || key === "Delete") {
                    e.preventDefault(); 
                    if (!modeNotes) {
                        this.value = ""; 
                    }
                }
                // Si c'est une lettre ou un symbole -> ON BLOQUE (Sécurité)
                else if (key.length === 1) {
                    e.preventDefault();
                }
            });
            
            // Si la case fait partie de l'énoncé (non modifiable)
            if (valeur !== 0) {
                caseInput.value = valeur;  
                caseInput.disabled = true;    
                caseInput.classList.add("pre-rempli");
                cellule.classList.add("pre-rempli-box");
            }
            
            // On ajoute tout ça dans la page
            cellule.appendChild(caseInput);
            conteneur.appendChild(cellule);
        }
    }
}

// On lance l'affichage au démarrage
afficherGrille(grilleInitiale);

// --- 3. LES BOUTONS ---

// Nouvelle partie
document.getElementById("btn-reset").addEventListener("click", function() {
    grilleInitiale = genererNouvelleGrille(); 
    afficherGrille(grilleInitiale);
    demarrerChrono(); // On relance le chrono
    
    // On efface le message de victoire/défaite
    const messageZone = document.getElementById("message-feedback");
    messageZone.innerText = "";        
    messageZone.className = "";            
    messageZone.style.opacity = "0";      
});

// Récupère ce que le joueur a écrit dans la grille
function recupererGrille() {
    let tableauduJeu = [];
    const inputs = document.querySelectorAll(".case");
    for (let i = 0; i < 9; i++) {
        let ligne = [];        
        for (let j = 0; j < 9; j++) {
            const index = (i * 9) + j; // Formule pour trouver la bonne case
            const valeurInput = inputs[index].value;
            if (valeurInput === "") {
                ligne.push(0);
            } else {
                ligne.push(parseInt(valeurInput)); 
            }
        }
        tableauduJeu.push(ligne);
    } 
    return tableauduJeu;
}

// --- 4. VERIFICATION DE JEU ---

// (Mêmes règles que "nouvelleGrille" mais pour valider la victoire)
function placementValide(grille, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grille[row][x] === num || grille[x][col] === num) return false;
    }
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grille[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

function verifierLigne(grille, indexLigne) {
    const ligne = grille[indexLigne];
    if (ligne.includes(0)) return false; // S'il reste un 0, c'est pas fini
    const valeursUniques = new Set(ligne); 
    if (valeursUniques.size !== 9) return false; // S'il y a des doublons
    return true;
}

function verifierColonne(grille, indexCol) {
    let valeursDeLaColonne = [];
    for (let i = 0; i < 9; i++) {
        valeursDeLaColonne.push(grille[i][indexCol]);
    }
    if (valeursDeLaColonne.includes(0)) return false;
    const unique = new Set(valeursDeLaColonne);
    if (unique.size !== 9) return false;
    return true;
}

function verifierRegion(grille, lStart, cStart) {
    let valeursRegion = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const valeur = grille[lStart + i][cStart + j];
            valeursRegion.push(valeur);
        }
    }
    if (valeursRegion.includes(0)) return false;
    const unique = new Set(valeursRegion);
    if (unique.size !== 9) return false;
    return true;
}

function verifierGrilleComplete(grille) {
    const inputs = document.querySelectorAll(".case");
    // On enlève le rouge partout avant de vérifier
    inputs.forEach(input => input.parentElement.classList.remove("invalide"));
    
    // On vérifie tout : Lignes, Colonnes, Régions
    for (let i = 0; i < 9; i++) {
        if (verifierLigne(grille, i) === false) {
            surlignerErreur("ligne", i); 
            return false; 
        }
    }
    for (let j = 0; j < 9; j++) {
        if (verifierColonne(grille, j) === false) {
            surlignerErreur("colonne", j);
            return false;
        }
    }
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            if (verifierRegion(grille, i, j) === false) {
                surlignerErreur("region", i, j);
                return false;
            }
        }
    }
    return true;
}

// Résoudre la grille
function resoudreGrille(grille) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grille[i][j] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (placementValide(grille, i, j, num)) {
                        grille[i][j] = num;
                        if (resoudreGrille(grille)) {
                            return true;
                        }
                        grille[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Fonction qui colorie les erreurs en rouge
function surlignerErreur(type, indexA, indexB = 0) {
    const inputs = document.querySelectorAll(".case");
    // Petits calculs pour trouver les bonnes cases à colorier
    if (type === "ligne") {
        for (let i = 0; i < 9; i++) {
            const index = (indexA * 9) + i; 
            inputs[index].parentElement.classList.add("invalide");
        }
    }
    else if (type === "colonne") {
        for (let i = 0; i < 9; i++) {
            const index = indexA + (i * 9);
            inputs[index].parentElement.classList.add("invalide");
        }
    }
    else if (type === "region") {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const index = ((indexA + i) * 9) + (indexB + j);
                inputs[index].parentElement.classList.add("invalide");
            }
        }
    }
}

// Bouton Vérifier
const boutonVerifier = document.getElementById("btn-verifier");
const messageZone = document.getElementById("message-feedback");

boutonVerifier.addEventListener("click", function() {
    const grilleJoueur = recupererGrille();
    const estValide = verifierGrilleComplete(grilleJoueur);
    if(estValide) {
        messageZone.innerText = "BRAVO ! Tu as gagné !";
        messageZone.classList.add("succes");
        messageZone.classList.remove("erreur");
        arreterChrono(); // On arrête le temps
    } else {
        messageZone.innerText = "Il y a des erreurs";
        messageZone.classList.add("erreur");
        messageZone.classList.remove("succes");
    }
    messageZone.classList.add("message-visible");
    setTimeout(() => messageZone.classList.remove("message-visible"), 4000);
})

// Bouton Résoudre
document.getElementById("btn-solve").addEventListener("click", function() {
    if (confirm("Veux-tu voir la solution ?")) {
        // On fait une copie de la grille pour ne pas casser l'originale
        let grilleSolution = JSON.parse(JSON.stringify(grilleInitiale));
        resoudreGrille(grilleSolution); // Fonction pour résoudre
        afficherGrille(grilleSolution); // On affiche le résultat
        
        const messageZone = document.getElementById("message-feedback");
        messageZone.innerText = "Voici la solution !";
        messageZone.className = "succes";
        messageZone.classList.add("message-visible");
    }
});

// Bouton pour changer de Mode (Notes / Réponse)
const btnMode = document.getElementById("btn-mode");
btnMode.addEventListener("click", function() {
    modeNotes = !modeNotes; // On inverse l'interrupteur
    if (modeNotes) {
        btnMode.innerText = "Mode: 📝 Notes";
        btnMode.style.backgroundColor = "#e1f5fe";
    } else {
        btnMode.innerText = "Mode: 🖊️ Réponse";
        btnMode.style.backgroundColor = "";
    }
});

// Raccourci Clavier : Touche TAB pour changer de mode
document.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
        e.preventDefault(); 
        btnMode.click(); 
    }
});

// --- 5. LE CHRONOMÈTRE ---

let tempsSecondes = 0;
let chronoProcess = null;

function demarrerChrono() {
    if (chronoProcess) {
        clearInterval(chronoProcess); // On tue l'ancien chrono s'il existe
    }
    tempsSecondes = 0;
    mettreAJourAffichage();
    // On lance une boucle qui s'exécute toutes les 1000ms (1 seconde)
    chronoProcess = setInterval(function() {
        tempsSecondes++;
        mettreAJourAffichage();
    }, 1000);
}

function arreterChrono() {
    if (chronoProcess) {
        clearInterval(chronoProcess); // On stoppe la boucle
        chronoProcess = null;
    }
}

function mettreAJourAffichage() {
    // Calcul des minutes et secondes
    const minutes = Math.floor(tempsSecondes / 60);
    const secondes = tempsSecondes % 60;
    // On rajoute un "0" devant si c'est < 10
    const affichageMin = minutes.toString().padStart(2, '0');
    const affichageSec = secondes.toString().padStart(2, '0');
    document.getElementById("chrono").innerText = `${affichageMin}:${affichageSec}`;
}

demarrerChrono(); // On lance direct au chargement

// --- 6. EFFETS Sakura ---
function creerSakura() {
    const sakura = document.createElement("div");
    sakura.classList.add("sakura");
    // Position aléatoire sur l'écran
    sakura.style.left = Math.random() * 100 + "vw";
    
    // Taille aléatoire
    const taille = Math.random() * 20 + 20; 
    sakura.style.width = taille + "px";
    sakura.style.height = taille + "px";
    
    // Vitesse de chute aléatoire
    sakura.style.animationDuration = Math.random() * 5 + 3 + "s";
    
    document.body.appendChild(sakura);
    
    // On détruit le pétale après 8 secondes pour ne pas faire laguer le PC
    setTimeout(() => {
        sakura.remove();
    }, 8000); 
}
// On crée un nouveau pétale tous les 0.3 secondes
setInterval(creerSakura, 300);