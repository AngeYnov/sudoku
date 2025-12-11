const grilleInitiale = [
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
            console.log("Erreur sur la ligne " + i); // Pour t'aider à débuguer
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

//Bouton Nouvelle Partie (reload la page)
document.getElementById("btn-reset").addEventListener("click", function() {
    location.reload();
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