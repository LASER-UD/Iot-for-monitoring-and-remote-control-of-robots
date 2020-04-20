//Varibles Figures
const angle=45;
let iCenter = 0;
let jCenter = 0;	
// caja
let stageBox = new createjs.Stage('box');
let box = new createjs.Shape();
let lineTop = new createjs.Shape();
let lineRight = new createjs.Shape();
let lineBottom = new createjs.Shape();
let lineLeft = new createjs.Shape();

box.graphics.beginFill('#42626F').drawRect(20, 20, 60, 60);
stageBox.addChild(box);
stageBox.update();

const calculateCoords = (angle, distance) =>{
    let coords = {};
    distance = Math.min(distance, 130);  
    let rads = (angle * Math.PI) / 180.0;
  
    coords.x = distance * Math.cos(rads);
    coords.y = Math.min(distance * Math.sin(rads),0);
    return coords;
}

let xCenter = 150;
let yCenter = 150;
let stageJoystick = new createjs.Stage('joystick');

let vertical = new createjs.Shape();
vertical.graphics.beginFill('#42626F').drawRect(150, 0, 2, 150);
stageJoystick.addChild(vertical);

let pointer = new createjs.Shape();
pointer.graphics.beginFill('#333333').drawCircle(xCenter, yCenter, 20);
pointer.alpha = 0.5;
stageJoystick.addChild(pointer);

let pointerAux = new createjs.Shape();

createjs.Ticker.framerate = 60;
createjs.Ticker.addEventListener('tick', stageJoystick);
stageJoystick.update();

let myElement = $('#joystick')[0];

var mc = new Hammer(myElement);

mc.on("panstart", (ev) => {
    let pos = $('#joystick').position();
    xCenter = pointer.x;
    yCenter = pointer.y;
    pointer.alpha = 0.5;
    stageJoystick.update();
});

mc.on("panmove", (ev) => {
    let pos = $('#joystick').position();    
    let coords = calculateCoords(ev.angle, ev.distance);
    $('#xVal').text(`X:  ${(64*coords.x)/65+128}`);
    $('#yVal').text(`Y:  ${(-64*coords.y)/65}`);
    xCenter = pointer.x = coords.x;
    yCenter = pointer.y = coords.y; 
    pointer.alpha = 0.5; 
    stageJoystick.update();
});

mc.on("panend", (ev) => {
    pointerAux.graphics.clear();
    pointer.alpha = 0.25;
    createjs.Tween.get(pointer).to({x:0,y:0},750,createjs.Ease.elasticOut);
    console.log(xCenter,yCenter)
    pointerAux.graphics.beginFill('#42626F').drawCircle(150+xCenter, 150+yCenter, 20);
    stageJoystick.addChild(pointerAux);
    stageJoystick.update();
    socket.emit('message',{
        to:'botControl',
        type:'arm',
        dataX:(Math.floor(64*xCenter)/65+128),
        dataY:(Math.floor(-64*yCenter)/65)
    })
    //ws.send(JSON.stringify({to:'botControl',type:'arm',dataX:`${(Math.floor(64*xCenter)/65+128)}`,dataY:`${(Math.floor(-64*yCenter)/65)}`}))
});

