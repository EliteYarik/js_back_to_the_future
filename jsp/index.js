document.addEventListener("DOMContentLoaded", function(){
    let startScreen = document.querySelector(".startScreen");
    startScreen.style.display = 'flex';
    let divGameOver = document.querySelector(".gameOver");
    divGameOver.style.display = "none";
    let startButton = document.querySelector(".startButton");
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    let frameCount = 0;
    let speedSpan = document.querySelector(".speed");
    let gameOver = false;
    let healthImg = document.querySelectorAll(".health");
// ----------------------------------------------------
    function Road(src, x, y){
        this.sprite = new Image();
        this.sprite.src = src;
        this.x = x;
        this.y = y;
        this.spriteWidth = 650;
        this.spriteHeight = 500;
    }

    function Car(src, x, y){
        this.sprite = new Image();
        this.sprite.src = src;
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.xSpeed = 0;
        this.spriteWidth = 250;
        this.spriteHeight = 110;
    }

    function Pit(x, y){
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = "img/pit.png";
        this.passed = false;
        this.spriteWidth = 110;
        this.spriteHeight = 110;
    }
// ----------------------------------

    let mainTheme = new Audio("mp3/Back_to_the_Future.mp3");
    let speed = 1;
    let health = 0;
    let startDeleted = false;
    let roads = [];
    let playerCar;
    let pit;
    init();

    function init(){
        health = 3;
        speed = 3;
        divGameOver.style.display = "none";
        gameOver = false
        roads[0] = new Road("img/start.jpg", 0, 0);
        roads[1] = new Road("img/road2.jpg", 600, 0);
        roads[2] = new Road("img/road.jpg", 1200, 0);
        roads[3] = new Road("img/road2.jpg", 1800, 0);
        roads[4] = new Road("img/road.jpg", 2400, 0);
        playerCar = new Car("img/car.png", 50, 170);
        pit = new Pit(700, 250);
    }

    startButton.addEventListener('click', function(){
        let inputName = document.querySelector("input");
        if(inputName.value != null && inputName.value != ""){
            let name = document.querySelector(".name");
            let text = inputName.value;
            name.innerHTML = text;
            startScreen.style.display = 'none';
            mainTheme.play();
            mainTheme.volume = 0.1;
            logic();
        }
        else{
            alert("Введите имя");
        }
    })

    function logic(){
        if(gameOver == false){
            frameCount++;
            if(frameCount == 2){
                frameCount = 0;
                speed += 0.003;
                speedSpan.innerHTML = (speed * 15).toFixed(1) + "m/h"
            }

            for(let i = health; i < healthImg.length; i++){
                healthImg[i].style.display = "none";
            }
            
            for(let i = 0; i < health; i++){
                healthImg[i].style.display = "block";
            }
            if((playerCar.y > 15 && playerCar.ySpeed< 0) ||
            (playerCar.y < 380 && playerCar.ySpeed > 0)){
                playerCar.y += playerCar.ySpeed;
            }
            if((playerCar.x > 0 && playerCar.xSpeed < 0) ||
            (playerCar.x < 400 && playerCar.xSpeed > 0)){
                playerCar.x += playerCar.xSpeed;
            }

            if(!pit.passed &&
                playerCar.x <= pit.x + pit.spriteWidth - 20 &&
                playerCar.x + playerCar.spriteWidth >= pit.x + 20 &&
                playerCar.y <= pit.y + pit.spriteHeight - 20 &&
                playerCar.y + playerCar.spriteHeight >= pit.y + 20){
                    health--;
                    pit.passed = true;
                }

            pit.x -= speed;
            if(pit.x <= -200){
                pit = new Pit(700, Math.random() * 360 + 20);
            }

            for(let i = 0; i < roads.length; i++){
                if(roads[i].x >= -600){
                    roads[i].x -=speed;                   
                }
                else{
                    if(startDeleted){
                        roads[i].x = 1800;
                    }
                    else{
                        roads.splice(i, 1);
                        startDeleted = true;
                    }
                }
            }
            if((speed * 15).toFixed(1) >= 90 || health == 0){
                gameOver = true;
            }
        }
        else{
          mainTheme.pause();
          mainTheme.currentTime = 0;
          divGameOver.style.display = "flex";
          if(health == 0){
              divGameOver.innerHTML = "Вы проиграли!";
              divGameOver.style.color = "red";
              divGameOver.style.backgroundImage = "url(img/badEnding.jpg)";
          } 
          else{
              divGameOver.innerHTML = "Марти вернулся домой!";
              divGameOver.style.color = "green";
              divGameOver.style.backgroundImage = "url(img/goodEnding.jpg";
          } 
        }   
        draw();
        requestAnimationFrame(logic);
    }

    function draw(){
        for(let i = 0; i < roads.length; i++){
            ctx.drawImage(roads[i].sprite, roads[i].x, roads[i].y, roads[i].spriteWidth, roads[i].spriteHeight);
        }
        ctx.drawImage(pit.sprite, pit.x, pit.y, pit.spriteWidth, pit.spriteHeight);
        ctx.drawImage(playerCar.sprite, playerCar.x, playerCar.y, playerCar.spriteWidth, playerCar.spriteHeight);
    }

    document.addEventListener("keydown", function(e){
        switch(e.key){
            case("ArrowUp"):
                playerCar.ySpeed = -5;
                break;
            case("ArrowDown"):
                playerCar.ySpeed = 5;
                break;
            case("ArrowLeft"):
                playerCar.xSpeed = -5;
                break;
            case("ArrowRight"):
                playerCar.xSpeed = 5;
                break; 
        }
    })

    document.addEventListener("keyup", function(e){
        switch(e.key){
            case("ArrowUp"):
                playerCar.ySpeed = 0;
                break;
            case("ArrowDown"):
                playerCar.ySpeed = 0;
                break;
            case("ArrowLeft"):
                playerCar.xSpeed = 0;
                break;
            case("ArrowRight"):
                playerCar.xSpeed = 0;
                break; 
        }
    })

});