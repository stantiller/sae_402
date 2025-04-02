// taille de l'écran
var H = window.innerHeight;
var W = window.innerWidth;

// collisions murs
let Wa = W - 20;
let Ha = H - 20;

// taille et selection des zones
const background = document.querySelector(".background");
const ennemy = document.querySelector(".ennemyZone");
const bullets = document.querySelector(".bulletZone");
const player = document.querySelector(".playerZone");
background.height = H;
background.width = W;
ennemy.height = H;
ennemy.width = W;
bullets.height = H;
bullets.width = W;
player.height = H;
player.width = W;

// variables de contexte
let bg = background.getContext("2d");
let boss = ennemy.getContext("2d");
let bul = bullets.getContext("2d");
let play = player.getContext("2d");

// score du jeu
let score = 0;

// player
let moveRight = false;
let moveLeft = false;
let moveForward = false;
let moveBack = false;
let pHitbox = 20/2;
let px = W/2-10 - pHitbox;
let py = H-200;
let pvx = 2;
let pvy = 2;

// ennemy
let eMoveRight = false;
let eMoveLeft = false;
let eHitbox = 25/2;
let ex = W/2-10 - eHitbox;
let ey = 0+80;
let evx = 2;
let evy = 2;

// sons
let plDead = new Audio('sounds/pldead00.wav');
let bulletSound = new Audio('sounds/tan02.wav');
let ennemyDmg = new Audio('sounds/damage00.wav');
plDead.volume = 0.25;
bulletSound.volume = 0.25;
ennemyDmg.volume = 0.15;

//player bullets
let pBullets = []
let pbHitbox = 4/2;
let ptimer = -1;
let fRate = 200;

// bullets and patterns
const nbrPattern1 = 2;
const nbrPattern2 = 5;
let bHitbox = 8/2;
let pattern1 = [];
let pattern2 = [];
// let xValue = 200;
for (let i = 0; i < nbrPattern1; i++)
{
    pattern1.push(
        [
            [
                {   
                    x: ex + eHitbox,
                    y: ey + eHitbox,
                    vx: 0.5,
                    vy: 2
                }
            ],
            [
                {   
                    x: ex + eHitbox,
                    y: ey + eHitbox,
                    vx: 0.5,
                    vy: 2
                }
            ],
            [
                {   
                    x: ex + eHitbox,
                    y: ey + eHitbox,
                    vx: 0.5,
                    vy: 2
                }
            ]
        ]
    );
    bulletSound.load();
    bulletSound.play();
}

Xvalue = W/2-50;
setTimeout(() => {
    for (let i = 0; i < nbrPattern2; i++)
    {
        setTimeout(() => {
        pattern2.push(
            [
                [
                    {   
                        x: ex + eHitbox,
                        y: ey + eHitbox,
                        vx: 0,
                        vy: 2
                    }
                ]
            ]
        );
        bulletSound.load();
        bulletSound.play();
        }, 100*i);
    }
}, 3000);


function playerControl(event)
{
    let gamma = event.gamma;
    let beta = event.beta;

    // console.log(gamma, beta);

    // activer mouvement
    if (gamma > 5)
        moveRight = true;
    if (gamma < -5)
        moveLeft = true;
    if (beta < 0)
        moveForward = true;
    if (beta > 5)
        moveBack = true;

    // desactiver mouvement
    if (gamma < 5)
        moveRight = false;
    if (gamma > -5)
        moveLeft = false;
    if (beta > 0)
        moveForward = false;
    if (beta < 5)
        moveBack = false;
}


function afficher()
{
    bg.fillStyle = "skyblue";
    bg.fillRect(0, 0, W, H);
    bul.clearRect(0, 0, W, H);
    play.clearRect(0, 0, W, H)

    bulletPattern1();

    bulletPattern2();

    // mouvement joueur
    if (moveRight)
        px += pvx;
    if (moveLeft)
        px -= pvx;
    if (moveForward)
        py -= pvy;
    if (moveBack)
        py += pvy;

    // collisions mur joueur
    if (px < 0)
        px = 0;
    if (px > Wa)
        px = Wa;
    if (py < 0)
        py = 0;
    if (py > Ha)
        py = Ha;

    ennemyPlayerCollision();
    
    // affichage joueur
    play.fillRect((px), (py), pHitbox*2, pHitbox*2);

    // mouvement ennemy
    if (eMoveRight)
        ex += evx;
    if (eMoveLeft)
        ex -= evx;

    //affichage ennemy
    boss.fillRect((ex), (ey), eHitbox*2, eHitbox*2);

    if (ptimer == -1)
    {
        ptimer = setInterval(playerBullets, fRate)
        playerBullets();
    }

    playerShoot();

    // console.log(score);

    window.requestAnimationFrame(afficher);
}
window.addEventListener("deviceorientation", playerControl, true);
afficher();


// verification de collision joueur
function bulletCollision(bullet)
{
    let distx = Math.abs((px + pHitbox) - (bullet.x + bHitbox));
    let disty = Math.abs((py + pHitbox) - (bullet.y + bHitbox));
    
    if (distx < (pHitbox + bHitbox) && disty < (pHitbox + bHitbox)) {
        stopGame();
    }
}

// collision avec le boss
function ennemyPlayerCollision()
{
    let distx = Math.abs((px + pHitbox) - (ex + eHitbox));
    let disty = Math.abs((py + pHitbox) - (ey + eHitbox));
    
    if (distx < (pHitbox + eHitbox) && disty < (pHitbox + eHitbox)) {
        stopGame();
    }
}

// verification de collision ennemy
function ennemyCollision(pBullet)
{
    let distx = Math.abs((ex + pHitbox) - (pBullet.pbx + pbHitbox));
    let disty = Math.abs((ey + pHitbox) - (pBullet.pby + pbHitbox));
    
    if (distx < (eHitbox + pbHitbox) && disty < (eHitbox + pbHitbox)) {
        let index = pBullets.indexOf(pBullet);
        if (index !== -1) {
            pBullets.splice(index, 1);
        }
        ennemyHit();
    }
}
function ennemyHit()
{
    bg.fillRect(0, 0, W, H);
    score += 10;
    ennemyDmg.load();
    ennemyDmg.play();
}

// arret du jeu 
function stopGame()
{
    bg.fillStyle = "#FFAAAA";
    bg.fillRect(0, 0, W, H);
    plDead.load();
    plDead.play();
}

// tir du joueur
function playerBullets()
{
    pBullets.push(
        
        {   
            pbx: px + pHitbox - pbHitbox,
            pby: py,
            pbvy: 4
        }
        
    );
}
function playerShoot()
{
    pBullets.forEach(pBullet => {
        
        pBullet.pby -= pBullet.pbvy;

        bul.fillRect((pBullet.pbx), (pBullet.pby), pbHitbox*2, 6);

        ennemyCollision(pBullet);

        if (pBullet.pby < 0) {
            let index = pBullets.indexOf(pBullet);
            if (index !== -1) {
                pBullets.splice(index, 1);
            }
        }

    });
}

// affichage des patternes
function bulletPattern1()
{
    pattern1.forEach(tripleBullet => {
        tripleBullet[0].forEach(bullet => {

            bullet.y += bullet.vy;

            bul.fillRect((bullet.x - bHitbox), (bullet.y), bHitbox*2, bHitbox*2);

            bulletCollision(bullet);

        });

        tripleBullet[1].forEach(bullet => {

            bullet.y += bullet.vy;
            bullet.x += bullet.vx;
            bul.fillRect((bullet.x - bHitbox), (bullet.y), bHitbox*2, bHitbox*2);

            bulletCollision(bullet);

        });

        tripleBullet[2].forEach(bullet => {

            bullet.y += bullet.vy;
            bullet.x -= bullet.vx;
            bul.fillRect((bullet.x - bHitbox), (bullet.y), bHitbox*2, bHitbox*2);

            bulletCollision(bullet); 

        });
    });
}

function bulletPattern2()
{
    pattern2.forEach(straightBullet => {
        straightBullet[0].forEach(bullet => {

            bullet.y += bullet.vy;

            bul.fillRect((bullet.x - bHitbox), (bullet.y), bHitbox*2, bHitbox*2);

            bulletCollision(bullet);     

        });
    });
}



// -----------------------------------------------------------------------------
// poubelle --------------------------------------------------------------------
// -----------------------------------------------------------------------------

/*

// animation texte

.animTxt>span {
    opacity: 0;
    transition: 0.2s;
}
.animTxt>span.visible {
    opacity: 1;
}


document.querySelectorAll("animTxt").forEach(div => {
    let output = "";
    div.innerText.split("").forEach(lettre => {
        output += `<span>${lettre}</span>`;
    });
    div.innerHTML = output;
    div.addEventListener("click", afficherTxt);
});

function afficherTxt()
{
    [...this.children].forEach((lettre, index) => {
        setTimeout(()=>{lettre.classList.add("visible")}, 50*index);
    });
}

*/


/*

var move = 0

function wow()
{
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.moveTo(10, (200 + move));
    ctx.lineTo(200, 10);
    ctx.lineTo((300 + move), 300);
    ctx.stroke();
    move = move + 1;
    if (move == 300)
    {
        move = 1;
        ctx.clearRect(0, 0, W, H);
    }
    affichage();
}

wow();


const nbrPoints = 5;
var points = [];

for (let i = 0; i < nbrPoints; i++)
{
    points.push(
        {   x: 200,
            xg: 200,
            xd: 200,
            y: 100
            // vx: Math.random()*4-2,
            // vy: Math.random()*4-2
        }
    );
}
    


// Config

const dX = 10;
const dY = 10;
const dTimer = 15;

// Initialisation

let block = document.querySelector(".block");
let x = 0;
let y = 0;
let vX = 0;
let vY = 0;

let timer = -1;

let keys = [];

// Event

window.addEventListener("keydown", yay);
window.addEventListener("keyup", stop);

function yay(event){
    if (timer == -1){
        timer = setInterval(wow, dTimer)
        wow();
    }

    let index = keys.indexOf(event.key);
    if (index > -1){
        return;
    }
    else {
        keys.push(event.keys);
        switch(event.key){
            case "ArrowUp":
                console.log("haut");
                vY -= dY;
                break;
            case "ArrowDown":
                console.log("bas");
                vY += dY;
                break;
            case "ArrowRight":
                console.log("droite");
                vX += dX;
                break;
            case "ArrowLeft":
                console.log("gauche");
                vX -= dX;
                break;
        }
    }   
}

function stop(event){
    let index = keys.indexOf(event.key);
    if (index >= -1){
        keys.splice(index, 1);
    }

    if (keys.length == 0){
        clearInterval(timer);
        timer = -1;
    }

    switch(event.key){
        case "ArrowUp":
            vY += dY;
            break;
        case "ArrowDown":
            vY -= dY;
            break;
        case "ArrowRight":
            vX -= dX;
            break;
        case "ArrowLeft":
            vX += dX;
            break;
    }
}

function wow(){
    x += vX;
    y += vY;
    block.style.transform = `translate(${x}px, ${y}px)`;
}

*/