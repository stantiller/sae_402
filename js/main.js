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




var H = window.innerHeight;
var W = window.innerWidth;
const nbrPoints = 5;
var points = [];

const bullets = document.querySelector(".bulletZone");
const player = document.querySelector(".playerZone");
canvas.height = H;
canvas.width = W;

var bul = canvas.getContext("2d");

ctx.lineWidth = 4;

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

let vy = 2;
let xyg = -0.5;
let xyd = 0.5;

function afficher()
{
    bul.fillStyle = "skyblue";
    bul.fillRect(0, 0, W, H);
    points.forEach(point => {

        // point.x += vx;
        point.y += vy;
        point.xg += xyg;
        point.xd += xyd;
        
        bul.fillStyle = "black";
        bul.fillRect((point.x), (point.y), 8, 8)
        bul.fillRect((point.xg), (point.y), 8, 8)
        bul.fillRect((point.xd), (point.y), 8, 8)
        
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
       
    });
    window.requestAnimationFrame(afficher);
}
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

wow();*/
