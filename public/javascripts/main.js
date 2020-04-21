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
				console.log('to botControl message 4');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'4'
				})
				//ws.send(JSON.stringify({'to': 'botControl','message':'4','type':'keys'}));
			}
			break;
		case 40: //flecha abajo
			if(keys[1]==1){ keys[1]=0;
				console.log('to botControl message 4');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'4'
				})
				//ws.send(JSON.stringify({'to': 'botControl','message':'4','type':'keys'}));
			}
			break;
		case 39: // flecha derecha
			if(keys[2]==1){ keys[2]=0;
				console.log('to botControl message 4');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'4'
				})
				//ws.send(JSON.stringify({'to': 'botControl','message':'4','type':'keys'}));
			}
			break;
		case 37: // flecha izquierda
			if(keys[3]==1){ keys[3]=0;
				console.log('to botControl message 4');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'4'
				})
				//ws.send(JSON.stringify({'to': 'botControl','message':'4','type':'keys'}));
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
				console.log('to botControl message 0');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'0'
				})
				//ws.send(JSON.stringify({'to': 'botControl','type':'keys','message':'0'}));
			}
			break;
		case 40: //flecha abajo
			if(keys[1]==0){ keys[1]=1;
				console.log('to botControl message 1');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'1'
				})
				//ws.send(JSON.stringify({'to': 'botControl','type':'keys','message':'1'}));
			}
			break;
		case 39: // flecha derecha
			if(keys[2]==0){ keys[2]=1;
				console.log('to botControl message 2');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'2'
				})
				//ws.send(JSON.stringify({'to': 'botControl','type':'keys','message':'2',}));
			}
			break;
		case 37: // flecha izquierda
			if(keys[3]==0){ keys[3]=1;
				console.log('to botControl message 3');
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:'3'
				})
				//ws.send(JSON.stringify({'to': 'botControl','type':'keys','message':'3'}));
			}
			break;
		default:
		let men= String.fromCharCode(tec)
				 //Z=90 x=88  f=70  s=83  w=87  d=68 a=65
			if (men=='Z' || men=='X' || men=='F' || men=='S' || men=='W' || men=='D'||men=='P'|| men=='O'||men=='I' || men=='A'){
				console.log('to botControl message 1',men);
				socket.emit('message',{
					to:'botControl',
					type:'keys',
					message:men
				})
				//ws.send(JSON.stringify({'to': 'botControl','message':men,'type':'keys'})); 
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

//ws://localhost:8000/?user=controller
//ws://ritaportal.udistrital.edu.co:10207/?user=controller
const socket = io.connect('ws://ritaportal.udistrital.edu.co:10207/?user=controller',{
forceNew: true,
});

socket.on('message', (data) => {
	switch(data.type){
		case 'image':
			document.querySelector('#streaming').src= 'data:image/jpg;base64,'+data['message'];
			break;
		case 'sensors':
			updateSensors(data.message)
			break;
		case 'disconnect':
			console.log(`User ${data.message} is Disconnect`)
			if(data.message==='botControl'){
				deactivateKeys();
				animation.pause()
			}
			break;
		default:
			break;
	}
});

socket.on('connected', (data) => {
	if(data.message==='botControl'){
		animation.play()
		activateKeys()
	}
});

socket.on('disconnected',(data) => {
	console.log(`Server says ${data}`)
	deactivateKeys();
	animation.pause()
})
