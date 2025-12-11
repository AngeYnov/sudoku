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

//Nouvelle grille
function nouvelleGrille(grille, row, col, num) {
    for (let x = 0; x < 9; x++) if (grille[row][x] === num) return false;
    for (let x = 0; x < 9; x++) if (grille[x][col] === num) return false;
    const startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (grille[i + startRow][j + startCol] === num) return false;
    return true;
}
function genererNouvelleGrille() {
    let grille = Array.from({ length: 9 }, () => Array(9).fill(0));
    function remplir(g) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (g[i][j] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (nouvelleGrille(g, i, j, num)) {
                            g[i][j] = num;
                            if (remplir(g)) return true;
                            g[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    remplir(grille);

    const minTrous = 30; 
    const maxTrous = 50; 
    let trous = Math.floor(Math.random() * (maxTrous - minTrous + 1)) + minTrous;
    while (trous > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (grille[row][col] !== 0) {
            grille[row][col] = 0; 
            trous--; 
        }
    }
    return grille;
}

//Afficher grille
function afficherGrille(grille){
    const conteneur = document.getElementById("sudoku-grid")
    conteneur.innerHTML = ""
    for (let i = 0; i <9; i++) {
        for (let j = 0; j < 9; j++) {
            const valeur = grille[i][j];
            const caseInput = document.createElement("input")
            caseInput.addEventListener("input", function() {
                if (this.value.length > 1) {
                    this.value = this.value.slice(-1)
                }
                if (this.value === "0") {
                    this.value = "";
                }
                this.value = this.value.replace(/[^1-9]/g, "");
            })
            caseInput.className = "case"
            if (valeur === 0) {
                caseInput.value = ""
            } else { 
                caseInput.value = valeur;
                caseInput.disabled = true;
                caseInput.classList.add("pre-rempli")
            }
            conteneur.appendChild(caseInput);
        }
    }
}
afficherGrille(grilleInitiale);

//Bouton nouvelle partie
document.getElementById("btn-reset").addEventListener("click", function() {
    grilleInitiale = genererNouvelleGrille(); 
    afficherGrille(grilleInitiale);
    const messageZone = document.getElementById("message-feedback");
    messageZone.innerText = "";        
    messageZone.className = "";            
    messageZone.style.opacity = "0";      
});

//Récupérer la grille
function recupererGrille() {
    let tableauduJeu = [];
    const inputs = document.querySelectorAll(".case");
    for (let i = 0; i < 9; i++) {
        let ligne = [];        
        for (let j = 0; j < 9; j++) {
            const index = (i * 9) + j;
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

//Placement valide
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

//Vérifier ligne
function verifierLigne(grille, indexLigne) {
    const ligne = grille[indexLigne];
    if (ligne.includes(0)) {
        return false;
    }
    const valeursUniques = new Set(ligne);
    if (valeursUniques.size !== 9) {
        return false;
    }
    return true;
}

//Vérifier colonne
function verifierColonne(grille, indexCol) {
    let valeursDeLaColonne = [];
    for (let i = 0; i < 9; i++) {
        valeursDeLaColonne.push(grille[i][indexCol]);
    }
    if (valeursDeLaColonne.includes(0)) {
        return false;
    }
    const unique = new Set(valeursDeLaColonne);
    if (unique.size !== 9) {
        return false;
    }
    return true;
}

//Vérifier région
function verifierRegion(grille, lStart, cStart) {
    let valeursRegion = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const valeur = grille[lStart + i][cStart + j];
            valeursRegion.push(valeur);
        }
    }
    if (valeursRegion.includes(0)) {
        return false;
    }
    const unique = new Set(valeursRegion);
    if (unique.size !== 9) {
        return false;
    }
    return true;
}

//Vérifier grille complète
function verifierGrilleComplete(grille) {
    for (let i = 0; i < 9; i++) {
        if (verifierLigne(grille, i) === false) {
            console.log("Erreur sur la ligne " + i);
            return false;
        }
    }
    for (let j = 0; j < 9; j++) {
        if (verifierColonne(grille, j) === false) {
            console.log("Erreur sur la colonne " + j);
            return false;
        }
    }
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            if (verifierRegion(grille, i, j) === false) {
                console.log("Erreur sur la région qui commence en " + i + "," + j);
                return false;
            }
        }
    }
    return true;
}

//Résoudre grille
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

//Bouton vérifier
const boutonVerifier = document.getElementById("btn-verifier");
const messageZone = document.getElementById("message-feedback");

boutonVerifier.addEventListener("click", function() {
    const grilleJoueur = recupererGrille();
    const estValide = verifierGrilleComplete(grilleJoueur);
    if(estValide) {
        messageZone.innerText = "BRAVO ! Tu as gagné !";
        messageZone.classList.add("succes");
        messageZone.classList.remove("erreur");
    } else {
        messageZone.innerText = "Il y a des erreurs";
        messageZone.classList.add("erreur");
        messageZone.classList.remove("succes");
    }
    messageZone.classList.add("message-visible");
    setTimeout(() => messageZone.classList.remove("message-visible"), 4000);
})

//Bouton Résoudre
document.getElementById("btn-solve").addEventListener("click", function() {
    if (confirm("Veux-tu voir la solution ?")) {
        let grilleSolution = JSON.parse(JSON.stringify(grilleInitiale));
        resoudreGrille(grilleSolution);
        afficherGrille(grilleSolution);
        const messageZone = document.getElementById("message-feedback");
        messageZone.innerText = "Voici la solution !";
        messageZone.className = "succes";
        messageZone.classList.add("message-visible");
    }
});

//Sakura
function creerSakura() {
    const sakura = document.createElement("div");
    sakura.classList.add("sakura");
    sakura.style.left = Math.random() * 100 + "vw";
    const taille = Math.random() * 20 + 20; 
    sakura.style.width = taille + "px";
    sakura.style.height = taille + "px";
    sakura.style.animationDuration = Math.random() * 5 + 3 + "s";
    document.body.appendChild(sakura);
    setTimeout(() => {
        sakura.remove();
    }, 8000); 
}
setInterval(creerSakura, 300);