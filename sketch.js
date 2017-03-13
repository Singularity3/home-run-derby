// P5 STUFF
var xMo, yMo, zMo, spd;
var s1 = false;
var s2 = false;
var thrown = false;
var swung = false;
var thrS = false;
var bSize = 30;
var swVal = 50;
var dev = 0;
var count = 0;
var swingmode = 0;
var ballsRemaining = 10;
var hit = 0;
var spd = 0;
var parax, paray, parxm, parym, dist;
var distTot=0;
var pitchSpd;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);
    textSize(50);
}

function draw() {
    if(dev == 1) {
        if(ballsRemaining > 0){
        background(80, 255, 80);
        
        noFill();
        
        strokeWeight(20);
        stroke(255);
        line(windowWidth/2, windowHeight, -10, 300);
        line(windowWidth/2, windowHeight, windowWidth+10, 300);
        
        strokeWeight(1);
        stroke(0);
        fill(50);
        rect(0, 0, windowWidth, 300);
        fill(150, 150, 250);
        ellipse(windowWidth/2, -50, windowWidth, 300);
        stroke('rgba(255, 0, 0, 0.8)');
        noFill();
        strokeWeight(20);
        ellipse(windowWidth/2, windowHeight/2, 390, 390);
        strokeWeight(1);
        stroke(0);
        fill(255);
        
        if(thrown){
            ellipse(windowWidth/2, windowHeight/2, bSize, bSize);
            bSize += bSize/pitchSpd;
        }
        if(!thrown&&random(count)>=300) {
            socket.emit('throw');
            bSize = 30;
            swung = false;
            thrown = true;
            swingmode = 0;
            spd = 0;
            pitchSpd = random(40, 60);
        }
        if(!thrown) {
            count++;
        }
            
            switch(swingmode){
                case 1:
                    text("HIT", windowWidth/2, 200);
                    ellipse(parax, paray, bSize, bSize);
                    bSize -= bSize/40;
                    parax += parxm;
                    paray += parym;
                    count = 0;
                    dist = spd*5;
                    if(parym >= 3){
                        distTot += dist;
                        swingmode = 4;
                    }
                    parym += 3/spd;
                    console.log(spd);
                    break;
                    
                case 2:
                    text("TOO SLOW", windowWidth/2, 200);
                    break;
                    
                case 3:
                    text("TOO FAST", windowWidth/2, 200);
                    break;
                    
                case 4:
                    text("FEET: " + dist);
                    break;
                    
            }
            
            text("Hits: " + hit, windowWidth-100, 50);
            text("Left: " + ballsRemaining, 100, 50);
            text("Total Distance: " + distTot, windowWidth/2, 50);
            
        }
        else {
            background(0);
            fill(255);
            text("Game over, your score is " + hit, windowWidth/2, windowHeight/2);
        }
        if(bSize > 600){
            bSize = 30;
            swingmode = 2;
            swung = true;
            thrown = false;
            ballsRemaining--;
            count = 0;
        }
        
    }
    
    if(dev == 2) {
    
    }
}

function init(){
    
    function deviceMotion(event) {
        var acc = event.acceleration;
        xMo = acc.x;
        yMo = acc.y;
        zMo = acc.z;
        
        spd = xMo;
        if(spd > swVal) {
            s1 = true;
        }
        if(-1*spd > swVal) {
            s2 = true;
        }
        
        if(s1||s2) {
            s1 = false;
            s2 = false;
            socket.emit('swing', xMo);
        }
        
    }
    
    window.addEventListener('devicemotion', deviceMotion, true);
    
}
window.addEventListener('load', init);

function swing(speed) {
    if(spd<abs(speed)){
        spd = abs(speed);
    }
    if(!swung&&thrown){
    if(bSize<350){
        swingmode = 3;
        console.log('fast');
    }
    else if(bSize>450) {
        swingmode = 2;
        console.log('slow');
    }

    else{
        swingmode = 1;
        hit++;
        parax = windowWidth/2;
        paray = windowHeight/2;
        parxm = random(-2, 2);
        parym = -6;
        console.log('hit');
    }
    swung = true;
    thrown = false;
    ballsRemaining--;
    count = 0;
}
}

function start(player){
    dev = player;
}