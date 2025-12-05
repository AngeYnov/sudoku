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

//Bouton vérifier
const boutonVerifier = document.getElementById("btn-verifier");
const messageZone = document.getElementById("message-feedback");

boutonVerifier.addEventListener("click", function() {
    const grilleJoueur = recupererGrille();
    let casesRemplies = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grilleJoueur[i][j] !== 0) {
                casesRemplies++;
            }
        }
    }
    messageZone.innerText = "Lecture réussie ! Tu as rempli " + casesRemplies + " cases sur 81.";
    messageZone.classList.add("message-visible");
    setTimeout(function() {
        messageZone.classList.remove("message-visible");
    }, 4000);
})

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