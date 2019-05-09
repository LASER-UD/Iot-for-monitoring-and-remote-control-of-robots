var teclas=[0,0,0,0,0,0,0,0,0,0,0,0];
	
var ws = new WebSocket('ws://localhost:8000');

// event emmited when connected
ws.onopen = function () {
	console.log('websocket is connected');
	ws.send(JSON.stringify({'user': 'mecanico'}));
}
// event emmited when receiving message 
ws.onmessage = function (ev) {
	console.log(ev);
}
	$(document).ready(function() {
		
		$(document).keydown(function(tecla){ 
				tec = tecla.keyCode ;
				switch(tec){
					case 38: //flecha arriba
						if(teclas[0]==0){ teclas[0]=1;
							ws.send(JSON.stringify({'message': '1','tipo': 'tecla' }));}
						break;
					case 40: //flecha abajo
						if(teclas[1]==0){ teclas[1]=1;
							ws.send(JSON.stringify({'message': '2','tipo': 'tecla' }));}
						break;
					case 39: // flecha derecha
							ws.send(JSON.stringify({'message': '3','tipo': 'tecla' }));
						break;
					case 37: // flecha izquierda
							ws.send(JSON.stringify({'message': '4','tipo': 'tecla' }));
						break;	 
					default:
					var men= String.fromCharCode(tec)
							 //Z=90 x=88  f=70  s=83  w=87  d=68 a=65
						if (men=='Z' || men=='X' || men=='F' || men=='S' || men=='W' || men=='D' || men=='A'){
							//(tec==90 || tec==88 || tec==70 || tec=83 || tec== 87 || tec==68 || tec==65){
						 	ws.send(JSON.stringify({'message':men ,'tipo': 'tecla' }));
						}
						break;
				}
		});
		$(document).keyup(function(tecla){ 
				tec = tecla.keyCode ;
				switch(tec){
					case 38: //flecha arriba
						if(teclas[0]==1){ teclas[0]=0;
							ws.send(JSON.stringify({'message': '5','tipo': 'tecla' }));}
						break;
					case 40: //flecha abajo
						if(teclas[1]==1){ teclas[1]=0;
							ws.send(JSON.stringify({'message': '6','tipo': 'tecla' }));}
						break;
					default:
						break;
				}
		});
	}); 