    //MAIN SETUP
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;

    const image =  document.getElementById('Player');
    const enemy =  document.getElementById('Enemy');
    const motherShip =  document.getElementById('MotherShip');
    const motherShipHurt =  document.getElementById('MotherShipHurt');
    const bossLaser =  document.getElementById('BossLaser');
    const enemyshoots =  document.getElementById('EnemyShooting');
    const laser = document.getElementById('Laser');
    const enemyLaser = document.getElementById('EnemyLaser');
    const invic = document.getElementById('InviciBubble');
    const lifeUP = document.getElementById('LifeUP');
    const fireUP = document.getElementById('FirePower');
    const enemyDeath1 = document.getElementById('EnemyExplode1');
    const enemyDeath2 = document.getElementById('EnemyExplode2');
    const background = document.getElementById( 'Space');

    let points = 0;
    let lives = 3;
    let isGameRunning = false;
    let unkillable = false;
    let RateOfFire = 300;
    let enemySpeed = 3;
    let scoreMultiplier = 1;
    let enemyProjectileSpeed = 3;
    let Level = 1;
    let amountOfShots = 1;
    let chanceOfPower = 70;
    let gainLifePerStage = 0;
    let waveTillBoss = 5;

    //SOUNDS
    let StartTheGame = new Audio();
    StartTheGame.src = 'Sounds/SpaceAmbience.mp3';
    let BossMusic = new Audio();
    BossMusic.src = 'Sounds/BossMusic.mp3';


    let deathSound = new Audio();
    deathSound.src = 'Sounds/death.wav';
    let motherShipDeathSound = new Audio();
    motherShipDeathSound.src = 'Sounds/MotherShipDeath.mp3';
    let lifeUPSound = new Audio();
    lifeUPSound.src = 'Sounds/lifeUP.mp3';
    let powerUPSound = new Audio();
    powerUPSound.src = 'Sounds/powerUP.mp3';

    let shootLaser  = [];
    let enemyExplode = [];
    for (let i=0;i<5;i++){
        shootLaser[i] = new Audio();
        shootLaser[i].src = 'Sounds/shootLaser.mp3';
        enemyExplode[i] = new Audio();
        enemyExplode[i].src = 'Sounds/boom.mp3';
    }


    //GAME OVER!
    function youLOST(){
        StartTheGame.loop = false;
        StartTheGame.pause();
        isGameRunning = false;
        alert("GAME OVER");
        myButton.style.display = "block";
        myOptions.style.display = "block";

    }

    //CREATE ENEMIES
    let numOfEnemies = 10;
    let Enemy = [];
    function fillEnemies(){
        let offsetXaxis = 10;
        let offsetYaxis = 10;
        for (let i=0;i<numOfEnemies;i++){
            if (i%8 === 0){
                offsetXaxis = 10;
                offsetYaxis += 50;
            }
            Enemy[i] = {
                w:30,
                h:30,
                x:offsetXaxis,
                y:offsetYaxis,
                speed:enemySpeed,
                Direction:true,
                firingMode: false,
                isDead: false
            }
            offsetXaxis +=50;

        }
    }

    function drawEnemy(){
        for (let i=0;i<numOfEnemies;i++)
        {
            if(Enemy[i].isDead === false){
                if(Enemy[i].firingMode === true){
                    ctx.drawImage(enemyshoots, Enemy[i].x, Enemy[i].y, Enemy[i].w, Enemy[i].h);
                    setTimeout(function(){ Enemy[i].firingMode = false; }, 300);
                     }
                 else{
                     ctx.drawImage(enemy, Enemy[i].x, Enemy[i].y, Enemy[i].w, Enemy[i].h);
                    }
                }

        }
    }

    function newEnemyPosition(){
        for (let i=0;i<numOfEnemies;i++) {
            if (Enemy[i].x + Enemy[i].w >= canvas.width) {
                Enemy[i].y += 30;
                Enemy[i].Direction = false;
            } else if (Enemy[i].x <= 0) {
                Enemy[i].y += 30;
                Enemy[i].Direction = true;
            }

            if (Enemy[i].Direction === true) {
                Enemy[i].x += Enemy[i].speed;
            } else {
                Enemy[i].x -= Enemy[i].speed;
            }
        }
    }

    //ENEMY LOOT
    let amountOfPowerUPs = 0;
    let PowerUP = [];

    function isPowerUP(){
        for (let i=0;i<amountOfPowerUPs;i++){
            if (
                PowerUP[i].x >= Player.x &&
                PowerUP[i].x <= Player.x + Player.w &&
                PowerUP[i].y >= Player.y &&
                PowerUP[i].y <= Player.y + Player.h &&
                PowerUP[i].Active === true){

                if (PowerUP[i].typeOfPower === 1){
                    lifeUPSound.play();
                    points+=500;
                    lives++;
                    PowerUP[i].Active = false;
                }
                else if (PowerUP[i].typeOfPower === 2){
                    powerUPSound.play();
                    if (amountOfShots+1 !== 6){
                        amountOfShots++;
                        points+=100;
                    }
                    else{
                        points+=1000;
                    }
                    PowerUP[i].Active = false;
                }

            }



        }
    }
    function generatePower(eX){
        PowerUP[amountOfPowerUPs] = {
            w: 15,
            h: 15,
            x: 0,
            y: 0,
            speed: 2,
            Active: true,
            typeOfPower: 1
        }
        PowerUP[amountOfPowerUPs].x = Enemy[eX].x + Enemy[eX].w / 2 - 5;
        PowerUP[amountOfPowerUPs].y = Enemy[eX].y;
        if (Math.ceil(Math.random() * 5) === 1){
            PowerUP[amountOfPowerUPs].typeOfPower = 1
        }
        else{
            PowerUP[amountOfPowerUPs].typeOfPower = 2;
        }
        amountOfPowerUPs++;
    }
    function drawPower(){
        for (let i=0;i<amountOfPowerUPs;i++){
            if (PowerUP[i].y >= canvas.height) {
                PowerUP[i].Active = false;
            }
            if (PowerUP[i].Active === true) {
                if ( PowerUP[i].typeOfPower === 1){
                    ctx.drawImage(lifeUP, PowerUP[i].x, PowerUP[i].y, PowerUP[i].w, PowerUP[i].h);
                }
                else if
                ( PowerUP[i].typeOfPower === 2){
                    ctx.drawImage(fireUP, PowerUP[i].x, PowerUP[i].y, PowerUP[i].w, PowerUP[i].h);
                }

            }
        }
    }
    function newPowerPosition() {

        for (let i=0;i<amountOfPowerUPs;i++){
            PowerUP[i].y+=PowerUP[i].speed;
        }

    }



    //ENEMY PROJECTILE
    let EnemyShots = 0;
    let InactiveShots = 0;
    let EnemyFire = [];

    function enemyShoot() {
        for (let i = 0; i < numOfEnemies; i++) {

            if ((Math.ceil(Math.random() * RateOfFire) <= 1)  && Enemy[i].isDead===false) {

                EnemyFire[EnemyShots] = {
                    w: 10,
                    h: 20,
                    x: 0,
                    y: 0,
                    speed: enemyProjectileSpeed,
                    Active: false
                }


                EnemyFire[EnemyShots].x = Enemy[i].x + Enemy[i].w / 2 - 5;
                EnemyFire[EnemyShots].y = Enemy[i].y;
                EnemyFire[EnemyShots].Active = true;
                Enemy[i].firingMode = true;

                EnemyShots++;
            }

        }
    }
    function drawEnemyLaser(){

        for (let i=InactiveShots;i<EnemyShots;i++) {
            if (EnemyFire[i].y === 500) {
                EnemyFire[i].Active = false;
            }
            if (EnemyFire[i].Active === true) {
                ctx.drawImage(enemyLaser, EnemyFire[i].x, EnemyFire[i].y, EnemyFire[i].w, EnemyFire[i].h);
            }
        }


    }
    function newEnemyLaserPosition(){
        for (let i=InactiveShots;i<EnemyShots;i++){
            EnemyFire[i].y+=EnemyFire[i].speed;
        }

    }

    function isPlayerHIT(){
        for (let i=InactiveShots;i<EnemyShots;i++){
            if (
                EnemyFire[i].x >= Player.x &&
                EnemyFire[i].x <= Player.x + Player.w &&
                EnemyFire[i].y >= Player.y &&
                EnemyFire[i].y <= Player.y + Player.h &&
                EnemyFire[i].Active === true &&
                unkillable === false){
                if (lives-1 >= 0) {
                    takeDamage();

                }
                else{
                    youLOST();


                }

            }

        }

        for (let i=0;i<numOfEnemies;i++){
            if (Enemy[i].y >= canvas.height-30 && Enemy[i].isDead === false){
                youLOST();
            }
        }


    }


    //PROJECTILE
    function isHIT() {
        for (let j=0;j<LaserShot;j++) {
            for (let i = 0; i < numOfEnemies; i++) {
                if (     Enemy[i].isDead === false &&
                         Laser[j].x >= Enemy[i].x &&
                         Laser[j].x <= Enemy[i].x + Enemy[i].w &&
                         Laser[j].y >= Enemy[i].y && Laser[j].y <= Enemy[i].y + Enemy[i].h &&
                         Laser[j].Active === true )
                {
                    createExplosion(i);
                    Enemy[i].isDead = true;
                    points += 100 * scoreMultiplier;
                    Laser[j].Active = false;
                    enemyExplode[j%5].play();
                    if (Math.ceil(Math.random() * chanceOfPower) <=10){
                            generatePower(i);
                    }


                }
            }
        }

    }


    let LaserShot = 0;
    let CoolDown = false;
    let Laser = [];

    function Shoot(){
        if (CoolDown === false) {

            Laser[LaserShot] = {
                w: 10,
                h: 20,
                x: 0,
                y: 0,
                speed: 4,
                Active: false,
            }

            Laser[LaserShot].x = Player.x + Player.w / 2 - 5;
            Laser[LaserShot].y = Player.y;
            Laser[LaserShot].Active = true;
            shootLaser[LaserShot % 5].play();
            LaserShot++;

            }



    }
    function drawLaser(){
        let count = 0;

        for (let i=0;i<LaserShot;i++) {
            if (Laser[i].y <= 0){
                Laser[i].Active = false;
            }
            if (Laser[i].Active === true) {
                ctx.drawImage(laser, Laser[i].x, Laser[i].y, Laser[i].w, Laser[i].h);
                count++;
            }
        }

        if (count >= amountOfShots){
            CoolDown = true;
        }
        else{
            CoolDown = false;
        }
    }
    function newLaserPosition(){
        for (let i=0;i<LaserShot;i++){
            Laser[i].y-=5;
        }


    }

    //ENEMYDEATH

    let numBooms = 0;
    let Boom = [];
    function createExplosion(eX){
        Boom[numBooms] = {
            w: 40,
            h: 40,
            x: 0,
            y: 0,
            Active: true,
            typeOfBoom: 1
        }
        Boom[numBooms].x = Enemy[eX].x + Enemy[eX].w / 2 - 5;
        Boom[numBooms].y = Enemy[eX].y;
        if (Math.ceil(Math.random() * 2) <= 1){
            Boom[numBooms].typeOfBoom = 1
        }
        else{
            Boom[numBooms].typeOfBoom = 2;
        }
        numBooms++;

    }

    function drawBoom(){

        for (let i=0;i<numBooms;i++){
            if (Boom[i].Active === true) {
                if ( Boom[i].typeOfBoom === 1){
                    ctx.drawImage(enemyDeath1, Boom[i].x, Boom[i].y, Boom[i].w, Boom[i].h);
                }
                else if
                ( Boom[i].typeOfBoom === 2){
                    ctx.drawImage(enemyDeath2, Boom[i].x, Boom[i].y, Boom[i].w, Boom[i].h);
                }
                setTimeout(function(){ Boom[i].Active = false; }, 300);

            }
        }


    }




    //PLAYER CONTROLS AND CREATION
    const Player = {
        w:40,
        h:30,
        x:canvas.width/2-30,
        y:canvas.height-30,
        speed:5,
        dx:0
    }
    function drawPlayer(){
        ctx.drawImage(image,Player.x,Player.y,Player.w,Player.h);
        if (unkillable === true) {
            ctx.drawImage(invic, Player.x - 10, Player.y - 10, Player.w + 20, 20);
        }
    }



    function MovePlayer(){



        if (keys[37]){
            Player.dx=Player.speed*-1;
        }
        else if (keys[39]){
            Player.dx=Player.speed;
        }

        if (Player.x + Player.w >= canvas.width){
            Player.x -= 0.3;
        }
        else if (Player.x <= 0){
            Player.x +=0.3;
        }
        else{
            Player.x += Player.dx;
        }

        Player.dx = 0;

    }




    //ScoreBoard
    function scoreboard(){

        let Result = "Score: " + points;
        ctx.font = "30px VT323";
        ctx.fillStyle= "purple";
        ctx.fillText(Result,20,40);

        let LiveBoard = "Lives: " + lives;
        ctx.font = "30px VT323";
        ctx.fillStyle= "purple";
        ctx.fillText(LiveBoard,370,40);

        if (bossMode === true){
            let BossHealth = "Health: " + Boss.Health;
            ctx.font = "30px VT323";
            ctx.fillStyle= "red";
            ctx.fillText(BossHealth,370,80);
        }

        let LevelBoard = "Level: " + Level;
        ctx.font = "30px VT323";
        ctx.fillStyle= "purple";
        ctx.fillText(LevelBoard,205,40);

    }

    function ifLevelBeaten(){
            let checkIfAllDead = false;
            for (let i=0;i<numOfEnemies;i++){
                if (Enemy[i].isDead===false){
                    checkIfAllDead = true;
                }
            }



            if (checkIfAllDead === false) {

                Level++;
                if (Level%waveTillBoss === 0 ){
                    BossMusic.play();
                    StartTheGame.pause();
                    createBoss();
                }
                else {


                    lives += gainLifePerStage;
                    numOfEnemies += 3;
                    if (numOfEnemies >= 40) {
                        numOfEnemies = 40;
                    }
                    if (RateOfFire >= 200) {
                        RateOfFire -= 10;
                    }
                    enemySpeed += 0.25;
                    if (enemyProjectileSpeed < 6) {
                        enemyProjectileSpeed += 0.25;
                    }
                    LaserShot = 0;
                    EnemyShots = 0;
                    amountOfPowerUPs = 0;
                    InactiveShots = 0;

                    fillEnemies();

                }


                }




    }





    myButton = document.getElementById('StartGame');
    myOptions = document.getElementById('Options');

    Easy = document.getElementById('Easy');
    Medium = document.getElementById('Medium');
    Hard = document.getElementById('Hard');

    function Settings(){
        Easy.style.display = "block";
        Medium.style.display = "block";
        Hard.style.display = "block";
        myButton.style.display = "none";
        myOptions.style.display = "none";
    }
    function EasyMode(){
        Level = 1;
        lives = 3;
        numOfEnemies = 8;
        RateOfFire = 450
        enemySpeed = 1;
        scoreMultiplier = 0.5;
        enemyProjectileSpeed = 1.5;
        gainLifePerStage = 1;
        Easy.style.display = "none";
        Medium.style.display = "none";
        Hard.style.display = "none";
        myButton.style.display = "block";
        myOptions.style.display = "block";
    }
    function MediumMode(){
        Level = 1;
        lives = 3;
        numOfEnemies = 8;
        RateOfFire = 350;
        enemySpeed = 1.5;
        scoreMultiplier = 1;
        enemyProjectileSpeed = 2;
        gainLifePerStage = 0;
        Easy.style.display = "none";
        Medium.style.display = "none";
        Hard.style.display = "none";
        myButton.style.display = "block";
        myOptions.style.display = "block";
    }
    function HardMode(){
        Level = 1;
        lives = 3;
        numOfEnemies = 8;
        RateOfFire = 250;
        enemySpeed = 2;
        scoreMultiplier = 2;
        enemyProjectileSpeed = 3;
        gainLifePerStage = 0;
        Easy.style.display = "none";
        Medium.style.display = "none";
        Hard.style.display = "none";
        myButton.style.display = "block";
        myOptions.style.display = "block";
    }


    MediumMode();
    function beginGame(){
        StartTheGame.play();
        StartTheGame.loop = true;
        points = 0;
        lives = 3;
        isGameRunning = true;
        LaserShot = 0;
        EnemyShots = 0;
        InactiveShots = 0;
        amountOfShots = 1;
        myButton.style.display = "none";
        myOptions.style.display = "none";

        fillEnemies();
        update();
    }

    //MOVEMENT

    const keys = [];

    document.addEventListener('keydown',function(e){
        if (e.keyCode !== 32) {
            keys[e.keyCode] = true;
        }
        else{
            Shoot();
        }
    });
    document.addEventListener('keyup',function(e){
        delete keys[e.keyCode];
    });


    function takeDamage(){
        unkillable = true;
        setTimeout(function(){ unkillable = false; }, 2000);
        lives -= 1;
        /*
        Player.x = canvas.width / 2 - 30;
        Player.y = canvas.height - 30;
        */

        deathSound.play();
        if (amountOfShots > 1){
            amountOfShots--;
        }


    }


    function RegularLogic(){
        drawEnemy();
        drawPower();
        drawBoom();
        drawEnemyLaser();
        enemyShoot();


        newEnemyLaserPosition();
        newPowerPosition();
        newEnemyPosition();


        isHIT();
        isPlayerHIT();
        isPowerUP();
        ifLevelBeaten();

    }


    //Boss Section


    function BossLogic(){
        drawBoss();
        newBossPosition();
        isBossDamaged();
        BossShoot();
        drawBossLaser();
        newBossLaserPosition();
        isPlayerHITbyBoss();
        isBossBeaten();
    }

    let Boss = {};
    let bossMode = false;
    let bossRateOfFire = 100;

    let fasterDecent = 0;
    function createBoss() {
         Boss = {
            w: 237,
            h: 97,
            x: 135,
            y: 50,
            speed: 3,
            descent: 0.1,
            isDead: false,
            DirectionBias: 0,
            isDamaged: false,
            Health: 5
        }
        Boss.descent += fasterDecent;
        bossMode = true;
        Boss.Health = 15 + Level*2;


    }
    function  drawBoss(){
        if (Boss.isDamaged === true){
            ctx.drawImage(motherShipHurt,Boss.x,Boss.y,Boss.w,Boss.h);
            setTimeout(function(){ Boss.isDamaged = false; }, 100);
        }
        else{
            ctx.drawImage(motherShip,Boss.x,Boss.y,Boss.w,Boss.h);
        }

    }
    function newBossPosition(){
        if (Boss.DirectionBias > 0){
            Boss.x+=Boss.speed;
            Boss.DirectionBias--;
        }
        else if (Boss.DirectionBias < 0){
            Boss.x+=Boss.speed*-1;
            Boss.DirectionBias++;
        }

        if (Boss.x + Boss.w >= canvas.width){
            Boss.DirectionBias*=-1;
        }
        else if (Boss.x <= 0){
            Boss.DirectionBias*=-1;
        }


        if (Boss.DirectionBias === 0 && Math.ceil(Math.random() * 2) === 1){
            Boss.DirectionBias = 10;
        }
        else if (Boss.DirectionBias === 0){
            Boss.DirectionBias = -10;
        }

        Boss.y +=Boss.descent;
        Boss

        if (Boss.y >= canvas.height - Boss.h && Boss.isDead === false){
            youLOST();
        }

    }

    function isBossDamaged(){
        for (let j=0;j<LaserShot;j++) {
                if (Boss.isDead === false &&
                    Laser[j].x >= Boss.x &&
                    Laser[j].x <= Boss.x + Boss.w &&
                    Laser[j].y >= Boss.y && Laser[j].y <= Boss.y + Boss.h &&
                    Laser[j].Active === true )
                {
                    Boss.isDamaged = true;
                    Boss.Health--;
                    createExplosion(0);
                    points += 100 * scoreMultiplier;
                    Laser[j].Active = false;
                    enemyExplode[j%5].play();
                }
            }
    }


    let BossShots = 0;
    let BossFire = [];

    function BossShoot(){

        if ((Math.ceil(Math.random() * bossRateOfFire - (Boss.y / 50)) <= 1)  && Boss.isDead===false) {

            BossFire[BossShots] = {
                w: 10,
                h: 40,
                x: 0,
                y: 0,
                speed: 2.5,
                Active: false,
                redLaser: true,
            }

            BossFire[BossShots+1] = {
                w: 10,
                h: 40,
                x: 0,
                y: 0,
                speed: 2.5,
                Active: false,
                redLaser: true
            }

            BossFire[BossShots+2] = {
                w: 10,
                h: 15,
                x: 0,
                y: 0,
                speed: enemyProjectileSpeed,
                Active: false,
                redLaser: false
            }

            BossFire[BossShots+3] = {
                w: 10,
                h: 15,
                x: 0,
                y: 0,
                speed: enemyProjectileSpeed,
                Active: false,
                redLaser: false
            }


            BossFire[BossShots].x = Boss.x + Boss.w / 2 + 80;
            BossFire[BossShots].y = Boss.y+60;
            BossFire[BossShots].Active = true;

            BossFire[BossShots+1].x = Boss.x + Boss.w / 2 - 90;
            BossFire[BossShots+1].y = Boss.y+60;
            BossFire[BossShots+1].Active = true;

            BossFire[BossShots+2].x = Boss.x + Boss.w / 2 + 70;
            BossFire[BossShots+2].y = Boss.y+60;
            BossFire[BossShots+2].Active = true;

            BossFire[BossShots+3].x = Boss.x + Boss.w / 2 - 80;
            BossFire[BossShots+3].y = Boss.y+60;
            BossFire[BossShots+3].Active = true;

            BossShots+=4;
        }


    }


    function  drawBossLaser(){

        for (let i=0;i<BossShots;i++) {
            if (BossFire[i].y === 500) {
                BossFire[i].Active = false;
            }
            if (BossFire[i].Active === true) {
                if (BossFire[i].redLaser === true){
                    ctx.drawImage(bossLaser, BossFire[i].x, BossFire[i].y, BossFire[i].w, BossFire[i].h);
                }
                else{
                    ctx.drawImage(enemyLaser, BossFire[i].x, BossFire[i].y, BossFire[i].w, BossFire[i].h);
                }

            }
        }

    }

    function newBossLaserPosition(){
        for (let i=0;i<BossShots;i++){
            BossFire[i].y+=BossFire[i].speed;
        }
    }


    function isPlayerHITbyBoss(){

        for (let i=0;i<BossShots;i++){
            if (
                BossFire[i].x >= Player.x &&
                BossFire[i].x <= Player.x + Player.w &&
                BossFire[i].y >= Player.y &&
                BossFire[i].y <= Player.y + Player.h &&
                BossFire[i].Active === true &&
                unkillable === false){
                if (lives-1 >= 0) {
                    takeDamage();

                }
                else{
                    youLOST();


                }

            }

        }

        for (let i=0;i<numOfEnemies;i++){
            if (Enemy[i].y >= canvas.height-30 && Enemy[i].isDead === false){
                youLOST();
            }
        }


    }

    function isBossBeaten(){
        if (Boss.Health === 0){
            motherShipDeathSound.play();
            BossMusic.pause();
            StartTheGame.play();
            bossMode = false;
            points += 1500;
            fasterDecent +=0.05;

            lives += gainLifePerStage;
            numOfEnemies += 3;
            if (numOfEnemies >= 40) {
                numOfEnemies = 40;
            }
            if (RateOfFire >= 200) {
                RateOfFire -= 10;
            }
            enemySpeed += 0.25;
            if (enemyProjectileSpeed < 6) {
                enemyProjectileSpeed += 0.25;
            }
            Level++;
            LaserShot = 0;
            BossShots = 0;

            fillEnemies();
        }


    }

    //MAIN LOOP FUNCTION:
    function update(){
        if (isGameRunning === true) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0 ,0);

            scoreboard();

            MovePlayer();
            drawPlayer();
            drawLaser();
            newLaserPosition();

            if (Level%waveTillBoss === 0){
                BossLogic();

            }
            else{
                RegularLogic();
            }

            requestAnimationFrame(update);
        }

    }

