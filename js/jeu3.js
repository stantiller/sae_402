// Fichier JavaScript pour le jeu 3

// variables de la taille de l'écran et de la hauteur de l'écran
var taille = window.innerWidth;
var hauteur = window.innerHeight;

// selection des canvas
const colission = document.getElementById("colission");
const background = document.getElementById("background");
const lumiere = document.getElementById("noir");
const player = document.getElementById("player");
const tableau = document.getElementById("tableau");

// ajustement de la taille des canvas
colission.width = taille;
colission.height = hauteur;
background.width = taille;
background.height = hauteur;
player.width = taille;
player.height = hauteur;
lumiere.width = taille;
lumiere.height = hauteur;
tableau.width = taille;
tableau.height = hauteur;

// selection des contextes des canvas
let ctxBackground = background.getContext("2d");
let ctxColission = colission.getContext("2d");
let ctxLumiere = lumiere.getContext("2d");
let ctxPlayer = player.getContext("2d");
let ctxTableau = tableau.getContext("2d");

// variable pour le chrono
let secondes = 0;
let para = document.getElementById("timer");
let chrono = window.setInterval(Timer, 1000);

// variables pour le joueur
let hitbox = 40 / 2;
let infoPlayer = { x: taille / 2, y: hauteur / 2, angle: 0 };
let deplacementX = 0;
let deplacementY = 0;
let posiX = 0;
let posiY = 0;
let differenceXY = 0;
let inventory = [];

// variables pour les tableaux
let TailleTableau = hitbox * 3.6;
let HauteurTableau = hitbox * 3.6;
let Xdepot = taille / 1.6;
let ydepot = hauteur / 1.3;
let XTableau1 = taille / 1.4;
let yTableau1 = hauteur / 2.4;
let XTableau2 = taille / 2.4;
let yTableau2 = hauteur / 6.7;
let XTableau3 = taille / 7.8;
let yTableau3 = hauteur / 2.4;
let XTableau4 = taille / 7.8;
let yTableau4 = hauteur / 1.4;

// variables pour le depot de tableau
let depotTableau = ["blue", "red", "green", "violet"];
let tableau1 = [];
let tableau2 = [];
let tableau3 = [];
let tableau4 = [];

// constantes pour appeler les images
const backgroundImage = new Image();
backgroundImage.src = "../img/game3/background.jpg";
const colissionImage = new Image();
colissionImage.src = "../img/game3/collision.jpg";
const tableauxImage = new Image();
tableauxImage.src = "../img/game3/tableaux.png";
const sprite = new Image();
sprite.src = "../img/game3/spirte/sprite.png";


// fonction pour le chrono
function Timer() {
  secondes++;
  para.innerHTML = secondes;
  if (secondes == 1000) {
    // arrête l'exécution lancée par setInterval()
    window.clearTimeout(chrono);
  }
}

// fonction pour le controleur de mouvement pour le joueur
function playerControl(event) {
  posiX = event.pageX || event.changedTouches[0].pageX;
  posiY = event.pageY || event.changedTouches[0].pageY;

  let dx = posiX - infoPlayer.x;
  let dy = posiY - infoPlayer.y;
  infoPlayer.angle = Math.atan2(dy, dx);

  if (event.type === "mouseup" || event.type === "touchend") {
    deplacementX = 0;
    deplacementY = 0;
  } else {
    deplacementX = 0.4 * Math.cos(infoPlayer.angle);
    deplacementY = 0.4 * Math.sin(infoPlayer.angle);
  }
}

console.log(inventory);
console.log(depotTableau);

// fonction pour le fonctionement des tableaux et du depot de tableau
function fonctionementTableau() {
  // depot tableau fonctionement
  if (
    infoPlayer.x > Xdepot - hitbox &&
    infoPlayer.x < Xdepot + hitbox * 3.3 &&
    infoPlayer.y > ydepot - hitbox &&
    infoPlayer.y < ydepot + hitbox * 3.3
  ) {
    if (depotTableau.length > 0) {
      if (inventory.length === 0) {
        const CouleurTableau = depotTableau.shift();
        inventory.push(CouleurTableau);

        const afficherTableau = document.querySelector(`.tableau${CouleurTableau}`);
        if (afficherTableau) {
          afficherTableau.classList.toggle(`tableau${CouleurTableau}`); 

          setTimeout(() => {
            afficherTableau.classList.add(`tableau${CouleurTableau}`);
          }, 2500);
        }
        console.log(inventory);
        console.log(depotTableau);
      }
    }
  }

  // tableau 1 fonctionement
  if (
    infoPlayer.x > XTableau1 &&
    infoPlayer.x < XTableau1 + TailleTableau &&
    infoPlayer.y > yTableau1 &&
    infoPlayer.y < yTableau1 + HauteurTableau
  ) {
    if (inventory.length === 1) {
      if (tableau1.length === 0) {
        if (inventory[0] === "blue") {
          tableau1.push(inventory.shift());
          console.log(inventory);
          console.log(tableau1);
          alert("tableau bleu déposé !");
        } else {
          depotTableau.push(inventory.shift());
          console.log(inventory);
          console.log(depotTableau);
        }
      }
    }
  }
  // Tableau 2 fonctionnement
  if (
    infoPlayer.x > XTableau2 &&
    infoPlayer.x < XTableau2 + TailleTableau &&
    infoPlayer.y > yTableau2 &&
    infoPlayer.y < yTableau2 + HauteurTableau
  ) {
    if (inventory.length === 1) {
      if (tableau2.length === 0) {
        if (inventory[0] === "red") {
          tableau2.push(inventory.shift());
          console.log("Inventory:", inventory);
          console.log("Tableau 2:", tableau2);
          alert("Tableau rouge déposé !");
        } else {
          depotTableau.push(inventory.shift());
          console.log(inventory);
          console.log(depotTableau);
        }
      }
    }
  }

  // Tableau 3 fonctionnement
  if (
    infoPlayer.x > XTableau3 &&
    infoPlayer.x < XTableau3 + TailleTableau &&
    infoPlayer.y > yTableau3 &&
    infoPlayer.y < yTableau3 + HauteurTableau
  ) {
    if (inventory.length === 1) {
      if (tableau3.length === 0) {
        if (inventory[0] === "green") {
          tableau3.push(inventory.shift());
          console.log("Inventory:", inventory);
          console.log("Tableau 3:", tableau3);
          alert("Tableau vert déposé !");
        } else {
          depotTableau.push(inventory.shift());
          console.log(inventory);
          console.log(depotTableau);
        }
      }
    }
  }

  // Tableau 4 fonctionnement
  if (
    infoPlayer.x > XTableau4 &&
    infoPlayer.x < XTableau4 + TailleTableau &&
    infoPlayer.y > yTableau4 &&
    infoPlayer.y < yTableau4 + HauteurTableau
  ) {
    if (inventory.length === 1) {
      if (tableau4.length === 0) {
        if (inventory[0] === "violet") {
          tableau4.push(inventory.shift());
          console.log("Inventory:", inventory);
          console.log("Tableau 4:", tableau4);
          alert("Tableau violet déposé !");
        } else {
          depotTableau.push(inventory.shift());
          console.log(inventory);
          console.log(depotTableau);
        }
      }
    }
  }
}

// addEventListener pour le controleur de mouvement pour le mobile et le pc
window.addEventListener("touchstart", playerControl);
window.addEventListener("touchmove", playerControl);
window.addEventListener("touchend", playerControl);
window.addEventListener("mousedown", playerControl);
window.addEventListener("mousemove", playerControl);
window.addEventListener("mouseup", playerControl);

// fonction pour l'affichage du jeu
function afficher() {
  ctxColission.clearRect(0, 0, taille, hauteur);
  ctxBackground.clearRect(0, 0, taille, hauteur);
  ctxPlayer.clearRect(0, 0, taille, hauteur);
  ctxTableau.clearRect(0, 0, taille, hauteur);

  // affichage du modele de collision du jeu
  ctxColission.drawImage(colissionImage, 0, 0, taille, hauteur);
  const nextX = infoPlayer.x + deplacementX;
  const nextY = infoPlayer.y + deplacementY;

  const pixelX = ctxColission.getImageData(nextX, infoPlayer.y, 1, 1).data;
  const isBlackX =
    pixelX[0] === 0 && pixelX[1] === 0 && pixelX[2] === 0 && pixelX[3] === 255;

  const pixelY = ctxColission.getImageData(infoPlayer.x, nextY, 1, 1).data;
  const isBlackY =
    pixelY[0] === 0 && pixelY[1] === 0 && pixelY[2] === 0 && pixelY[3] === 255;

  // Empêcher le déplacement dans les zones noires
  if (!isBlackX && nextX > 0 && nextX < taille) {
    infoPlayer.x = nextX;
  }

  if (!isBlackY && nextY > 0 && nextY < hauteur) {
    infoPlayer.y = nextY;
  } else {
    deplacementX = 0;
    deplacementY = 0;
  }
  // affichage du background du jeu
  ctxBackground.drawImage(backgroundImage, 0, 0, taille, hauteur);

  // affichage du dépôt des tableaux
  ctxTableau.drawImage(
    tableauxImage,
    Xdepot,
    ydepot,
    hitbox * 3.3,
    hitbox * 3.3
  );
  fonctionementTableau();

  // affichage des 4 emplacements de tableaux
  ctxTableau.strokeStyle = "blue";
  ctxTableau.lineWidth = 5;
  ctxTableau.strokeRect(XTableau1, yTableau1, TailleTableau, HauteurTableau);

  ctxTableau.strokeStyle = "red";
  ctxTableau.lineWidth = 5;
  ctxTableau.strokeRect(XTableau2, yTableau2, TailleTableau, HauteurTableau);

  ctxTableau.strokeStyle = "green";
  ctxTableau.lineWidth = 5;
  ctxTableau.strokeRect(XTableau3, yTableau3, TailleTableau, HauteurTableau);

  ctxTableau.strokeStyle = "violet";
  ctxTableau.lineWidth = 5;
  ctxTableau.strokeRect(XTableau4, yTableau4, TailleTableau, HauteurTableau);

  // affichage du fond noir opaque
  ctxLumiere.fillStyle = "black";
  ctxLumiere.fillRect(0, 0, taille, hauteur);

  const angleCorrection = -Math.PI / 2;

  // fonctionement de la lumiere
  ctxLumiere.save();
  ctxLumiere.translate(infoPlayer.x, infoPlayer.y);
  ctxLumiere.rotate(infoPlayer.angle + angleCorrection);
  ctxLumiere.fillStyle = "yellow";
  ctxLumiere.globalCompositeOperation = "destination-out";
  ctxLumiere.beginPath();
  ctxLumiere.moveTo(0, 0);
  ctxLumiere.lineTo(-70, 210);
  ctxLumiere.lineTo(70, 210);
  ctxLumiere.fill();
  ctxLumiere.globalCompositeOperation = "source-over";
  ctxLumiere.restore();

  // affichage du déplacement du player et le player en lui meme
  let dx = posiX - infoPlayer.x;
  let dy = posiY - infoPlayer.y;

  differenceXY = Math.sqrt(dx * dx + dy * dy);

  ctxPlayer.save();
  if (differenceXY < hitbox * 1.5) {
    deplacementX = 0;
    deplacementY = 0;
  } else {
    infoPlayer.x += deplacementX;
    infoPlayer.y += deplacementY;
  }

  ctxPlayer.translate(infoPlayer.x, infoPlayer.y); // Centrer sur la position du joueur // Dessiner le sprite centré
  ctxPlayer.rotate(infoPlayer.angle);
  ctxPlayer.drawImage(sprite, -hitbox, -hitbox, hitbox * 2.3, hitbox * 2.3);
  ctxPlayer.restore();

  window.requestAnimationFrame(afficher);
}

afficher();
