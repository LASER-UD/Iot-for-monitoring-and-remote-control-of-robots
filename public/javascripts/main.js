$(document).ready(function() {
	var polyEl = document.querySelector('.svg-attributes-demo polygon');
	var feTurbulenceEl = document.querySelector('feTurbulence');
	var feDisplacementMap = document.querySelector('feDisplacementMap');
	polyEl.setAttribute('points', '64 46.36 40 35 8.574 15 63.446 47.32 64 111 64.554 47.32 88 35 119.426 15','fill','red');
	feTurbulenceEl.setAttribute('baseFrequency', '.05');
	feDisplacementMap.setAttribute('scale', '15');
	 /*DEMO*/
	 var teclas=[0,0,0,0,0,0,0,0,0,0,0,0];
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
	  
	 var ws = new WebSocket('ws://ritaportal.udistrital.edu.co:10207/mecanico');
	 //var ws = new WebSocket('ws://localhost:8000/mecanico');
	 
	 // event emmited when connected
	 ws.onopen = function () {
		 console.log('websocket is connected');
	 }
	 // event emmited when receiving message 
	 ws.onmessage = function (e){
		 var data=JSON.parse(e.data);
		   if(data['type']=='imagen'){
				 document.querySelector('#streaming').src= 'data:image/jpg;base64,'+data['message'];
			}else if(data['type']=='JC'){
						 console.log('Señal de vida');
						 animation.play();
			}else{
						 console.log('Que la fuerza te acompañe');		
						 animation.pause();
			}
	 }			 
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
						if(teclas[0]==0){ teclas[0]=1;
							console.log('userFrom 1 userTo 2 message 1');
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'1'}));}
							//ws.send(JSON.stringify({'message': '1','tipo': 'tecla' }));}
						break;
					case 40: //flecha abajo
						if(teclas[1]==0){ teclas[1]=1;
							console.log('userFrom 1 userTo 2 message 2');
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'2'}));}
						break;
					case 39: // flecha derecha
						console.log('userFrom 1 userTo 2 message 3');
						ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'3',}));
						break;
					case 37: // flecha izquierda
					console.log('userFrom 1 userTo 2 message 4');
						ws.send(JSON.stringify({'userFrom':'1','userTo': '2','type':'tecla','message':'4'}));
						break;
					case 13:
						console.log('Señal de vida');
						animation.play();
					break;
					case 32:
						console.log('Que la fuerza te acompañe');		
						animation.pause();				
					break;
					default:
					var men= String.fromCharCode(tec)
							 //Z=90 x=88  f=70  s=83  w=87  d=68 a=65
						if (men=='Z' || men=='X' || men=='F' || men=='S' || men=='W' || men=='D' || men=='A'){
							//(tec==90 || tec==88 || tec==70 || tec=83 || tec== 87 || tec==68 || tec==65){
							console.log('userFrom 1 userTo 2 message 1',men);
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':men,'type':'tecla'})); 
						}
						break;
				}
		});
		$(document).keyup(function(tecla){ 
				tec = tecla.keyCode ;
				switch(tec){
					case 38: //flecha arriba
						if(teclas[0]==1){ teclas[0]=0;
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'5','type':'tecla'}));}
						break;
					case 40: //flecha abajo
						if(teclas[1]==1){ teclas[1]=0;
							ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':'6','type':'tecla'}));}
						break;
					default:
						break;
				}
		});
	}); 
