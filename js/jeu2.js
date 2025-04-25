// taille de l'écran
var H = window.innerHeight;
var W = window.innerWidth;

// taille et selection des zones
const showScore = document.getElementById("score");
const background = document.getElementById("background");
const ennemy = document.getElementById("ennemyZone");
const bullets = document.getElementById("bulletZone");
const player = document.getElementById("playerZone");
const startScreen = document.querySelector(".startBackground");
const winningScreen = document.querySelector(".winScreen");
const losingScreen = document.querySelector(".loseScreen");
const storyScreen = document.querySelector(".storyScreen");
const affichageMap = document.querySelector(".mapContain");
const quitButton = document.querySelector(".quitter");
const cheat = document.querySelector(".cheat");
const cheatButton = document.querySelector(".code");
showScore.height = 400;
showScore.width = W;
background.height = H;
background.width = W;
ennemy.height = H;
ennemy.width = W;
bullets.height = H;
bullets.width = W;
player.height = H;
player.width = W;

// variables de contexte
let ctxScore = showScore.getContext("2d");
let bg = background.getContext("2d");
let boss = ennemy.getContext("2d");
let bul = bullets.getContext("2d");
let play = player.getContext("2d");

// son
const plDead = new Audio('../sounds/game2/pldead00.wav');
const bulletSound = new Audio('../sounds/game2/tan02.wav');
const ennemyDmg = new Audio('../sounds/game2/damage00.wav');
const winSound = new Audio('../sounds/global/win.mp3');
plDead.volume = 0.25;
bulletSound.volume = 0.25;
ennemyDmg.volume = 0.15;
let approachSoundVolume = 0.35;
let soundDist = 250;
let maxFreq = 1500;

// background sprite
const bgSprite = new Image();
bgSprite.src = "../img/game2/24968.jpg";
let bgSpritex = 3600;
let bgSpritey = 100;
let bgSpriteSizex = 1650;
let bgSpriteSizey = 2800;

// player sprite and hitbox
const pSprite = new Image();
pSprite.src = "../img/game2/sprite.png";
let pSpriteHitbox = 35/2;
let pSpritex = 0;
let pSpritey = 0;
let pSpriteSize = 105;
let pHitbox = 12/2;

// ennemy sprite and hitbox
const eSprite = new Image();
eSprite.src = "../img/game2/enemy1.png";
let eSpriteHitbox = 35/2;
let eSpritex = 8;
let eSpritey = 18;
let eSpriteSize = 16;
let eHitbox = 25/2;

// bullet sprite and hitbox
const bulletImg = new Image();
bulletImg.src = "../img/game2/bullet_sprite_sheet.png";
let bImgx = 338;
let bImgy = 73;
let bImgSize = 16;
let bHitbox = 14/2;

// number of bullets in patterns
const nbrPattern1 = 2;
const nbrPattern2 = 5;
const nbrPattern3 = 1;
const nbrPattern4 = 2;
const nbrPattern5 = 1;
const nbrPattern6 = 1;
const nbrPattern7 = 1;
const nbrPattern8 = 8;
const nbrPattern9 = 1;
const nbrPattern10 = 5;
const nbrPattern11 = 1;
const nbrPattern12 = 10;
const nbrPattern13 = 1;
const nbrPattern14 = 1;
const nbrPattern15 = 2;
const nbrPattern16 = 2;

// oscillateur
const approachSound = new AudioContext();
const oscillator = approachSound.createOscillator();
const gainNode = approachSound.createGain();
oscillator.connect(gainNode);
gainNode.connect(approachSound.destination);
oscillator.start();
gainNode.gain.value = 0;

// vérification de la position
var id, target, options;
var map = 0;
let routingControl = null;

function success(pos) {
    var crd = pos.coords;

    if (L.latLng(crd.latitude, crd.longitude).distanceTo(L.latLng(target.latitude, target.longitude)) <= 6) {
        console.log("Bravo, vous avez atteint la cible");
        navigator.geolocation.clearWatch(id);
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        if (map !== 0)
            map.remove();
        affichageMap.remove();
        startScreen.classList.remove("invisible");
    }
    else
    {
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        if (map !== 0)
            map.remove();

        map = L.map('map').setView([crd.latitude, crd.longitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(crd.latitude, crd.longitude),
                L.latLng(target.latitude, target.longitude)
            ],
            show: false, // hides the directions panel
            addWaypoints: false, // disables adding waypoints by clicking
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            routeWhileDragging: false,
            showAlternatives: false
        }).addTo(map);
    }
}

function error(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
}

// target = {
//     latitude: 47.745203,
//     longitude: 7.336902,
// };

target = {
    latitude: 47.730042,
    longitude: 7.301872,
};

options = {
    enableHighAccuracy: false,
    timeout: 1000,
    maximumAge: 0,
};

id = navigator.geolocation.watchPosition(success, error, options);

// jeu
function startGame()
{
    // display
    showScore.classList.remove("invisible");
    background.classList.remove("invisible");
    ennemy.classList.remove("invisible");
    bullets.classList.remove("invisible");
    player.classList.remove("invisible");
    quitButton.classList.remove("invisible");
    startScreen.classList.add("invisible");
    losingScreen.classList.add("invisible");
    winningScreen.classList.add("invisible");

    // score timer du jeu et definition du temps
    let score = 0;
    let gainScore = 100
    let countDown = -1;
    let cdTimer = 40;
    let t0 = performance.now();
    let tnow = 0;
    let sec = 0;
    let defineTime = 0

    // fin du jeu gagne ou non
    let fin = false;
    let win = false;
    let quit = false;

    // player
    let moveRight = false;
    let moveLeft = false;
    let moveForward = false;
    let moveBack = false;
    let px = W/2 - pHitbox;
    let py = H-200;
    let pvx = 2;
    let pvy = 2;
    let gammaMove = 5;
    let betaForwMove = 10;
    let betaBackMove = 25;

    // ennemy
    let ex = W/2 - eHitbox;
    let ey = 80;
    let evx = 2.5;
    let evy = 2;
    let eTargetx = ex;
    let eTargety = ey;

    // sons
    let freq = 0;
    gainNode.gain.value = 0;

    //player bullets
    let pBullets = []
    let pbHitbox = 4/2;
    let ptimer = -1;
    let fRate = 200;
    let pbspeedy = 4;

    // bullets and patterns
    let pattern1Push = false;
    let pattern2Push = false;
    let pattern3Push = false;
    let pattern4Push = false;
    let pattern5Push = false;
    let pattern6Push = false;
    let pattern7Push = false;
    let pattern8Push = false;
    let pattern9Push = false;
    let pattern10Push = false;
    let pattern11Push = false;
    let pattern12Push = false;
    let pattern13Push = false;
    let pattern14Push = false;
    let pattern15Push = false;
    let pattern16Push = false;
    let pattern1 = [];
    let pattern2 = [];
    let pattern3 = [];
    let pattern4 = [];
    let pattern5 = [];
    let pattern6 = [];
    let pattern7 = [];
    let pattern8 = [];
    let pattern9 = [];
    let pattern10 = [];
    let pattern11 = [];
    let pattern12 = [];
    let pattern13 = [];
    let pattern14 = [];
    let pattern15 = [];
    let pattern16 = [];
    let ebspeedx = 0.5;
    let ebspeedy = 2;
    // variables pour les balles qui tirent vers le joueur
    let homingBulAccel = 1.6;
    let bDistx = 0;
    let bDisty = 0;
    let bDist = 0;

    function afficher()
    {
        // redéfinition de la vitesse en pixels/sec sur les 10 premiere frames pour une vitesse constante
        if (defineTime < 15) {
            tnow = performance.now();
            sec = (tnow - t0) / 1000;
            t0 = tnow;
            pvx = 100*sec;
            pvy = 100*sec;
            evx = 120*sec;
            evy = 120*sec;
            pbspeedy = 300*sec;
            ebspeedx = 50*sec;
            ebspeedy = 100*sec;
            defineTime += 1;
        }
        
        // début du timer
        if (countDown == -1)
        {
            countDown = setInterval(countDownTimer, 1000);
            countDownTimer();
        }

        // fond
        bg.drawImage(bgSprite, bgSpritex, bgSpritey, bgSpriteSizex, bgSpriteSizey, 0, 0, W, H);

        // clear des zones
        ctxScore.fillStyle = "white";
        ctxScore.clearRect(0, 0, W, 80)
        boss.clearRect(0, 0, W, H);
        bul.clearRect(0, 0, W, H);
        play.clearRect(0, 0, W, H)
    
        // gestion des patternes
        gestionPatternes();
    
        // mouvement et collisions joueur
        playerMovement();
    
        wallCollision();
    
        ennemyPlayerCollision();
    
        // affichage joueur
        play.drawImage(pSprite, pSpritex, pSpritey, pSpriteSize, pSpriteSize, (px - (pSpriteHitbox - pHitbox)), (py - (pSpriteHitbox - pHitbox)), pSpriteHitbox*2, pSpriteHitbox*2);

        // affichage hitbox joueur
        // play.fillStyle = "white";
        // play.fillRect((px), (py), pHitbox*2, pHitbox*2);

        // mouvement ennemy
        ennemyMovement();
    
        // affichage hitbox ennemy
        // boss.fillRect((ex), (ey), eHitbox*2, eHitbox*2);

        //affichage ennemy
        boss.drawImage(eSprite, eSpritex, eSpritey, eSpriteSize, eSpriteSize, (ex - (eSpriteHitbox - eHitbox)), (ey - ((eSpriteHitbox/2) - eHitbox)), eSpriteHitbox*2, eSpriteHitbox*2);
    
        setTimeout(() => {
            if (ptimer == -1)
            {
                ptimer = setInterval(playerBullets, fRate)
                playerBullets();
            }
        }, 50);
    
        playerShoot();
    
        // timer and score
        ctxScore.font = "20px Arial";
        ctxScore.fillText(cdTimer, (W - 40), 30);
        ctxScore.font = "20px Arial";
        ctxScore.fillText(`Score : ${score}`, 10, 30);
    
        if (fin == true){
            gainNode.gain.value = 0;
            window.cancelAnimationFrame(afficher);
            clearGame();
            if (win == true)
                winScreen();
            else if (quit == true)
                gameQuit();
            else
                loseScreen();
        }
        else
            window.requestAnimationFrame(afficher);
    }
    window.addEventListener("deviceorientation", playerControl, true);
    afficher();

    quitButton.addEventListener("click", quitGame);

    // timer
    function countDownTimer()
    {
        if (cdTimer == 0){
            clearInterval(countDown);
            gameWon();
        }
        else
            cdTimer -= 1;
    }

    // sons
    function playSound(sound)
    {
        sound.pause();
        sound.load();
        sound.play();
    }
    function soundDistance(dist)
    {
        if (fin == false)
        {
            freq = (-1 * ((dist / soundDist) * maxFreq)) + maxFreq;
            gainNode.gain.value = approachSoundVolume;
            oscillator.frequency.value = freq;
        }
        else
            gainNode.gain.value = 0;
    }

    // données gyroscope et variables de mouvement
    function playerControl(event)
    {
        let gamma = event.gamma;
        let beta = event.beta;

        // console.log(gamma, beta);

        // activer mouvement
        if (gamma > gammaMove)
            moveRight = true;
        if (gamma < -gammaMove)
            moveLeft = true;
        if (beta < betaForwMove)
            moveForward = true;
        if (beta > betaBackMove)
            moveBack = true;

        // desactiver mouvement
        if (gamma < gammaMove)
            moveRight = false;
        if (gamma > -gammaMove)
            moveLeft = false;
        if (beta > betaForwMove)
            moveForward = false;
        if (beta < betaBackMove)
            moveBack = false;
    }

    // mouvement du joueur
    function playerMovement()
    {
        if (moveRight)
            px += pvx;
        if (moveLeft)
            px -= pvx;
        if (moveForward)
            py -= pvy;
        if (moveBack)
            py += pvy;
    }

    // mouvement de l'ennemi
    function ennemyMovement()
    {
        let eDistx = ex - eTargetx;
        let eDisty = ey - eTargety;

        if (Math.abs(eDistx) > 5)
        {
            if (Math.sign(eDistx) == 1)
                ex -= evx;
            else
                ex += evx;
        }
        if (Math.abs(eDisty) > 5)
        {
            if (Math.sign(eDisty) == 1)
                ey -= evy;
            else
                ey += evy;
        }
    }

    // collisions mur joueur
    function wallCollision()
    {
        if (px < (0 + pSpriteHitbox - pHitbox))
            px = 0 + (pSpriteHitbox - pHitbox);
        if (px > (W - ((pSpriteHitbox * 2) - (pHitbox *2))))
            px = W - ((pSpriteHitbox * 2) - (pHitbox *2));
        if (py < (0 + pSpriteHitbox - pHitbox))
            py = 0 + (pSpriteHitbox - pHitbox);
        if (py > (H - ((pSpriteHitbox * 2) - (pHitbox *2))))
            py = H - ((pSpriteHitbox * 2) - (pHitbox *2));
    }

    // verification de collision joueur
    function bulletCollision(bullet)
    {
        let distx = Math.abs((px + pHitbox) - (bullet.x));
        let disty = Math.abs((py + pHitbox) - (bullet.y));
        let dist = Math.sqrt((distx * distx) + (disty * disty));

        if (dist < soundDist)
            soundDistance(dist);

        else if (dist < soundDist)
            gainNode.gain.value = 0;
        
        if (distx < (pHitbox + pHitbox) && disty < (pHitbox + pHitbox))
            playerHit();
    }

    // collision avec le boss
    function ennemyPlayerCollision()
    {
        let distx = Math.abs((px + pHitbox) - (ex + eHitbox));
        let disty = Math.abs((py + pHitbox) - (ey + eHitbox));

        if (distx < (pHitbox + eHitbox) && disty < (pHitbox + eHitbox))
            playerHit();
    }

    // verification de collision ennemy
    function ennemyCollision(pBullet)
    {
        let distx = Math.abs((ex + eHitbox) - (pBullet.pbx + pbHitbox));
        let disty = Math.abs((ey + eHitbox) - (pBullet.pby + pbHitbox));

        if (distx < (eHitbox + pbHitbox) && disty < (eHitbox + pbHitbox)) {
            let index = pBullets.indexOf(pBullet);
            if (index !== -1)
                pBullets.splice(index, 1);
            ennemyHit();
        }
    }
    function ennemyHit()
    {
        score += gainScore;
        playSound(ennemyDmg)
    }

    // arret du jeu
    function playerHit()
    {
        gainNode.gain.value = 0;

        clearInterval(countDown);

        playSound(plDead);

        fin = true;
        win = false;
        quit = false;
    }
    function gameWon()
    {
        gainNode.gain.value = 0;

        fin = true;
        win = true;
        quit = false;
    }
    function quitGame()
    {
        gainNode.gain.value = 0;

        clearInterval(countDown);

        fin = true;
        win = false;
        quit = true;
    }

    // tir du joueur
    function playerBullets()
    {
        pBullets.push(

            {   
                pbx: px + pHitbox - pbHitbox,
                pby: py,
                pbvy: pbspeedy
            }

        );
    }
    function playerShoot()
    {
        pBullets.forEach(pBullet => {

            pBullet.pby -= pBullet.pbvy;

            bul.fillStyle = "lightgreen";
            bul.fillRect((pBullet.pbx), (pBullet.pby), pbHitbox*2, 6);

            ennemyCollision(pBullet);

            if (pBullet.pby < 0) {
                let index = pBullets.indexOf(pBullet);
                if (index !== -1)
                    pBullets.splice(index, 1);
            }
        });
    }

    function gestionPatternes()
    {
        // push des patternes ennemy
        setTimeout(() => {
            if (pattern1Push == false && fin == false){
                eTargetx = W - 20;
                pushPattern1(); // double triple
                pattern1Push = true;   
            }
        }, 500);
        setTimeout(() => {
            if (pattern2Push == false && fin == false){
                evx = 140*sec;
                eTargetx = 80;
                pushPattern2(); // spray
                pattern2Push = true;
            }
        }, 3000);
        setTimeout(() => {
            if (pattern3Push == false && fin == false){
                evx = 120*sec;
                pushPattern3(); // triple
                pattern3Push = true;
            }
        }, 6000);
        setTimeout(() => {
            if (pattern4Push == false && fin == false){
                eTargetx = W/2;
                pushPattern4(); // doule double
                pattern4Push = true;
            }
        }, 7000);
        setTimeout(() => {
            if (pattern5Push == false && fin == false){
                setTimeout(() => {
                    pushPattern5(); // rond
                }, 1000);
                pattern5Push = true;
            }
        }, 8000);
        setTimeout(() => {
            if (pattern6Push == false && fin == false){
                evx = 150*sec;
                eTargetx = W/5;
                setTimeout(() => {
                    pushPattern6(); // triple gauche
                }, 800);
                pattern6Push = true;
            }
        }, 10000);
        setTimeout(() => {
            if (pattern7Push == false && fin == false){
                eTargetx = W/1.25;
                setTimeout(() => {
                    pushPattern7(); // triple droite
                }, 1500);
                pattern7Push = true;
            }
        }, 11000);
        setTimeout(() => {
            if (pattern8Push == false && fin == false){
                evx = 120*sec;
                eTargetx = W/3;
                pushPattern8(); // spray
                pattern8Push = true;
            }
        }, 13500);
        setTimeout(() => {
            if (pattern9Push == false && fin == false){
                eTargetx = W/4.5;
                setTimeout(() => {
                    pushPattern9(); // triple moins large
                }, 1500);
                pattern9Push = true;
            }
        }, 15000);
        setTimeout(() => {
            if (pattern10Push == false && fin == false){
                eTargetx = W/2;
                pushPattern10(); // homing
                pattern10Push = true;
            }
        }, 19500);
        setTimeout(() => {
            if (pattern11Push == false && fin == false){
                pushPattern11(); // rond
                pattern11Push = true;
            }
        }, 21500);
        setTimeout(() => {
            if (pattern12Push == false && fin == false){
                pushPattern12(); // homing
                pattern12Push = true;
            }
        }, 23000);
        setTimeout(() => {
            if (pattern13Push == false && fin == false){
                evx = 140*sec;
                eTargetx = W/1.25;
                setTimeout(() => {
                    pushPattern13(); // triple droite
                }, 800);
                pattern13Push = true;
            }
        }, 25000);
        setTimeout(() => {
            if (pattern14Push == false && fin == false){
                eTargetx = W/5;
                setTimeout(() => {
                    pushPattern14(); // triple gauche
                }, 1500);
                pattern14Push = true;
            }
        }, 27500);
        setTimeout(() => {
            if (pattern15Push == false && fin == false){
                eTargetx = W/2;
                setTimeout(() => {
                    pushPattern15(); // doule double
                }, 800);
                pattern15Push = true;
            }
        }, 30000);
        setTimeout(() => {
            if (pattern16Push == false && fin == false){
                evx = 120*sec
                setTimeout(() => {
                    pushPattern16(); // triples moins large
                }, 800);
                pattern16Push = true;
            }
        }, 31500);
    
        // mouvement de patternes ennemy
        bulletPattern1();
    
        bulletPattern2();

        bulletPattern3();

        bulletPattern4();

        bulletPattern5();

        bulletPattern6();

        bulletPattern7();

        bulletPattern8();

        bulletPattern9();

        bulletPattern10();

        bulletPattern11();

        bulletPattern12();

        bulletPattern13();

        bulletPattern14();

        bulletPattern15();

        bulletPattern16();
    }

    function homingBullet(bullet)
    {
        bullet.x -= bullet.vx;
        bullet.y -= bullet.vy;
    }

    // push des patternes
    function pushPattern1()
    {
        for (let i = 0; i < nbrPattern1; i++)
        {
            setTimeout(() => {
                pattern1.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern2()
    {
        for (let i = 0; i < nbrPattern2; i++)
        {
            setTimeout(() => {
                pattern2.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
            
                playSound(bulletSound);
    
            }, 150*i);
        }
    }

    function pushPattern3()
    {
        for (let i = 0; i < nbrPattern3; i++)
        {
            setTimeout(() => {
                pattern3.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern4()
    {
        for (let i = 0; i < nbrPattern4; i++)
        {
            setTimeout(() => {
                pattern4.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern5()
    {
        for (let i = 0; i < nbrPattern5; i++)
        {
            setTimeout(() => {
                pattern5.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern6()
    {
        for (let i = 0; i < nbrPattern6; i++)
        {
            setTimeout(() => {
                pattern6.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern7()
    {
        for (let i = 0; i < nbrPattern7; i++)
        {
            setTimeout(() => {
                pattern7.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern8()
    {
        for (let i = 0; i < nbrPattern8; i++)
        {
            setTimeout(() => {
                pattern8.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
            
                playSound(bulletSound);
    
            }, 180*i);
        }
    }

    function pushPattern9()
    {
        for (let i = 0; i < nbrPattern9; i++)
        {
            setTimeout(() => {
                pattern9.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern10()
    {
        for (let i = 0; i < nbrPattern10; i++)
        {
            setTimeout(() => {
                bDistx = ex + eHitbox - (px + pHitbox);
                bDisty = ey + eHitbox - (py + pHitbox);
                bDist = Math.sqrt((bDistx * bDistx) + (bDisty * bDisty));
                pattern10.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: (((bDistx / bDist) * ebspeedx) * homingBulAccel) * 2,
                                vy: ((bDisty / bDist) * ebspeedy) * homingBulAccel
                            }
                        ]
                    ]
                );
            
                playSound(bulletSound);
    
            }, 400*i);
        }
    }

    function pushPattern11()
    {
        for (let i = 0; i < nbrPattern11; i++)
        {
            setTimeout(() => {
                pattern11.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern12()
    {
        for (let i = 0; i < nbrPattern12; i++)
        {
            setTimeout(() => {
                bDistx = ex + eHitbox - (px + pHitbox);
                bDisty = ey + eHitbox - (py + pHitbox);
                bDist = Math.sqrt((bDistx * bDistx) + (bDisty * bDisty));
                pattern10.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: (((bDistx / bDist) * ebspeedx) * homingBulAccel) * 2,
                                vy: ((bDisty / bDist) * ebspeedy) * homingBulAccel
                            }
                        ]
                    ]
                );
            
                playSound(bulletSound);
    
            }, 250*i);
        }
    }

    function pushPattern13()
    {
        for (let i = 0; i < nbrPattern13; i++)
        {
            setTimeout(() => {
                pattern13.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern14()
    {
        for (let i = 0; i < nbrPattern14; i++)
        {
            setTimeout(() => {
                pattern14.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    function pushPattern15()
    {
        for (let i = 0; i < nbrPattern15; i++)
        {
            setTimeout(() => {
                pattern15.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 500*i);
        }
    }

    function pushPattern16()
    {
        for (let i = 0; i < nbrPattern16; i++)
        {
            setTimeout(() => {
                pattern16.push(
                    [
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ],
                        [
                            {   
                                x: ex + eHitbox,
                                y: ey + eHitbox,
                                vx: ebspeedx/2,
                                vy: ebspeedy
                            }
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
    }

    // affichage des patternes
    function bulletPattern1()
    {
        pattern1.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern2()
    {
        pattern2.forEach(straightBullet => {
            straightBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);     

            });
        });
    }

    function bulletPattern3()
    {
        pattern3.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern4()
    {
        pattern4.forEach(doubleBullet => {
            
            doubleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            doubleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });
        });
    }

    function bulletPattern5()
    {
        pattern5.forEach(round => {
            round[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            round[1].forEach(bullet => {

                bullet.y += bullet.vy/1.5;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            round[2].forEach(bullet => {

                bullet.x += bullet.vx*1.5;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[3].forEach(bullet => {

                bullet.y -= bullet.vy/1.5;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[4].forEach(bullet => {

                bullet.y -= bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[5].forEach(bullet => {

                bullet.y -= bullet.vy/1.5;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[6].forEach(bullet => {

                bullet.x -= bullet.vx*1.5;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[7].forEach(bullet => {

                bullet.y += bullet.vy/1.5;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern6()
    {
        pattern6.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern7()
    {
        pattern7.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern8()
    {
        pattern8.forEach(straightBullet => {
            straightBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);     

            });
        });
    }

    function bulletPattern9()
    {
        pattern9.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx/2.5;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx/2.5;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern10()
    {
        pattern10.forEach(straightBullet => {
            straightBullet[0].forEach(bullet => {

                homingBullet(bullet);

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);     

            });
        });
    }

    function bulletPattern11()
    {
        pattern11.forEach(round => {
            round[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            round[1].forEach(bullet => {

                bullet.y += bullet.vy/1.5;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            round[2].forEach(bullet => {

                bullet.x += bullet.vx*1.5;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[3].forEach(bullet => {

                bullet.y -= bullet.vy/1.5;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[4].forEach(bullet => {

                bullet.y -= bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[5].forEach(bullet => {

                bullet.y -= bullet.vy/1.5;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[6].forEach(bullet => {

                bullet.x -= bullet.vx*1.5;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });

            round[7].forEach(bullet => {

                bullet.y += bullet.vy/1.5;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern12()
    {
        pattern12.forEach(straightBullet => {
            straightBullet[0].forEach(bullet => {

                homingBullet(bullet);

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);     

            });
        });
    }

    function bulletPattern13()
    {
        pattern13.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern14()
    {
        pattern14.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }

    function bulletPattern15()
    {
        pattern15.forEach(doubleBullet => {
            
            doubleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            doubleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });
        });
    }

    function bulletPattern16()
    {
        pattern16.forEach(tripleBullet => {
            
            tripleBullet[0].forEach(bullet => {

                bullet.y += bullet.vy;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[1].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x += bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet);

            });

            tripleBullet[2].forEach(bullet => {

                bullet.y += bullet.vy;
                bullet.x -= bullet.vx;

                bul.drawImage(bulletImg, bImgx, bImgy, bImgSize, bImgSize, (bullet.x - bHitbox), (bullet.y - bHitbox), bHitbox*2, bHitbox*2);

                bulletCollision(bullet); 

            });
        });
    }
}

document.querySelectorAll(".start").forEach(e => {
    e.addEventListener("click", startGame);
});

document.querySelector(".toStory").addEventListener("click", startStory);


function clearGame()
{
    showScore.classList.add("invisible");
    background.classList.add("invisible");
    ennemy.classList.add("invisible");
    bullets.classList.add("invisible");
    player.classList.add("invisible");
    quitButton.classList.add("invisible");
}

function winScreen()
{
    winSound.pause();
    winSound.load();
    winSound.play();
    winningScreen.classList.remove("invisible");
    startScreen.classList.add("invisible");
}

function gameQuit()
{
    startScreen.classList.remove("invisible");
}

function loseScreen()
{
    losingScreen.classList.remove("invisible");
}

// histoire
const storyDiv = document.querySelector(".dialogueBox");
const animDiv = document.querySelector(".animTxt");
const speakerDiv = document.querySelector(".speaker");
const imgSpeaker = document.querySelector(".imgSpeaker");

let clickCount = 0;

function startStory()
{
    winningScreen.classList.add("invisible");
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
        character: "",
        text: "You easily defeat the thief in the duel."
    },
    {
        character: "You",
        text: "Give back the paintings you stole right now !"
    },
    {
        character: "Thief",
        text: "Fine you win take your paintings and let us go now."
    },
    {
        character: "",
        text: "You take the paintings back from the thieves and watch them run away."
    },
    {
        character: "You",
        text: "I should go back to the museum to give these paintings back to them right now."
    },
    {
        character: "",
        text: "You quickly head back to the museum and talk to the staff."
    },
    {
        character: "Museum staff",
        text: "Thank you so much for bringing back the paintings !"
    },
    {
        character: "You",
        text: "No problem I can help you put them back to their place too if you don't mind."
    },
    {
        character: "Museum staff",
        text: "Sure we wouldn't mind a bit of help !"
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
cheatButton.addEventListener("click", cheatCode);

function cheatCode()
{
    if (cheat.value == "mmi")
        winScreen();
}