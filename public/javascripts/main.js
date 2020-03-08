$(document).ready(function() {
	//Varibles heart
	var polyEl = document.querySelector('.svg-attributes-demo polygon');
	var feTurbulenceEl = document.querySelector('feTurbulence');
	var feDisplacementMap = document.querySelector('feDisplacementMap');
	polyEl.setAttribute('points', '64 46.36 40 35 8.574 15 63.446 47.32 64 111 64.554 47.32 88 35 119.426 15','fill','red');
	feTurbulenceEl.setAttribute('baseFrequency', '.05');
	feDisplacementMap.setAttribute('scale', '15'); /*DEMO*/
	var animation = anime({
		targets: ['.svg-attributes-demo polygon', 'feTurbulence', 'feDisplacementMap',],
		points: '64 19 36.4 0 8.574 19 20.574 83 64 115 105.426 83 119.426 19 91.713 0',
		baseFrequency: 0,
		scale: 1,
		loop: true,
		autoplay: false,
		direction: 'alternate',
		easing: 'easeInOutExpo'
   });

   //Varibles WS
	var teclas=[0,0,0,0,0,0,0,0,0,0,0,0];
	var alerts=[0,0,0,0];	
	var ws = new WebSocket('ws://ritaportal.udistrital.edu.co:10207/mecanico');//var ws = new WebSocket('ws://' + window.location.host +'/mecanico');
	
	//Varibles Figures
	const angulo=45;
	var iCenter = 0;
	var jCenter = 0;
	// Connected
	ws.onopen = function () {
		 console.log('websocket is connected');
	}
	 // Receiving message 
	ws.onmessage = function (e){
		 var data=JSON.parse(e.data);
		   if(data['type']=='imagen'){
				document.querySelector('#streaming').src= 'data:image/jpg;base64,'+data['message'];
			}else if(data['type']=='JC'){
				console.log('Señal de vida');
				animation.play();
			}else if(data['type']=='sensores'){
				const angulo=45;
				var sensores=data['message']                                                               
				document.getElementById('topbox').innerHTML = (sensores[0]);
				document.getElementById('rightbox').innerHTML = (sensores[1]);
				document.getElementById('bottombox').innerHTML = (sensores[2]);
				document.getElementById('leftbox').innerHTML = (sensores[2]);

				if(sensores[0]<10){
					alerts[0]=1;
					linetop.graphics.beginFill('#ff0000').drawRect(0, 0, 100, 3);
					stagebox.addChild(linetop);
					stagebox.update();
				}else{
					if(alerts[0]==1){
						alerts[0]=0;
						linetop.graphics.clear();
						stagebox.update();
					}
				}

				if(sensores[1]<10){
					alerts[1]=1;
					lineright.graphics.beginFill('#ff0000').drawRect(97,0, 3, 100);
					stagebox.addChild(lineright);
					stagebox.update();
				}else{
					if(alerts[1]==1){
						alerts[1]=0;
						lineright.graphics.clear();
						stagebox.update();
					}
				}
				

				if(sensores[2]<10){
					alerts[2]=1;
					linebottom.graphics.beginFill('#ff0000').drawRect(0,98, 100, 3);
					stagebox.addChild(linebottom);
					stagebox.update();
				}else{
					if(alerts[2]==1){
						alerts[2]=0;
						linebottom.graphics.clear();
						stagebox.update();
					}
				}

				if(sensores[3]<10){
					alerts[3]=1;
					lineleft.graphics.beginFill('#ff0000').drawRect(0, 0, 3, 100);
					stagebox.addChild(lineleft);
					stagebox.update();
				}else{
					if(alerts[3]==1){
						alerts[3]=0;
						lineleft.graphics.clear();
						stagebox.update();
					}
				}
				jCenter=Math.round(((sensores[2]-sensores[0])*10)/34);
				iCenter=Math.round(((sensores[1]-sensores[3])*10)/34);
				box.y = jCenter;
				box.x = iCenter;
				stagebox.update();
			}else{
				console.log('Que la fuerza te acompañe');		
				animation.pause();
			}
	}
	
	// Disconnected
	ws.onclose = function() {
		 ws.send(JSON.stringify({'userFrom':'1','userTo': 'Rita','type':'desconexion','message':'1 desconectado'}));
		 console.log('Conecion cerrada');
		 animation.pause();
	}

	$(document).keydown(function(tecla){ 
				tec = tecla.keyCode ;
				//console.log(tec);
				switch(tec){
					case 38: //flecha arriba
						if(teclas[0]==0){ 
							teclas[0]=1;
							console.log('userFrom 1 userTo 2 message 0');
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'0'}));}
							//ws.send(JSON.stringify({'message': '1','tipo': 'tecla' }));}
						break;
					case 40: //flecha abajo
						if(teclas[1]==0){ teclas[1]=1;
							console.log('userFrom 1 userTo 2 message 1');
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'1'}));}
						break;
					case 39: // flecha derecha
					if(teclas[2]==0){ teclas[2]=1;
						console.log('userFrom 1 userTo 2 message 2');
						ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'2',}));}
						break;
					case 37: // flecha izquierda
					if(teclas[3]==0){ teclas[3]=1;
					console.log('userFrom 1 userTo 2 message 3');
						ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'3'}));}
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
					var men= String.fromCharCode(tec)
							 //Z=90 x=88  f=70  s=83  w=87  d=68 a=65
						if (men=='Z' || men=='X' || men=='F' || men=='S' || men=='W' || men=='D'||men=='P'|| men=='O'||men=='I' || men=='A'){
							//(tec==90 || tec==88 || tec==70 || tec=83 || tec== 87 || tec==68 || tec==65){
							console.log('userFrom 1 userTo 2 message 1',men);
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':men,'type':'tecla'})); 
						}
            if(men=='M'){
              document.getElementById('sensor4').innerHTML =(" ")
            }
			break;
		}
	});

	$(document).keyup(function(tecla){ 
		tec = tecla.keyCode ;	  
		switch(tec){
			case 38: //flecha arriba
				if(teclas[0]==1){ teclas[0]=0;
					ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 4');
				}
				break;
			case 40: //flecha abajo
				if(teclas[1]==1){ teclas[1]=0;
					ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 5');
				}
				break;
			case 39: // flecha derecha
				if(teclas[2]==1){ teclas[2]=0;
					ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 5');
				}
				break;
			case 37: // flecha izquierda
				if(teclas[3]==1){ teclas[3]=0;
					ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'4','type':'tecla'}));
					console.log('userFrom 1 userTo 2 message 4');
				}
				break;
			default:
				break;
		}
	});

	// caja
	var stagebox = new createjs.Stage('box');
	var box = new createjs.Shape();
	var linetop = new createjs.Shape();
	var lineright = new createjs.Shape();
	var linebottom = new createjs.Shape();
	var lineleft = new createjs.Shape();

	box.graphics.beginFill('#42626F').drawRect(20, 20, 60, 60);
	stagebox.addChild(box);
	stagebox.update();

	//jostick
	var xCenter = 50;
	var yCenter = 50;
	var stage = new createjs.Stage('joystick');
	var psp = new createjs.Shape();
	psp.alpha = 0.25;
	psp.graphics.beginFill('#42626F').drawCircle(xCenter, yCenter, 20);
	stage.addChild(psp);
	
	//lineas de jostick
	var vertical = new createjs.Shape();
	var horizontal = new createjs.Shape();
	vertical.graphics.beginFill('#fff').drawRect(50, 0, 2, 100);
	horizontal.graphics.beginFill('#fff').drawRect(0, 50, 100, 2);
	stage.addChild(vertical);
	stage.addChild(horizontal);	
	
	createjs.Ticker.framerate = 20;
	createjs.Ticker.addEventListener('tick', stage);
	stage.update();

	//Eventos para jostick
	var myElement = $('#joystick')[0];
	// by default, it only adds horizontal recognizers
	var mc = new Hammer(myElement);	
  
	mc.on("panstart", function(ev) {
	  var pos = $('#joystick').position();
	  xCenter = psp.x;
	  yCenter = psp.y;
	  psp.alpha = 0.25;
	  stage.update();
	});
	
	// listen to events...
	mc.on("panmove", function(ev) {
	  var pos = $('#joystick').position();
  
	  var x = (ev.center.x - pos.left - 50);
	  var y = (ev.center.y - pos.top - 50);
	  $('#xVal').text('X: ' + x);
	  $('#yVal').text('Y: ' + (-1 * y));
	  
	  var coords = calculateCoords(ev.angle, ev.distance);
	  
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
		var coords = {};
		distance = Math.min(distance, 50);  
		var rads = (angle * Math.PI) / 180.0;
	
		coords.x = distance * Math.cos(rads);
		coords.y = distance * Math.sin(rads);
		
		return coords;
	}
	  
	});