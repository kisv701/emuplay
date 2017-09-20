/**
 * Created by Kim on 2017-08-17.
 */


var x_val =  6000, y_val = 16000, z_val = 16000;
var x_textBox,y_textBox,z_textBox;
var x_range,y_range,z_range;
var buttons = [];

function initialize() {

    //Get input items
    x_textBox = document.getElementById("x_txt");
    y_textBox = document.getElementById("y_txt");
    z_textBox = document.getElementById("z_txt");
    x_range = document.getElementById("x_range");
    y_range = document.getElementById("y_range");
    z_range = document.getElementById("z_range");
    x_range.addEventListener("change",sliderChangedCallback);
    y_range.addEventListener("change",sliderChangedCallback);
    z_range.addEventListener("change",sliderChangedCallback);
    for(var i=0; i < 8;i++) {
        var btn = document.createElement('input');
        btn.setAttribute('type', 'checkbox');
        btn.setAttribute('name', String(i+1));
        btn.addEventListener("change", buttonChangedCallback);
        buttons.push(0);
        document.getElementById("buttons_container").appendChild(btn);
    }
    update();
}

function sliderChangedCallback(evt){
    var evt_axis = String(evt.target.id)[0];
    switch (evt_axis){
        case 'x':
            x_val = evt.target.value;
            break;
        case 'y':
            y_val = evt.target.value;
            break;
        case 'z':
            z_val = evt.target.value;
            break;

    }
    update();
    sendData();
}

function buttonChangedCallback(evt){
    var evt_name = String(evt.target.name)[0];
    switch (evt_name){
        case '1':
            buttons[0] = 1 - buttons[0];
            break;
        case '2':
            buttons[1] = 1 - buttons[1];
            break;
        case '3':
            buttons[2] = 1 - buttons[2];
            break;
        case '4':
            buttons[3] = 1 - buttons[3];
            break;
        case '5':
            buttons[4] = 1 - buttons[4];
            break;
        case '6':
            buttons[5] = 1 - buttons[5];
            break;
        case '7':
            buttons[6] = 1 - buttons[6];
            break;
        case '8':
            buttons[7] = 1 - buttons[7];
            break;

    }
    sendData();
}

function update() {
    x_range.value = x_val;
    y_range.value = y_val;
    z_range.value = z_val;
    x_textBox.value = x_val;
    y_textBox.value = y_val;
    z_textBox.value = z_val;

}

function sendData() {
    var dataString = "1:";
    dataString += x_val + ":" + y_val + ":" + z_val;
    for(var i=0; i < buttons.length; i++){
        dataString += ":" + buttons[i];
    }

    socket.emit('controller-state',dataString);
}