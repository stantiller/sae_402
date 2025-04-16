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

// oscillateur
const approachSound = new AudioContext();
const oscillator = approachSound.createOscillator();
const gainNode = approachSound.createGain();
oscillator.connect(gainNode);
gainNode.connect(approachSound.destination);
oscillator.start();
gainNode.gain.value = 0;

function startGame()
{
    // display
    showScore.classList.remove("invisible");
    background.classList.remove("invisible");
    ennemy.classList.remove("invisible");
    bullets.classList.remove("invisible");
    player.classList.remove("invisible");
    startScreen.classList.add("invisible");
    losingScreen.classList.add("invisible");
    winningScreen.classList.add("invisible");

    // variables de contexte
    let ctxScore = showScore.getContext("2d");
    let bg = background.getContext("2d");
    let boss = ennemy.getContext("2d");
    let bul = bullets.getContext("2d");
    let play = player.getContext("2d");

    // score et timer du jeu
    let score = 0;
    let gainScore = 100
    let countDown = -1;
    let cdTimer = 45;
    let t0 = performance.now();
    let tnow = 0;
    let sec = 0;
    let defineTime = 0

    // fin du jeu gagne ou non
    let fin = false;
    let win = false;

    // player
    const pSprite = new Image();
    pSprite.src = "../img/game2/sprite.png";
    let pSpriteHitbox = 40/2;
    let pSpritex = 0;
    let pSpritey = 0;
    let pSpriteSize = 105;
    let moveRight = false;
    let moveLeft = false;
    let moveForward = false;
    let moveBack = false;
    let pHitbox = 12/2;
    let px = W/2 - pHitbox;
    let py = H-200;
    let pvx = 2;
    let pvy = 2;
    let gammaMove = 5;
    let betaForwMove = 10;
    let betaBackMove = 35;

    // ennemy
    let eHitbox = 25/2;
    let ex = W/2 - eHitbox;
    let ey = 80;
    let evx = 2.5;
    let evy = 2;
    let eTargetx = ex;
    let eTargety = ey;

    // sons
    const plDead = new Audio('../sounds/game2/pldead00.wav');
    const bulletSound = new Audio('../sounds/game2/tan02.wav');
    const ennemyDmg = new Audio('../sounds/game2/damage00.wav');
    plDead.volume = 0.25;
    bulletSound.volume = 0.25;
    ennemyDmg.volume = 0.15;
    approachSoundVolume = 0.35;
    let soundDist = 250;
    let maxFreq = 1500;
    let freq = 0;
    gainNode.gain.value = 0;
    // js audio api sine wave
    // https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode

    //player bullets
    let pBullets = []
    let pbHitbox = 4/2;
    let ptimer = -1;
    let fRate = 200;
    let pbspeedy = 4;

    // bullets sprite and coordinates
    const bulletImg = new Image();
    bulletImg.src = "../img/game2/bullet_sprite_sheet.png";
    let bImgx = 338;
    let bImgy = 73;
    let bImgSize = 16;

    // bullets and patterns
    const nbrPattern1 = 2;
    const nbrPattern2 = 5;
    const nbrPattern3 = 1;
    const nbrPattern4 = 2;
    const nbrPattern5 = 1;
    const nbrPattern6 = 1;
    const nbrPattern7 = 1;
    const nbrPattern8 = 8;
    const nbrPattern9 = 1;
    const nbrPattern10 = 1;
    let bHitbox = 14/2;
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
    let ebspeedx = 0.5;
    let ebspeedy = 2;
    // let xValue = 200;
    

    // Xvalue = W/2-50;

    function afficher()
    {
        // redéfinition de la vitesse en pixels/sec sur les 10 premiere frames pour une vitesse constante
        if (defineTime < 10) {
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

        // fond et clear de toutes les zones
        bg.fillStyle = "skyblue";
        bg.fillRect(0, 0, W, H);
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
        play.fillStyle = "white";
        play.fillRect((px), (py), pHitbox*2, pHitbox*2);

        // mouvement ennemy
        ennemyMovement();
    
        //affichage ennemy
        boss.fillRect((ex), (ey), eHitbox*2, eHitbox*2);
    
        setTimeout(() => {
            if (ptimer == -1)
            {
                ptimer = setInterval(playerBullets, fRate)
                playerBullets();
            }
        }, 50);
    
        playerShoot();
    
        // timer and score
        ctxScore.clearRect(0, 0, W, H)
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
            else
                loseScreen();
        }
        else
            window.requestAnimationFrame(afficher);
    }
    window.addEventListener("deviceorientation", playerControl, true);
    afficher();

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
        // if (eMoveRight == true)
            // ex += evx;
        // if (eMoveLeft ==true)
            // ex -= evx;

        let eDistx = ex - eTargetx;
        let eDisty = ey - eTargety;

        if (Math.abs(eDistx) > 5)
        {
            if (Math.sign(eDistx) == 1)
            {
                ex -= evx;
            }
            else
            {
                ex += evx;
            }
        }
        if (Math.abs(eDisty) > 5)
        {
            if (Math.sign(eDisty) == 1)
            {
                ey -= evy;
            }
            else
            {
                ey += evy;
            }
        }
    }

    // collisions mur joueur
    function wallCollision()
    {
        if (px < 0)
            px = 0;
        if (px > (W - (pHitbox * 2)))
            px = W - (pHitbox * 2);
        if (py < 0)
            py = 0;
        if (py > (H - (pHitbox * 2)))
            py = H - (pHitbox * 2);
    }

    // verification de collision joueur
    function bulletCollision(bullet)
    {
        let distx = Math.abs((px + pHitbox) - (bullet.x));
        let disty = Math.abs((py + pHitbox) - (bullet.y));
        let dist = Math.sqrt((distx * distx) + (disty * disty));

        if (dist < soundDist) {
            soundDistance(dist);
        }
        else if (dist < soundDist) {
            gainNode.gain.value = 0;
        }
        if (distx < (pHitbox + pHitbox) && disty < (pHitbox + pHitbox)) {
            playerHit();
        }
    }

    // collision avec le boss
    function ennemyPlayerCollision()
    {
        let distx = Math.abs((px + pHitbox) - (ex + eHitbox));
        let disty = Math.abs((py + pHitbox) - (ey + eHitbox));

        if (distx < (pHitbox + eHitbox) && disty < (pHitbox + eHitbox)) {
            playerHit();
        }
    }

    // verification de collision ennemy
    function ennemyCollision(pBullet)
    {
        let distx = Math.abs((ex + eHitbox) - (pBullet.pbx + pbHitbox));
        let disty = Math.abs((ey + eHitbox) - (pBullet.pby + pbHitbox));

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
    }
    function gameWon()
    {
        gainNode.gain.value = 0;

        fin = true;
        win = true;
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

    function gestionPatternes()
    {
        // push des patternes ennemy
        setTimeout(() => {
            if (pattern1Push == false && fin == false){
                eTargetx = W - 20;
                pushPattern1();
                pattern1Push = true;   
            }
        }, 500);
        setTimeout(() => {
            if (pattern2Push == false && fin == false){
                evx = 140*sec;
                eTargetx = 80;
                pushPattern2();
                pattern2Push = true;
            }
        }, 3000);
        setTimeout(() => {
            if (pattern3Push == false && fin == false){
                evx = 120*sec;
                pushPattern3();
                pattern3Push = true;
            }
        }, 6000);
        setTimeout(() => {
            if (pattern4Push == false && fin == false){
                eTargetx = W/2;
                pushPattern4();
                pattern4Push = true;
            }
        }, 7000);
        setTimeout(() => {
            if (pattern5Push == false && fin == false){
                setTimeout(() => {
                    pushPattern5();
                }, 1000);
                pattern5Push = true;
            }
        }, 8000);
        setTimeout(() => {
            if (pattern6Push == false && fin == false){
                evx = 150*sec;
                eTargetx = W/5;
                setTimeout(() => {
                    pushPattern6();
                }, 800);
                pattern6Push = true;
            }
        }, 10000);
        setTimeout(() => {
            if (pattern7Push == false && fin == false){
                eTargetx = W/1.25;
                setTimeout(() => {
                    pushPattern7();
                }, 1500);
                pattern7Push = true;
            }
        }, 11000);
        setTimeout(() => {
            if (pattern8Push == false && fin == false){
                evx = 120*sec;
                eTargetx = W/3;
                pushPattern8();
                pattern8Push = true;
            }
        }, 13500);
    
        // mouvement de patternes ennemy
        bulletPattern1();
    
        bulletPattern2();

        bulletPattern3();

        bulletPattern4();

        bulletPattern5();

        bulletPattern6();

        bulletPattern7();

        bulletPattern8();
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
        ebspeedx = 25*sec;
        for (let i = 0; i < nbrPattern4; i++)
        {
            setTimeout(() => {
                pattern4.push(
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
                        ]
                    ]
                );
                playSound(bulletSound);
            }, 800*i);
        }
        ebspeedx = 50*sec;
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
}

document.querySelectorAll(".start").forEach(e => {
    e.addEventListener("click", startGame);
});


function clearGame()
{
    showScore.classList.add("invisible");
    background.classList.add("invisible");
    ennemy.classList.add("invisible");
    bullets.classList.add("invisible");
    player.classList.add("invisible");
}

function winScreen()
{
    winningScreen.classList.remove("invisible");
}

function loseScreen()
{
    losingScreen.classList.remove("invisible");
}


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