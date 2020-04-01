$(document).ready(function() {

   //letibles WS
	let keys=[0,0,0,0,0,0,0,0,0,0,0,0];
	let alerts=[0,0,0,0];
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
	
	//jostick
	let xCenter = 50;
	let yCenter = 50;
	let stage = new createjs.Stage('joystick');
	let psp = new createjs.Shape();
	psp.alpha = 0.25;
	psp.graphics.beginFill('#42626F').drawCircle(xCenter, yCenter, 20);
	stage.addChild(psp);
	
	//lineas de jostick
	let vertical = new createjs.Shape();
	let horizontal = new createjs.Shape();
	vertical.graphics.beginFill('#fff').drawRect(50, 0, 2, 100);
	horizontal.graphics.beginFill('#fff').drawRect(0, 50, 100, 2);
	stage.addChild(vertical);
	stage.addChild(horizontal);	
	
	createjs.Ticker.framerate = 20;
	createjs.Ticker.addEventListener('tick', stage);
	stage.update();
	
	//Eventos para jostick
	let myElement = $('#joystick')[0];
	// by default, it only adds horizontal recognizers
	let mc = new Hammer(myElement);
	
	const socket = io.connect('http://localhost:3000',{
    forceNew: true,
	});

	socket.on('message', (data) => {
		console.log('new message');
		console.log(data)
	});
	socket.on('connected', (data) => {
		console.log(data)
		animation.play()
		socket.emit('authenticate',{name:'controller',})
	});
	
	mc.on("panstart", function(ev) {
		let pos = $('#joystick').position();
		xCenter = psp.x;
		yCenter = psp.y;
		psp.alpha = 0.25;
		stage.update();
	});
	
	// listen to events...
	mc.on("panmove", function(ev) {
		let pos = $('#joystick').position();
		
		let x = (ev.center.x - pos.left - 50);
		let y = (ev.center.y - pos.top - 50);
		$('#xVal').text('X: ' + x);
		$('#yVal').text('Y: ' + (-1 * y));
		
		let coords = calculateCoords(ev.angle, ev.distance);
		
		psp.x = coords.x;
		psp.y = coords.y;
		
		psp.alpha = 0.5;
		
		stage.update();
	});
	
	mc.on("panend", function(ev) {
		//psp.alpha = 0.25;
		createjs.Tween.get(psp).to({x:xCenter,y:yCenter},550,createjs.Ease.elasticOut);
	});
	
	function calculateCoords(angle, distance) {
		let coords = {};
		distance = Math.min(distance, 50);  
		let rads = (angle * Math.PI) / 180.0;
		
		coords.x = distance * Math.cos(rads);
		coords.y = distance * Math.sin(rads);
		
		return coords;
	}

	$(document).keydown(function(code){ 
				key = code.keyCode ;
				//console.log(tec);
				switch(tec){
					case 38: //flecha arriba
						if(keys[0]==0){ 
							keys[0]=1;
							console.log('userFrom 1 userTo 2 message 0');
							socket.emit('message',{
								to:'bot',
								message:'0'
							})
							//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'0'}));
						}
							//ws.send(JSON.stringify({'message': '1','tipo': 'tecla' }));}
						break;
					case 40: //flecha abajo
						if(keys[1]==0){ keys[1]=1;
							console.log('userFrom 1 userTo 2 message 1');
							//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'1'}));
						}
						break;
					case 39: // flecha derecha
					if(keys[2]==0){ keys[2]=1;
						console.log('userFrom 1 userTo 2 message 2');
						//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'2',}));
					}
						break;
					case 37: // flecha izquierda
					if(keys[3]==0){ keys[3]=1;
					console.log('userFrom 1 userTo 2 message 3');
						//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'3'}));
					}
						break;
					//case 13:
					//	console.log('Señal de vida');
					//	animation.play();
					//break;
					//case 32:
					//	console.log('Que la fuerza te acompañe');		
					//	animation.pause();				
					//break;
					default:
					let men= String.fromCharCode(tec)
							 //Z=90 x=88  f=70  s=83  w=87  d=68 a=65
						if (men=='Z' || men=='X' || men=='F' || men=='S' || men=='W' || men=='D'||men=='P'|| men=='O'||men=='I' || men=='A'){
							//(tec==90 || tec==88 || tec==70 || tec=83 || tec== 87 || tec==68 || tec==65){
							console.log('userFrom 1 userTo 2 message 1',men);
							//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':men,'type':'tecla'})); 
						}
			if(men=='M'){
			  document.getElementById('sensor4').innerHTML =(" ")
			}
			break;
		}
	});

	$(document).keyup(function(code){ 
		tec = code.keyCode ;	  
		switch(tec){
			case 38: //flecha arriba
				if(keys[0]==1){ keys[0]=0;
					//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 4');
				}
				break;
			case 40: //flecha abajo
				if(keys[1]==1){ keys[1]=0;
					//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 5');
				}
				break;
			case 39: // flecha derecha
				if(keys[2]==1){ keys[2]=0;
					//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 5');
				}
				break;
			case 37: // flecha izquierda
				if(keys[3]==1){ keys[3]=0;
					//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 4');
				}
				break;
			default:
				break;
		}
	});
	
});