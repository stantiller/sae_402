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

// Indique si le jeu est terminé
let isGameOver = false;
let isGameActive = false;

// vérification de la position
var id, target, options;
var map = 0;
let routingControl = null;

function success(pos) {
  var crd = pos.coords;

  if (
    L.latLng(crd.latitude, crd.longitude).distanceTo(
      L.latLng(target.latitude, target.longitude)
    ) <= 10
  ) {
    console.log("Bravo, vous avez atteint la cible");
    navigator.geolocation.clearWatch(id);
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
    if (map !== 0) map.remove();
    document.querySelector(".mapContain").remove();
    document.querySelector("#start").classList.remove("invisible");
  } else {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
    if (map !== 0) map.remove();

    map = L.map("map").setView([crd.latitude, crd.longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(crd.latitude, crd.longitude),
        L.latLng(target.latitude, target.longitude),
      ],
      show: false, // hides the directions panel
      addWaypoints: false, // disables adding waypoints by clicking
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      routeWhileDragging: false,
      showAlternatives: false,
    }).addTo(map);
  }
}

function error(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}

target = {
  latitude: 47.7457448375294,
  longitude: 7.338409953170661,
};

options = {
  enableHighAccuracy: false,
  timeout: 1000,
  maximumAge: 0,
};

id = navigator.geolocation.watchPosition(success, error, options);

// fonction pour lancer le jeu
function startGame() {
  document.querySelector(".start").addEventListener("click", function () {
    document.querySelector("#start").classList.add("invisible");
    document.querySelector(".game").classList.remove("invisible");
    orientationLock();
    afficher();
    chrono = window.setInterval(Timer, 1000);
    isGameActive = true;
  });
}

function orientationLock() {
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen().then(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("portrait").catch((error) => {
          console.error("Orientation lock failed: ", error);
        });
      }
    });
  }
}

window.addEventListener("pageshow", orientationLock);

orientationLock();

let isPaused = false;

// selection des contextes des canvas
let ctxBackground = background.getContext("2d");
let ctxColission = colission.getContext("2d");
let ctxLumiere = lumiere.getContext("2d");
let ctxPlayer = player.getContext("2d");
let ctxTableau = tableau.getContext("2d");

// variable pour le chrono
let chrono = 0;
let secondes = 0;
let para = document.getElementById("timer");

// variable pour la vitesse qui se met corrzectement en fonction des hz
let time0 = performance.now();
let timeNow = 0;
let sec = 0;
let timeDefinition = 0;
let playerSpeedx = 0;
let playerSpeedy = 0;

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

// constantes pour les sons
const sonColission = new Audio("../sounds/game3/colission.mp3");
const sonTableaublue = new Audio("../sounds/game3/tableau1.mp3");
const sonTableaured = new Audio("../sounds/game3/tableau2.mp3");
const sonTableaugreen = new Audio("../sounds/game3/tableau3.mp3");
const sonTableauviolet = new Audio("../sounds/game3/tableau4.mp3");
const sonDepot = new Audio("../sounds/game3/depot.mp3");
const sonPas = new Audio("../sounds/game3/pas.mp3");
const winSound = new Audio("../sounds/global/win.mp3");
const WrongSon = new Audio("../sounds/game3/wrong.mp3");
const rightSon = new Audio("../sounds/game3/right.mp3");
const sonTableau = new Audio("../sounds/game3/artpiece.mp3");

// constantes pour appeler les images
const backgroundImage = new Image();
backgroundImage.src = "../img/game3/background.jpg";
const colissionImage = new Image();
colissionImage.src = "../img/game3/collision.jpg";
const tableauxImage = new Image();
tableauxImage.src = "../img/game3/tableaux.png";
const sprite = new Image();
sprite.src = "../img/game3/spirte/sprite.png";

// fonction pour jouer les sons
function SoundPlay(sound) {
  sound.play();
}

// fonction pour jouer le son du dépôt
function DepotSon() {
  if (isGameOver || inventory.length === 1) {
    return;
  }

  const tailleDepot = hitbox * 3.3;
  const hauteurDepot = hitbox * 3.3;

  const depotCentreX = Xdepot + tailleDepot / 2;
  const depotCentreY = ydepot + hauteurDepot / 2;

  const dx = depotCentreX - infoPlayer.x;
  const dy = depotCentreY - infoPlayer.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance =
    Math.sqrt(tailleDepot * tailleDepot + hauteurDepot * hauteurDepot) / 2;

  const angleDepot = Math.atan2(dy, dx);
  const angleDifference = Math.abs(infoPlayer.angle - angleDepot);

  if (angleDifference < 0.2) {
    const frequence = Math.max(10, distance / maxDistance);

    if (!sonDepot.isPlaying) {
      sonDepot.isPlaying = true;
      sonDepot.play();
      setTimeout(() => {
        sonDepot.isPlaying = false;
      }, frequence);
    }
  }
}

function SonTableau1() {
  if (isGameOver || inventory.length === 0 || inventory[0] !== "blue") {
    return;
  }

  const centreX = XTableau1 + TailleTableau / 2;
  const centreY = yTableau1 + HauteurTableau / 2;

  const dx = centreX - infoPlayer.x;
  const dy = centreY - infoPlayer.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance =
    Math.sqrt(TailleTableau * TailleTableau + HauteurTableau * HauteurTableau) /
    2;

  const angleDepot = Math.atan2(dy, dx);
  const angleDifference = Math.abs(infoPlayer.angle - angleDepot);

  if (angleDifference < 0.2) {
    const frequence = Math.max(100, 1000 - (distance / maxDistance) * 1900);

    if (!sonTableaublue.isPlaying) {
      sonTableaublue.isPlaying = true;
      sonTableaublue.play();
      setTimeout(() => {
        sonTableaublue.isPlaying = false;
      }, frequence);
    }
  }
}

function SonTableau2() {
  if (isGameOver || inventory.length === 0 || inventory[0] !== "red") {
    return;
  }

  const centreX = XTableau2 + TailleTableau / 2;
  const centreY = yTableau2 + HauteurTableau / 2;

  const dx = centreX - infoPlayer.x;
  const dy = centreY - infoPlayer.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance =
    Math.sqrt(TailleTableau * TailleTableau + HauteurTableau * HauteurTableau) /
    2;

  const angleDepot = Math.atan2(dy, dx);
  const angleDifference = Math.abs(infoPlayer.angle - angleDepot);

  if (angleDifference < 0.2) {
    const frequence = Math.max(100, 1000 - (distance / maxDistance) * 1900);

    if (!sonTableaured.isPlaying) {
      sonTableaured.isPlaying = true;
      sonTableaured.play();
      setTimeout(() => {
        sonTableaured.isPlaying = false;
      }, frequence);
    }
  }
}

function SonTableau3() {
  if (isGameOver || inventory.length === 0 || inventory[0] !== "green") {
    return;
  }

  const centreX = XTableau3 + TailleTableau / 2;
  const centreY = yTableau3 + HauteurTableau / 2;

  const dx = centreX - infoPlayer.x;
  const dy = centreY - infoPlayer.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance =
    Math.sqrt(TailleTableau * TailleTableau + HauteurTableau * HauteurTableau) /
    2;

  const angleDepot = Math.atan2(dy, dx);
  const angleDifference = Math.abs(infoPlayer.angle - angleDepot);

  if (angleDifference < 0.2) {
    const frequence = Math.max(100, 1000 - (distance / maxDistance) * 1900);

    if (!sonTableaugreen.isPlaying) {
      sonTableaugreen.isPlaying = true;
      sonTableaugreen.play();
      setTimeout(() => {
        sonTableaugreen.isPlaying = false;
      }, frequence);
    }
  }
}

function SonTableau4() {
  if (isGameOver || inventory.length === 0 || inventory[0] !== "violet") {
    return;
  }

  const centreX = XTableau4 + TailleTableau / 2;
  const centreY = yTableau4 + HauteurTableau / 2;

  const dx = centreX - infoPlayer.x;
  const dy = centreY - infoPlayer.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance =
    Math.sqrt(TailleTableau * TailleTableau + HauteurTableau * HauteurTableau) /
    2;

  const angleDepot = Math.atan2(dy, dx);
  const angleDifference = Math.abs(infoPlayer.angle - angleDepot);

  if (angleDifference < 0.2) {
    const frequence = Math.max(100, 1000 - (distance / maxDistance) * 1900);

    if (!sonTableauviolet.isPlaying) {
      sonTableauviolet.isPlaying = true;
      sonTableauviolet.play();
      setTimeout(() => {
        sonTableauviolet.isPlaying = false;
      }, frequence);
    }
  }
}

// fonction pour le chrono
function Timer() {
  if (isPaused) return;
  secondes++;
  para.innerHTML = secondes;
  if (secondes == 300) {
    // arrête l'exécution lancée par setInterval()
    quit();
  }
}

// fonction pour le controleur de mouvement pour le joueur
function playerControl(event) {
  if (isPaused || !isGameActive) return;
  posiX = event.pageX || event.changedTouches[0].pageX;
  posiY = event.pageY || event.changedTouches[0].pageY;

  let dx = posiX - infoPlayer.x;
  let dy = posiY - infoPlayer.y;
  infoPlayer.angle = Math.atan2(dy, dx);

  if (event.type === "mouseup" || event.type === "touchend") {
    deplacementX = 0;
    deplacementY = 0;
  } else {
    SoundPlay(sonPas);
    deplacementX = playerSpeedx * Math.cos(infoPlayer.angle);
    deplacementY = playerSpeedy * Math.sin(infoPlayer.angle);
  }
}

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
        isPaused = true;

        // affichage si le tableau est bien placé
        SoundPlay(sonTableau);
        const afficherTableau = document.querySelector(
          `.tableau${CouleurTableau}`
        );
        if (afficherTableau) {
          afficherTableau.classList.toggle(`tableau${CouleurTableau}`);

          setTimeout(() => {
            afficherTableau.classList.add(`tableau${CouleurTableau}`);
            isPaused = false;
          }, 2500);
        }
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
          isPaused = true;
          // affichage si le tableau est bien placé
          SoundPlay(rightSon);
          const goodElement = document.querySelector("#good");
          if (goodElement) {
            goodElement.classList.remove("invisible");
            setTimeout(() => {
              goodElement.classList.add("invisible");
              isPaused = false;
              WinCondition();
            }, 2000);
          }
        } else {
          depotTableau.push(inventory.shift());
          isPaused = true;
          // affichage si le tableau est mal placé
          SoundPlay(WrongSon);
          const wrongElement = document.querySelector("#wrong");
          if (wrongElement) {
            wrongElement.classList.remove("invisible");
            setTimeout(() => {
              wrongElement.classList.add("invisible");
              isPaused = false;
            }, 2000);
          }
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
          isPaused = true;
          // affichage si le tableau est bien placé
          SoundPlay(rightSon);
          const goodElement = document.querySelector("#good");
          if (goodElement) {
            goodElement.classList.remove("invisible");
            setTimeout(() => {
              goodElement.classList.add("invisible");
              isPaused = false;
              WinCondition();
            }, 2000);
          }
        } else {
          depotTableau.push(inventory.shift());
          isPaused = true;
          // affichage si le tableau est mal placé
          SoundPlay(WrongSon);
          const wrongElement = document.querySelector("#wrong");
          if (wrongElement) {
            wrongElement.classList.remove("invisible");
            setTimeout(() => {
              wrongElement.classList.add("invisible");
              isPaused = false;
            }, 2000);
          }
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
          isPaused = true;
          // affichage si le tableau est bien placé
          SoundPlay(rightSon);
          const goodElement = document.querySelector("#good");
          if (goodElement) {
            goodElement.classList.remove("invisible");
            setTimeout(() => {
              goodElement.classList.add("invisible");
              isPaused = false;
              WinCondition();
            }, 2000);
          }
        } else {
          depotTableau.push(inventory.shift());
          isPaused = true;
          // affichage si le tableau est mal placé
          SoundPlay(WrongSon);
          const wrongElement = document.querySelector("#wrong");
          if (wrongElement) {
            wrongElement.classList.remove("invisible");
            setTimeout(() => {
              wrongElement.classList.add("invisible");
              isPaused = false;
            }, 2000);
          }
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
          isPaused = true;
          // affichage si le tableau est bien placé
          SoundPlay(rightSon);
          const goodElement = document.querySelector("#good");
          if (goodElement) {
            goodElement.classList.remove("invisible");
            setTimeout(() => {
              goodElement.classList.add("invisible");
              isPaused = false;
              WinCondition();
            }, 2000);
          }
        } else {
          depotTableau.push(inventory.shift());
          isPaused = true;
          // affichage si le tableau est mal placé
          SoundPlay(WrongSon);
          const wrongElement = document.querySelector("#wrong");
          if (wrongElement) {
            wrongElement.classList.remove("invisible");
            setTimeout(() => {
              wrongElement.classList.add("invisible");
              isPaused = false;
            }, 2000);
          }
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
  if (isGameOver) return;

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
    SoundPlay(sonColission);
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

  // lancement des fonctions pour les tableaux
  DepotSon();
  fonctionementTableau();
  SonTableau1();
  SonTableau2();
  SonTableau3();
  SonTableau4();

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

  ctxTableau.strokeStyle = "magenta";
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
  if (timeDefinition < 20) {
    timeNow = performance.now();
    sec = (timeNow - time0) / 1000;
    time0 = timeNow;
    playerSpeedx = 60 * sec;
    playerSpeedy = 60 * sec;
    timeDefinition += 1;
  }

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

startGame();

function WinCondition() {
  if (
    tableau1.length === 1 &&
    tableau2.length === 1 &&
    tableau3.length === 1 &&
    tableau4.length === 1
  ) {
    if (!isGameOver) {
      isGameOver = true;
      isPaused = true;
      // let scoreFinal = chrono;
      SoundPlay(winSound);
      clearInterval(chrono);
      document.querySelector(".game").classList.add("invisible");
      document.querySelector(".winScreen").classList.remove("invisible");
    }
  }
}

document.querySelector(".quitter").addEventListener("click", quit);
document.querySelector(".restart").addEventListener("click", restart);

function restart() {
  isGameOver = false;
  isPaused = false;
  clearInterval(chrono);
  secondes = 0;
  para.innerHTML = secondes;

  // Réinitialise les tableaux et l'inventaire
  depotTableau = ["blue", "red", "green", "violet"];
  tableau1 = [];
  tableau2 = [];
  tableau3 = [];
  tableau4 = [];
  inventory = [];

  // variable pour la vitesse qui se met corrzectement en fonction des hz
  time0 = performance.now();
  timeNow = 0;
  sec = 0;
  timeDefinition = 0;
  playerSpeedx = 0;
  playerSpeedy = 0;

  // Réinitialise la position et l'état du joueur
  infoPlayer = { x: taille / 2, y: hauteur / 2, angle: 0 };
  deplacementX = 0;
  deplacementY = 0;

  // Réinitialise les sons
  sonDepot.isPlaying = false;
  sonTableaublue.isPlaying = false;
  sonTableaured.isPlaying = false;
  sonTableaugreen.isPlaying = false;
  sonTableauviolet.isPlaying = false;

  // Réinitialise les éléments visuels
  document.querySelector("#start").classList.remove("invisible");
  document.querySelector(".winScreen").classList.add("invisible");

  // Réinitialise les canvas
  ctxColission.clearRect(0, 0, taille, hauteur);
  ctxBackground.clearRect(0, 0, taille, hauteur);
  ctxPlayer.clearRect(0, 0, taille, hauteur);
  ctxTableau.clearRect(0, 0, taille, hauteur);

  isGameActive = false;
}

function quit() {
  isGameOver = false;
  isPaused = false;
  clearInterval(chrono);
  secondes = 0;
  para.innerHTML = secondes;

  // Réinitialise les tableaux et l'inventaire
  depotTableau = ["blue", "red", "green", "violet"];
  tableau1 = [];
  tableau2 = [];
  tableau3 = [];
  tableau4 = [];
  inventory = [];

  // variable pour la vitesse qui se met corrzectement en fonction des hz
  time0 = performance.now();
  timeNow = 0;
  sec = 0;
  timeDefinition = 0;
  playerSpeedx = 0;
  playerSpeedy = 0;

  // Réinitialise la position et l'état du joueur
  infoPlayer = { x: taille / 2, y: hauteur / 2, angle: 0 };
  deplacementX = 0;
  deplacementY = 0;

  // Réinitialise les sons
  sonDepot.isPlaying = false;
  sonTableaublue.isPlaying = false;
  sonTableaured.isPlaying = false;
  sonTableaugreen.isPlaying = false;
  sonTableauviolet.isPlaying = false;

  // Réinitialise les éléments visuels
  document.querySelector(".game").classList.add("invisible");
  document.querySelector("#start").classList.remove("invisible");
  document.querySelector(".winScreen").classList.add("invisible");

  // Réinitialise les canvas
  ctxColission.clearRect(0, 0, taille, hauteur);
  ctxBackground.clearRect(0, 0, taille, hauteur);
  ctxPlayer.clearRect(0, 0, taille, hauteur);
  ctxTableau.clearRect(0, 0, taille, hauteur);
  ctxLumiere.clearRect(0, 0, taille, hauteur);

  isGameActive = false;
}


// histoire
const storyScreen = document.querySelector(".storyScreen");
const storyDiv = document.querySelector(".dialogueBox");
const animDiv = document.querySelector(".animTxt");
const speakerDiv = document.querySelector(".speaker");
const imgSpeaker = document.querySelector(".imgSpeaker");

document.querySelector(".toStory").addEventListener("click", startStory);

let clickCount = 0;

function startStory()
{
    document.querySelector(".winScreen").classList.add("invisible");
    storyScreen.classList.remove("invisible");

    storyDiv.addEventListener("click", () => {
        if (clickCount < story.length)
        {
            const dialogue = story[clickCount % story.length];
            speakerDiv.innerHTML = dialogue.character;

            if (dialogue.character == "You")
              imgSpeaker.innerHTML = "<img src='../img/siteImg/player.png'>";
            else if (dialogue.character == "Thief")
              imgSpeaker.innerHTML = "<img src='../img/siteImg/thief.png'>";
            else if (dialogue.character == "Museum staff")
              imgSpeaker.innerHTML = "<img src='../img/siteImg/staff.png'>";
            else 
              imgSpeaker.innerHTML = "";

            animText(dialogue.text);
            clickCount++;
        }
        else
        {
            document.body.style.background = "red";
        }
    });
}

const story = [
  {
      character: "Museum staff",
      text: "Thank you again for stopping the thieves and bringing back the paintings, we are really grateful for your help !"
  },
  {
      character: "You",
      text: "No worries I'm happy to have helped the museum !"
  },
  {
      character: "Museum staff",
      text: "We would like to reward you for your actions please accept it."
  },
  {
      character: "",
      text: "The museum staff hands you a notebook and a pencil (average school rewards be like)" 
      // a finir et mettre un reward normal (a part si on veux garder ma blague (elle est drole (trust me (it's funny))))
  }
];

function animText(text) {
    let output = "";
    for (const letter of text) {
        output += `<span>${letter}</span>`;
    }
    animDiv.innerHTML = output;
    [...animDiv.children].forEach((span, index) => {
        setTimeout(() => {
            span.classList.add("visible");
        }, 50 * index);
    });
}

// cheat code
const cheat = document.querySelector(".cheat");
const cheatButton = document.querySelector(".code");

cheatButton.addEventListener("click", cheatCode);

function cheatCode()
{
    if (cheat.value == "mmi")
    {
      winSound.pause();
      winSound.load();
      winSound.play();
      document.querySelector("#start").classList.add("invisible");
      document.querySelector(".winScreen").classList.remove("invisible");
    }
}