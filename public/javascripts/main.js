//letibles WS
let keys=[0,0,0,0,0,0,0,0,0,0,0,0];
let alerts=[0,0,0,0];


const updateSensors = (sensors) =>{                                                               
	document.getElementById('topBox').innerHTML = (sensors[0]);
	document.getElementById('rightBox').innerHTML = (sensors[1]);
	document.getElementById('bottomBox').innerHTML = (sensors[2]);
	document.getElementById('leftBox').innerHTML = (sensors[2]);

	if(sensors[0]<10){
		alerts[0]=1;
		lineTop.graphics.beginFill('#ff0000').drawRect(0, 0, 100, 3);
		stageBox.addChild(lineTop);
		stageBox.update();
	}else{
		if(alerts[0]==1){
			alerts[0]=0;
			lineTop.graphics.clear();
			stageBox.update();
		}
	}

	if(sensors[1]<10){
		alerts[1]=1;
		lineRight.graphics.beginFill('#ff0000').drawRect(97,0, 3, 100);
		stageBox.addChild(lineRight);
		stageBox.update();
	}else{
		if(alerts[1]==1){
			alerts[1]=0;
			lineRight.graphics.clear();
			stageBox.update();
		}
	}
	if(sensors[2]<10){
		alerts[2]=1;
		lineBottom.graphics.beginFill('#ff0000').drawRect(0,98, 100, 3);
		stageBox.addChild(lineBottom);
		stageBox.update();
	}else{
		if(alerts[2]==1){
			alerts[2]=0;
			lineBottom.graphics.clear();
			stageBox.update();
		}
	}

	if(sensors[3]<10){
		alerts[3]=1;
		lineLeft.graphics.beginFill('#ff0000').drawRect(0, 0, 3, 100);
		stageBox.addChild(lineLeft);
		stageBox.update();
	}else{
		if(alerts[3]==1){
			alerts[3]=0;
			lineLeft.graphics.clear();
			stageBox.update();
		}
	}

	jCenter=Math.round(((sensors[2]-sensors[0])*10)/34);
	iCenter=Math.round(((sensors[1]-sensors[3])*10)/34);
	box.y = jCenter;
	box.x = iCenter;
	stageBox.update();
}

const pressDown=(code)=>{ 
	switch(code.keyCode){
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
}

const pressUp = (code)=>{ 
	console.log(code.keyCode);
	switch(code.keyCode){
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
		default:
		let men= String.fromCharCode(tec)
				 //Z=90 x=88  f=70  s=83  w=87  d=68 a=65
			if (men=='Z' || men=='X' || men=='F' || men=='S' || men=='W' || men=='D'||men=='P'|| men=='O'||men=='I' || men=='A'){
				console.log('userFrom 1 userTo 2 message 1',men);
				//ws.send(JSON.stringify({'userFrom':'1','userTo': '2','message':men,'type':'tecla'})); 
			}
			break;
	}
}

const activateKeys = () =>{
	console.log('Key is activate')
	document.body.addEventListener('keyup', pressUp, false)
	document.body.addEventListener('keydown', pressUp, false)
}

const deactivateKeys = () =>{
	document.body.removeEventListener('keyup',pressUp,false)
	document.body.removeEventListener('keydown',pressUp,false)
}

const socket = io.connect('http://ritaportal.udistrital.edu.co:10206',{
forceNew: true,
});

socket.on('message', (data) => {
	console.log('new message');
	console.log(data)
	switch(data.type){
		case 'sensors':
			update(data.message)
			break;
		case 'image':
			document.querySelector('#streaming').src= 'data:image/jpg;base64,'+data['message'];
			break;
		case 'connect':
			console.log(data.message)
			if(data.message=='bot'){
				animation.play()
				activateKeys()
			}
			break;
		case 'disconnect':
			console.log(data.message)
			if(data.message=='bot'){
				deactivateKeys();
				animation.pause()
			}
			break;
		default:
			break;
	}
});

socket.on('connected', (data) => {
	console.log(data)
	animation.play()
	activateKeys()
	socket.emit('authenticate',{name:'controller',})
});

socket.on('disconnected',(data) => {
	console.log(data)
	deactivateKeys();
	animation.pause()
})