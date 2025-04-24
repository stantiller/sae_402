const canvas = document.getElementById('jeuCanvas');
const ctx = canvas.getContext("2d");
let animationId;

let jeuEnCours = false;

// Le joueur
const joueur = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    color: 'blue',
    vy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false
};

// Le voleur
const voleur = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    color: 'red'
};

// Les bancs (obstacles)
const bancs = [];
let bancTimer = 0;
const bancInterval = 100;   // chaque 100 frames

// Le chronomètre de la poursuite
let poursuiteTime = 30;     // secondes
let poursuiteTimer = poursuiteTime * 60; // en frames (si 60 fps)

// Contrôle du personnage en jeu
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !joueur.isJumping) {
        joueur.vy = joueur.jumpStrength;
        joueur.isJumping = true;
    }
});

document.querySelector(".start").addEventListener("click", commencerJeu);
// Fonction du commencement de la partie
function commencerJeu() {
    document.querySelector("#start").classList.add("invisible");
    document.querySelector(".game").classList.remove("invisible");

    reinitialiserJeu();
    jeuEnCours = true;
    gameLoop();
}

// Fonction du réinitialisation de la partie
function reinitialiserJeu() {
    joueur.x = canvas.width / 2 - 20;
    joueur.y = canvas.height - 60;
    joueur.vy = 0;
    joueur.isJumping = false;
    joueur.width = 40;
    joueur.height = 40;

    bancs. length = 0;
    bancTimer = 0;
    poursuiteTimer = poursuiteTime * 60;

    jeuEnCours = true;
    gameLoop();
}

// Fonction du fin de la partie
function finDuJeu() {
    jeuEnCours = false;
    cancelAnimationFrame(animationId);

    document.querySelector(".winScreen").classList.remove("invisible");
    document.querySelector(".game").classList.add("invisible");
    
}
function mort(){
    jeuEnCours = false;
    cancelAnimationFrame(animationId);
    document.querySelector(".loseScreen").classList.remove("invisible");
    document.querySelector(".game").classList.add("invisible");
}

document.querySelector(".restart").addEventListener("click", restart);
function restart(){
    document.querySelector(".loseScreen").classList.add("invisible");
    document.querySelector(".game").classList.remove("invisible");

    reinitialiserJeu();
    jeuEnCours = true;
    gameLoop();
}

// document.querySelector(".again").addEventListener("click", again);
function again(){
    document.querySelector(".winScreen").classList.add("invisible");
    document.querySelector(".game").classList.remove("invisible");

    reinitialiserJeu();
    jeuEnCours = true;
    gameLoop();
  }


function update() {
    // Le mouvement du jouer vers le haut
    //joueur.y -= 2;

    // Appliquer la gravité
    joueur.vy += joueur.gravity;
    joueur.y += joueur.vy;

    // La collision avec le sol
    if (joueur.y + joueur.height > canvas.height) {
        joueur.y = canvas.height - joueur.height;
        joueur.vy = 0;
        joueur.isJumping = false;
    }

    // Le saut : aggrandir le joueur pendant le saut
    if (joueur.isJumping) {
        joueur.width = 50;
        joueur.height = 50;
    } else {
        joueur.width = 40;
        joueur.height = 40;
    }

    // Génération des bancs
    bancTimer++;
    if (bancTimer > bancInterval) {
        bancs.push({
            x: Math.random() * (canvas.width - 60),
            y: -20,
            width: 60,
            height: 20,
            color: 'brown'
        });
        bancTimer = 0;
    }

    // La mise à jour des bancs
    bancs.forEach(banc => {
        banc.y += 2; // Les bancs descendent
    });

    // La suppression des anciens bancs
    for (let i = bancs.length - 1; i >= 0; i--) {
        if (bancs[i].y > canvas.height) {
            bancs.splice(i, 1);
        }
    }

    // La vérification de collision avec bancs(des obstacles) (uniquement si joueur tombe)
    if (joueur.vy >= 0) {
        bancs.forEach(banc => {
            if (joueur.x < banc.x + banc.width &&
                joueur.x + joueur.width > banc.x &&
                joueur.y < banc.y + banc.height &&
                joueur.y + joueur.height > banc.y) {
                    mort();
                }
        });
    }

    // Le compte à rebours de la poursuite
    if (poursuiteTimer > 0) {
        poursuiteTimer--;
    } else {
        finDuJeu();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur
    ctx.fillStyle = joueur.color;
    ctx.fillRect(joueur.x, joueur.y, joueur.width, joueur.height);

    // Dessiner le voleur
    ctx.fillStyle = voleur.color;
    ctx.fillRect(voleur.x, voleur.y, voleur.width, voleur.height);

    // Dessienr les bancs
    bancs.forEach(banc => {
        ctx.fillStyle = banc.color;
        ctx.fillRect(banc.x, banc.y, banc.width, banc.height);
    });

    // Afficher le chronomètre
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Temps de poursuite: ' + Math.ceil(poursuiteTimer/60), 10, 30);
}

function gameLoop() {
    if (!jeuEnCours) return;
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
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
                imgSpeaker.innerHTML = "<img src='img/siteImg/player.png'>";
            else if (dialogue.character == "Thief")
                imgSpeaker.innerHTML = "<img src='img/siteImg/thief.png'>";
            else if (dialogue.character == "Museum staff")
                imgSpeaker.innerHTML = "<img src='img/siteImg/staff.png'>";
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
        character: "You",
        text: "Get back here ! I won't let you steal those paintings !"
    },
    {
        character: "Thief",
        text: "And how are you planning to stop us ?"
    },
    {
        character: "You",
        text: "I challenge you to a duel !"
    },
    {
        character: "",
        text: "the thieves look amused and one of them confidently accepts the challenge"
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
        document.querySelector("#start").classList.add("invisible");
        document.querySelector(".winScreen").classList.remove("invisible");
    }
}