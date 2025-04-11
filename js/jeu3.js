var taille = window.innerWidth;
var hauteur = window.innerHeight;

const colission = document.getElementById("colission");
const background = document.getElementById("background");
const lumiere = document.getElementById("noir");
const player = document.getElementById("player");
const tableau = document.getElementById("tableau");

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

let ctxBackground = background.getContext("2d");
let ctxColission = colission.getContext("2d");
let ctxLumiere = lumiere.getContext("2d");
let ctxPlayer = player.getContext("2d");
let ctxTableau = tableau.getContext("2d");

let rayonRectT = 60;
let rayonRectH = 40;

let hitbox = 40 / 2;
let infoPlayer = { x: taille / 2, y: hauteur / 2, angle: 0 };
let deplacementX = 0;
let deplacementY = 0;
let posiX = 0;
let posiY = 0;
let differenceXY = 0;

const backgroundImage = new Image();
backgroundImage.src = "./images/background.jpg";

const colissionImage = new Image();
colissionImage.src = "./images/collision.jpg";

const sprite = new Image();
sprite.src = "./images/spirte/sprite.png";

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
    deplacementX = 0.7 * Math.cos(infoPlayer.angle);
    deplacementY = 0.7 * Math.sin(infoPlayer.angle);
  }
}

const pixel = ctx.getImageData(x, y, 1, 1);
const data = pixel.data;

window.addEventListener("touchstart", playerControl);
window.addEventListener("touchmove", playerControl);
window.addEventListener("touchend", playerControl);
window.addEventListener("mousedown", playerControl);
window.addEventListener("mousemove", playerControl);
window.addEventListener("mouseup", playerControl);

function afficher() {
  ctxColission.clearRect(0, 0, taille, hauteur);
  ctxBackground.clearRect(0, 0, taille, hauteur);
  ctxPlayer.clearRect(0, 0, taille, hauteur);
  ctxTableau.clearRect(0, 0, taille, hauteur);

  // affichage du modele de collision du jeu
  ctxColission.drawImage(colissionImage, 0, 0, taille, hauteur);
  // affichage du background du jeu
  ctxBackground.drawImage(backgroundImage, 0, 0, taille, hauteur);

  // affichage du fond noir opaque
  ctxLumiere.fillStyle = "black";
  ctxLumiere.fillRect(0, 0, taille, hauteur);

  const angleCorrection = -Math.PI / 2;

  // fonctionement de la lumiere
  ctxLumiere.save();
  ctxLumiere.translate(infoPlayer.x + 20, infoPlayer.y);
  ctxLumiere.rotate(infoPlayer.angle + angleCorrection);
  ctxLumiere.fillStyle = "yellow";
  ctxLumiere.globalCompositeOperation = "destination-out";
  ctxLumiere.beginPath();
  ctxLumiere.moveTo(0, 0);
  ctxLumiere.lineTo(-70, 200);
  ctxLumiere.lineTo(70, 200);
  ctxLumiere.fill();
  ctxLumiere.globalCompositeOperation = "source-over";
  ctxLumiere.restore();

  // affichage du déplacement du player et le player en lui meme
  let dx = posiX - infoPlayer.x;
  let dy = posiY - infoPlayer.y;

  differenceXY = Math.sqrt(dx * dx + dy * dy);
  console.log(differenceXY);

  ctxPlayer.save();
  if (differenceXY < hitbox * 1.5) {
    deplacementX = 0;
    deplacementY = 0;
  } else {
    infoPlayer.x += deplacementX;
    infoPlayer.y += deplacementY;
  }

  ctxPlayer.translate(infoPlayer.x + hitbox, infoPlayer.y + hitbox);
  ctxPlayer.rotate(infoPlayer.angle);
  ctxPlayer.drawImage(sprite, -hitbox, -hitbox, hitbox * 2.3, hitbox * 2.3);
  ctxPlayer.restore();

  window.requestAnimationFrame(afficher);
}

afficher();
