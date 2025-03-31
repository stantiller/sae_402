// taille de l'écran
var H = window.innerHeight;
var W = window.innerWidth;

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



// bullets
const nbrBullets = 5;
var tripleBullets = [];
for (let i = 0; i < nbrBullets; i++)
{
    tripleBullets.push(
        [
            {   
                x: 200,
                y: 100,
                vx: 0.5,
                vy: 2
            }
        ],
        [
            {   
                x: 200,
                y: 100,
                vx: 0.5,
                vy: 2
            }
        ],
        [
            {   
                x: 200,
                y: 100,
                vx: 0.5,
                vy: 2
            }
        ]
    );
}
// let x = 200;
// let xg = 200;
// let xd = 200;
// let y = 10;
// let vy = 2;
// let vx = 0.5;

// player
let moveRight = false;
let moveLeft = false;
let moveForward = false;
let moveBack = false;
let px = W/2-10;
let py = H-200;
let pvx = 2;
let pvy = 2;

function playerControl(event)
{

    let gamma = event.gamma;
    let beta = event.beta;

    // console.log(gamma, beta);

    if (gamma > 5)
        // droite
        moveRight = true;
    if (gamma < -5)
        // gauche
        moveLeft = true;
    if (beta < 0)
        // avant
        moveForward = true;
    if (beta > 5)
        // arriere
        moveBack = true;

    if (gamma < 5)
        // droite
        moveRight = false;
    if (gamma > -5)
        // gauche
        moveLeft = false;
    if (beta > 0)
        // avant
        moveForward = false;
    if (beta < 5)
        // arriere
        moveBack = false;
}


function afficher()
{
    bg.fillStyle = "skyblue";
    bg.fillRect(0, 0, W, H);
    bul.clearRect(0, 0, W, H);
    play.clearRect(0, 0, W, H)

    tripleBullets[0].forEach(bullet => {

        bullet.y += bullet.vy;

        bul.fillRect((bullet.x), (bullet.y), 8, 8);

        if (px == bullet.x && py == bullet.y){
            bg.fillStyle = "red";
            bg.fillRect(0, 0, W, H);
        }

    });

    tripleBullets[1].forEach(bullet => {

        bullet.y += bullet.vy;
        bullet.x += bullet.vx;
        bul.fillRect((bullet.x), (bullet.y), 8, 8);

        if (px == bullet.x && py == bullet.y){
            bg.fillStyle = "red";
            bg.fillRect(0, 0, W, H);
        }

    });

    tripleBullets[2].forEach(bullet => {

        bullet.y += bullet.vy;
        bullet.x -= bullet.vx;
        bul.fillRect((bullet.x), (bullet.y), 8, 8);

        if (px == bullet.x && py == bullet.y){
            bg.fillStyle = "red";
            bg.fillRect(0, 0, W, H);
        }

    });

    if (moveRight)
        px += pvx;
    if (moveLeft)
        px -= pvx;
    if (moveForward)
        py -= pvy;
    if (moveBack)
        py += pvy;
    
    // console.log(px, py);

    play.fillRect((px), (py), 20, 20);
    
    // if (point.x < 0 || point.x > W) 
    //     point.vx = -point.vx;
    // if (point.y < 0 || point.y > H) 
    //     point.vy = -point.vy;

    // if (point.x < 0) 
    //     point.x = W;
    // if (point.x > W)
    //     point.x = 0;
    // if (point.y < 0 || point.y > H) 
    //     point.y = H;
    // if (point.y > H)
    //     point.y = 0;

    window.requestAnimationFrame(afficher);
}
window.addEventListener("deviceorientation", playerControl, true);
afficher();


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
    
*/



// // Config

// const dX = 10;
// const dY = 10;
// const dTimer = 15;

// // Initialisation

// let block = document.querySelector(".block");
// let x = 0;
// let y = 0;
// let vX = 0;
// let vY = 0;

// let timer = -1;

// let keys = [];

// // Event

// window.addEventListener("keydown", yay);
// window.addEventListener("keyup", stop);

// function yay(event){
//     if (timer == -1){
//         timer = setInterval(wow, dTimer)
//         wow();
//     }

//     let index = keys.indexOf(event.key);
//     if (index > -1){
//         return;
//     }
//     else {
//         keys.push(event.keys);
//         switch(event.key){
//             case "ArrowUp":
//                 console.log("haut");
//                 vY -= dY;
//                 break;
//             case "ArrowDown":
//                 console.log("bas");
//                 vY += dY;
//                 break;
//             case "ArrowRight":
//                 console.log("droite");
//                 vX += dX;
//                 break;
//             case "ArrowLeft":
//                 console.log("gauche");
//                 vX -= dX;
//                 break;
//         }
//     }   
// }

// function stop(event){
//     let index = keys.indexOf(event.key);
//     if (index >= -1){
//         keys.splice(index, 1);
//     }

//     if (keys.length == 0){
//         clearInterval(timer);
//         timer = -1;
//     }

//     switch(event.key){
//         case "ArrowUp":
//             vY += dY;
//             break;
//         case "ArrowDown":
//             vY -= dY;
//             break;
//         case "ArrowRight":
//             vX -= dX;
//             break;
//         case "ArrowLeft":
//             vX += dX;
//             break;
//     }
// }

// function wow(){
//     x += vX;
//     y += vY;
//     block.style.transform = `translate(${x}px, ${y}px)`;
// }