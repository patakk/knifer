let canvas;
var pg, click;


var N;
var W;
var D;
var CD;

var reset = knifer;

let helvetica;
let blurShader;

var shouldReset = true;

var firstClick = false;

function preload() {
    helvetica = loadFont('assets/HelveticaNeueBd.ttf');
    blurShader = loadShader('assets/blur.vert', 'assets/blur.frag');

}

function setup(){
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    pg = createGraphics(width, height);
    click = createGraphics(width, height);

    canvas.elt.addEventListener('touchstart', handleStart);
    canvas.elt.addEventListener('touchend', handleEnd);

    click.colorMode(HSB, 100);
    click.background(10);
    click.textFont(helvetica);
    click.textAlign(CENTER, CENTER);
    click.fill(90);
    if(width < height)
        click.textSize(160);
    else
        click.textSize(200);
    click.text('Click', width/2, height/2);
}
var firstReset = true;

function draw(){
    if(shouldReset || frameCount == 2){
        reset();
        shouldReset = false;
    }

    if(!firstClick && millis() > 3400 && millis() < 3900){
        shaderOnCanvas(click);
    }
    else{
        shaderOnCanvas(pg);

    }


    //print(pg)
    //image(pg, -width/2, -height/2, width, height);
}

function notWorking(){
    randomSeed(random(millis()));
    noiseSeed(random(millis()*12.314));
    pg.colorMode(HSB, 100);
    pg.rectMode(CENTER);
    pg.background(90);

    var wwidth = min(width, height) * 0.6;
    var wheight = wwidth;

    pg.stroke(20);
    pg.noFill();
    pg.push();
    pg.translate(width/2, height/2);
    pg.rect(0, 0, wwidth, wheight);

    N = round(mouseY/height*80) + 3;
    pg.noStroke();
    pg.fill(10);
    //pg.stroke(0);
    //pg.fill(0, 100, 100);

    var Ny = N;
    for(var ny = 0; ny < Ny; ny++){
        var ddy = wheight/Ny;
        var y = map(ny, 0, N-1, ddy/2, wheight-ddy/2) - wheight/2;

        var Nx = ny+2;
        var ddx = wwidth/Nx;
        for(var nx = 0; nx < Nx; nx++){
            if(Nx == 1){
                pg.rect(0, y, ddy+.35, ddy+.35);
            }
            else{
                var x = map(nx, 0, Nx-1, ddx/2, wwidth-ddx/2) - wwidth/2;
                x = x + frameCount/30. * ddx;
                x = (x+wwidth/2)%(wwidth) - wwidth/2;
                pg.stroke(90);
                pg.noStroke();
                pg.fill(90);
                pg.fill(3, 100, 100);
                if(x-ddy/4-(ddy+.35+ddy/2)/2 > -wwidth/2 && x-ddy/4+(ddy+.35+ddy/2)/2 < +wwidth/2)
                    pg.rect(x-ddy/4, y, ddy+.35, ddy+.35);
                pg.fill(10);
                if(x-(ddy+.35)/2 > -wwidth/2 && x+(ddy+.35)/2 < +wwidth/2)
                    pg.rect(x, y, ddy+.35, ddy+.35);
            }
        }
    }

    pg.pop();

    shaderOnCanvas(pg);
}

function krugovi(){
    randomSeed(random(millis()));
    noiseSeed(random(millis()*12.314));
    pg.colorMode(HSB, 100);
    pg.rectMode(CENTER);
    pg.background(90);

    var wwidth = min(width, height) * 0.6;
    var wheight = wwidth;

    pg.stroke(20);
    pg.noFill();
    pg.push();
    pg.translate(width/2, height/2);
    pg.rect(0, 0, wwidth, wheight);

    N = round(random(3))*0+13;
    for(var k = 0; k < N; k++){
        var ri = round(random(5))*0;
        if(ri == 0){
            var nn = 3;
            nn = ceil(nn/2)*2;
            var x = round(random(0, nn-1))/(2-1.)*wwidth/nn - (nn-1)/2*wwidth/nn;
            var y = round(random(0, nn-1))/(2-1.)*wheight/nn - (nn-1)/2*wheight/nn;
            var w = 20;
            var h = 20;
            if(y>0){
                h = (wheight/2 - y)*2;
            }
            else{
                h = (y - (-wheight/2))*2;
            }
            if(x>0){
                w = (wwidth/2 - x)*2;
            }
            else{
                w = (x - (-wwidth/2))*2;
            }
            var d = min(w, h);


            if(random(100) < 90){
                if(random(100) < 50){
                    if(random(100) < 50){
                        pg.fill(10);
                        pg.noStroke();
                    }
                    else{
                        pg.fill(90);
                        pg.stroke(10);
                    }
                }
                else{
                    pg.noFill();
                    pg.stroke(10);
                }
                pg.ellipse(x, y, d+.0, d+.0);
            }
            else {
                pg.fill(10);
                pg.noStroke();
                pg.rect(x, y, d+.0, d+.0);
            }  
        }
    }

    pg.pop();

    shaderOnCanvas(pg);
}

function simpleKnifer(){
    randomSeed(random(millis()));
    noiseSeed(random(millis()*12.314));
    pg.colorMode(HSB, 100);

    var total = random(0.3, 0.8)*width;
    W = min(height, width)*random(0.067, 0.19);
    D = min(width, height)*0.015*random(0.5, 1.2);
    total = (floor(total/(W+D))+1.0)*(W+D);
    N = total/(W+D);
    var tw = N*W + (N-1.)*D;
    H = min(width, height)*random(0.4, 0.6);


    pg.background(100);
    
    pg.fill(0);
    pg.rectMode(CENTER);
    var frq = random(0.01, 2);
    var yy = [];
    var sfrq = PI/3*1;
    for(var k = 0; k < N; k++){
        var p = map(k, 0, N-1, 0, 1);

        var dy = (height-H)/2 * 0.8 * (-1 + 2*noise(k*frq));

        dy = height*0.1*sin((k)*sfrq);

        var x = width/2 - ((N-1.)/2. - k)*(W+D);
        var y = height/2 + dy;
        var hh = H;
        var dd = D * random(0.8, 1.05);
        if(k > 0){
            if(k%2 == 1){
                var ddy = y-hh/2 - yy[k-1][1];
                y -= ddy/2;
                hh += ddy;
            }
            else{
                var ddy = y+hh/2 - yy[k-1][0];
                y -= ddy/2;
                hh -= ddy;
            }

            var cx = (x + width/2 - ((N-1.)/2. - (k-1))*(W+D))/2;
            var cy;

            if(k%2 == 1){
                cy = y - hh/2 + dd/2;
            }
            else{
                cy = y + hh/2 - dd/2;
            }
            //pg.fill(0,100,100);
            pg.rect(cx, cy, 2*dd, dd);
        }
        yy.push([y+hh/2, y-hh/2]);
        pg.fill(0);
        pg.rect(x, y, W, hh);
    }

    //pg.fill(0, 80, 90);
    //pg.noStroke();
    //pg.ellipse(width/2, height/2, 20, 20);

    shaderOnCanvas(pg);
}

function knifer(){

    randomSeed(random(millis()));
    noiseSeed(random(millis()*12.314));

    
    blurShader.setUniform('texelSize', [1 / width, 1 / height]);
    blurShader.setUniform('grunge', random(1.6));
    blurShader.setUniform('grunge2', random(0.3, 0.6));
    blurShader.setUniform('frq1', random(0.003, 0.008));
    blurShader.setUniform('frq2', random(0, 1));
    blurShader.setUniform('frq3', random(0, 1));
    blurShader.setUniform('frq4', random(0, 1));
    blurShader.setUniform('frq5', random(0, 1));
    blurShader.setUniform('frq6', random(0, 1));

    pg.colorMode(HSB, 100);
    var bw = round(random(1)) == 0;
    while(true){
        N = round(random(4, 20));
        if(width < height)
            N = round(random(3, 7));
        W = min(width, height)*0.1*random(0.67, 2.1);
        D = min(width, height)*0.015*random(0.5, 1.2);
        H = min(width, height)*random(0.4, 0.6);

        CD = random(0.023, 0.06);

        var PP = random(100) < 50;
        var p1 = createVector(-W/2, 0);
        var p2 = createVector(+W/2, 0);

        var tw = N*W + (N-1.)*D;
        var ox = width/2 - tw/2 + W/2;
        var oy = height/2 - H/2;

        pg.background(random(75, 85));
        var ff, rr;
        ff = random(90, 100);
        if(bw)
            ff = random(8, 14);
        rr = 1 + (1-bw)*random(0, 2.0);
        var ss = random(3);
        var rw = min(tw, width - random(30, height/4));
        var rh = H;
        var rry = 0;
        if(ss < 1){
            var rrdx = random(28, height/4*0+29);
            var rrdy = rrdx;
            if(random(100) < 50){
                rrdy = random(200, height/3);
                rrdx = random(0, height/3);
            }
            rw = width-rrdx;
            rh = height-rrdy;
        }
        else if(ss < 2){
            rw = width;
            rh = height;
        }
        else{
            rry = random(-height*.1, height*.1);
        }
        pg.fill(40, 0, ff);
        pg.noStroke();
        pg.rectMode(CENTER);
        pg.rect(width/2, height/2 + rry, rw, rh);
        pg.push();
        pg.translate(ox, oy);

        ff = random(8, 14);
        if(bw)
            ff = random(90, 100);
        rr = 1 + bw*random(0, 2.0);
        pg.fill(40, 0, ff);
        pg.noStroke();
        var good = true;
        var dir = 1;
        var frq = N*PI/8*round(random(1, 4));
        for(var k = 0; k < N; k++){
            var amm = random(0.8, 1.17);
            if(PP)
                amm = 1 + .1*sin((k-N/2)*frq)
            pg.beginShape();
            if(abs(p1.y-H/2) > height/2*0.8)
                good = false;

            var skip = false;
            if(p1.x+ox < 80 || p1.x+W+ox > width-80){
                skip = true;
            }
            if(!skip){
                pg.vertex(p1.x, p1.y);
                pg.vertex(p2.x, p2.y);
            }
            p1.add(0, dir*H*amm);
            p2.add(0, dir*H*amm);
            if(abs(p1.y-H/2) > height/2*0.7)
                good = false;
            if(!skip){
                pg.vertex(p2.x, p2.y);
                pg.vertex(p1.x, p1.y);
            }
            // good = true;
            pg.endShape();
            p1.set(p2.x, p2.y);
            p2.add(0, -dir*H*CD);

            if(k == N-1)
                break;

            var conn = true;
            if(random(1000) > 1960)
                conn = false;
            pg.beginShape();
            if(conn && !skip && (p1.x+ox+D+W < width-80)){
                pg.vertex(p1.x-2, p1.y);
                pg.vertex(p2.x-2, p2.y);
            }
            p1.add(D, 0);
            p2.add(D, 0);
            if(conn && !skip && (p1.x+ox+D+W < width-80)){
                pg.vertex(p2.x+2, p2.y);
                pg.vertex(p1.x+2, p1.y);
            }
            if(random(1000) > 1980)
                W = W * random(0.5, 1.4);
            p2.set(p2.x+W, p1.y);
            pg.endShape();
            dir = -dir;
        }
        pg.pop();
        if(good)
            break;
    }

    if(pg.get(40, 35)[0] > 127)
        pg.fill(10);
    else
        pg.fill(90);

    pg.textFont(helvetica);
    pg.textAlign(LEFT, TOP);
    pg.textSize(50);
    pg.text('Knifer', 27, 20);


    // !!!!!!!!!
    // !!!!!!!!!
    // !!!!!!!!!
    // !!!!!!!!!
    // RENDERING
    //shaderOnCanvas(pg);
    //fill(255,0,0);
    //ellipse(width/2, height/2, 20, 20);
}


function shaderOnCanvas(tex){
    blurShader.setUniform('tex0', tex);
    shader(blurShader);
    fill(255);
    rect(-width/2, -height/2, width, height);
}

function mouseClicked(){
    if(width > height){
        shouldReset = true;
    }
    firstClick = true;
}


function handleStart(){
    if(width < height){
        shouldReset = true;
    }
    firstClick = true;
}

function keyPressed(){
    shouldReset = true;
    firstClick = true;
}


function handleEnd(){
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pg = createGraphics(width, height);
    shouldReset = true;
}