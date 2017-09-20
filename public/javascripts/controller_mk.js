/**
 * Created by Kim on 2017-08-18.
 */
var canvas = document.getElementById("canvas");
var w = window.innerWidth;
var h = window.innerHeight;
canvas.setAttribute('width', w/2);
canvas.setAttribute('height', h);
var ctx_joystick = canvas.getContext("2d");
var btnA = document.getElementById("btnA");
var btnB = document.getElementById("btnB");
var btnL = document.getElementById("btnL");
var btnX = document.getElementById("btnX");
var btnZ = document.getElementById("btnZ");
var btnStart = document.getElementById("start");
var divPlayerNumber = document.getElementById("player_number");
var btnState = [0,0,0,0,0,0]; //[start,a,b,l,x,z]
var player_number = 1000;
/**
 * Colors for this controller
 */
var clr = {
    fg: "#59323C",
    mg: "#BFAF80",
    bg: "#F2EEB3"

};

/**
* Joystick-code, some listeners
 */
var startJoyStick = {
    x: NaN,
    y: NaN
};
var currentJoyStick = {
    x: NaN,
    y: NaN
};
var dJoyStick = {
    x: NaN,
    y: NaN
};

var joyStickTouchIndex = 0;
canvas.addEventListener("touchstart", function(e){
    e.preventDefault();
    startJoyStick.x = e.targetTouches[0].clientX;
    startJoyStick.y = e.targetTouches[0].clientY;
}, false);

canvas.addEventListener("touchmove", function(e){
    e.preventDefault();
    currentJoyStick.x = e.targetTouches[0].clientX;
    currentJoyStick.y = e.targetTouches[0].clientY;
    dJoyStick.x = currentJoyStick.x-startJoyStick.x;
    dJoyStick.y = startJoyStick.y-currentJoyStick.y;
    update();
}, false);

canvas.addEventListener("touchend", function(e){
    e.preventDefault();
    startJoyStick.x = NaN;
    startJoyStick.y = NaN;
    currentJoyStick.x = NaN;
    currentJoyStick.y = NaN;
    dJoyStick.x = NaN;
    dJoyStick.y = NaN;
    update();
}, false);

/**
 * Buttons code
 */

btnA.addEventListener("touchstart", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#85754e";
    btnState[1] = 1;
    update();
}, false);

btnB.addEventListener("touchstart", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#85754e";
    btnState[2] = 1;
    update();
}, false);

btnL.addEventListener("touchstart", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#85754e";
    btnState[3] = 1;
    update();
}, false);

btnX.addEventListener("touchstart", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#85754e";
    btnState[4] = 1;
    update();
}, false);

btnZ.addEventListener("touchstart", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#85754e";
    btnState[5] = 1;
    update();
}, false);

btnStart.addEventListener("touchstart", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#85754e";
    btnState[0] = 1;
    update();
}, false);

btnA.addEventListener("touchend", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#BFAF80";
    btnState[1] = 0;
    update();
}, false);

btnB.addEventListener("touchend", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#BFAF80";
    btnState[2] = 0;
    update();
}, false);

btnL.addEventListener("touchend", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#BFAF80";
    btnState[3] = 0;
    update();
}, false);

btnX.addEventListener("touchend", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#BFAF80";
    btnState[4] = 0;
    update();
}, false);

btnZ.addEventListener("touchend", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#BFAF80";
    btnState[5] = 0;
    update();
}, false);

btnStart.addEventListener("touchend", function(e){
    e.preventDefault();
    this.style.backgroundColor = "#BFAF80";
    btnState[0] = 0;
    update();
}, false);

/**
 * Update and drawing code
 */
function update() {
    var x_axis = 32767/2 | 0;
    var y_axis = 32767/2 | 0;
    var z_axis = 32767/2 | 0;
    if(dJoyStick.x) {
        x_axis = 32767/2 + ((dJoyStick.x * 3 * 32767) / w);
        x_axis = Math.min(x_axis, 32767);
        x_axis = Math.max(x_axis, 0) | 0;
    }
    if(dJoyStick.y) {
        y_axis = 32767/2 + ((dJoyStick.y * 3 * 32767) / h);
        y_axis = Math.min(y_axis, 32767);
        y_axis = Math.max(y_axis, 0) | 0;
    }

    var dataString = "";
    dataString += x_axis + ":" + y_axis + ":" + z_axis;
    for(var i=0; i < btnState.length; i++){
        dataString += ":" + btnState[i];
    }

    socket.emit('controller-state',dataString);

    requestAnimationFrame(draw);
}


function draw(){
    ctx_joystick.fillStyle=clr.bg;
    ctx_joystick.fillRect(0,0,w,h);

    if(startJoyStick.x && currentJoyStick.x) {
        circle(ctx_joystick,startJoyStick.x,startJoyStick.y,0.05*w,false);
        circle(ctx_joystick,currentJoyStick.x,currentJoyStick.y,0.04*w,true);
        circle(ctx_joystick,currentJoyStick.x,currentJoyStick.y,0.05*w,false);
    }
}

function circle(ctx,x,y,r,fill){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = clr.fg;

    ctx.lineWidth = 5;
    ctx.strokeStyle = clr.fg;
    ctx.closePath();
    ctx.stroke();
    if(fill) ctx.fill();
}

/**
 * Overlay stuff to make fullscreen.
 */
function remove_overlay(){
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    var el = document.documentElement
        , rfs = // for newer Webkit and Firefox
            el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen
        ;
    if(typeof rfs!="undefined" && rfs){
        rfs.call(el);
    } else if(typeof window.ActiveXObject!="undefined"){
        // for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript!=null) {
            wscript.SendKeys("{F11}");
        }
    }
}

/**
 *  Socket stuff to get what player this client is.
 */
socket.on('connected-players', function(players){
    var prev_player_number = player_number;
    for (var i = 0; i < players.length;i++) {
        if(players[i] == socket.id){
            player_number = i+1;
            break;
        }
    }

    if(prev_player_number != player_number){
        divPlayerNumber.innerHTML = "Player " + player_number;
    }
});

update();