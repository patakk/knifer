let canvas;
var pg;

var blurShader;

var N;
var W;
var D;
var CD;

function preload(){
    blurShader = loadShader('assets/blur.vert', 'assets/blur.frag');
}

function setup(){
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    noLoop();

    reset();
}

function draw(){
    //image(pg, -width/2, -height/2, width, height);
}

function reset(){
    pg = createGraphics(width, height);
    pg.colorMode(HSB, 100);
    var bw = round(random(1)) == 0;
    while(true){
        N = round(random(4, 20));
        W = height*0.1*random(0.67, 2.6);
        D = height*0.015*random(0.5, 1.2);
        H = height*random(0.4, 0.6);

        CD = random(0.023, 0.06);

        var PP = random(100) < 50;
        var d = height * random(0.08, 0.13);
        var p1 = createVector(-W/2, 0);
        var p2 = createVector(+W/2, 0);

        var tw = N*W + (N-1.)*D;
        var ox = width/2 - tw/2 + W/2;
        var oy = height/2 - H/2;

        pg.background(random(83, 90));
        var ff, rr;
        ff = random(90, 100);
        if(bw)
            ff = random(8, 14);
        rr = 1 + (1-bw)*random(0, 2.0);
        var ss = random(3);
        var rw = tw;
        var rh = H;
        var rry = 0;
        if(ss < 1){
            var rrd = random(30, height/4);
            rw = width-rrd;
            rh = height-rrd;
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
            if(abs(p1.x+W/2) > width/2*0.8)
                good = false;

            var skip = false;
            if(p1.x+ox < 20 || p1.x+W+ox > width-20){
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
            if(abs(p1.x+W/2) > width/2*0.8)
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
            if(conn && !skip && (p1.x+ox+D+W < width-20)){
                pg.vertex(p1.x-2, p1.y);
                pg.vertex(p2.x-2, p2.y);
            }
            p1.add(D, 0);
            p2.add(D, 0);
            if(conn && !skip && (p1.x+ox+D+W < width-20)){
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
    // rendering

    shader(blurShader);
    fill(255);
    blurShader.setUniform('tex0', pg);
    blurShader.setUniform('texelSize', [1 / width, 1 / height]);
    blurShader.setUniform('grunge', random(1.6));
    blurShader.setUniform('grunge2', random(0.3, 0.6));
    rect(-width/2, -height/2, width, height);
    //fill(255,0,0);
    //ellipse(width/2, height/2, 20, 20);
}

function reset1(){
    N = round(random(3, 6));
    W = height*0.1*random(0.8, 1.2);
    D = height*0.015*random(0.8, 1.2);

    background(233);
    noStroke();
    fill(0);
    rectMode(CENTER);


    var tw = N*W + (N-1.)*D;
    push();
    translate(width/2, height/2);

    var x0 = -tw/2+W/2;
    var x1 = +tw/2-W/2;
    var co = 0;
    var H = W*5;
    var rd = random(0.7, 0.94);
    var dir = -1;
    for(var i = 0; i < N; i++){
        var x = map(i, 0, N-1, x0, x1);
        dir = -dir;
        if(i < N-1){
            var xx = x + W/2 + D/2;
            var dd = D*rd;
            var yy = dir*(-H/2+dd/2);
            rect(xx, yy, W, dd);
        }
        rect(x, 0, W, H);
        co++;
    }
    pop();
}

function mouseClicked(){
    reset();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pg = createGraphics(width, height);
    reset();
}