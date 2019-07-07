# Monitoreo y Control de Robot via Internet

Este proyecto consiste el desarrollo y la configuración para el despliegue de un servidor con NodeJS, el cual sirva como puente de comunicación entre un robot con conexión a internet y un cliente, conectado a una pagina web o una aplicación web. Los canales de comunicación se desplegaran con websocket, gracias a que mantiene una conexión persistente y permite el envió de video codificado. el cual tenga la capacidad de moverse en todas las direcciones, subir rampas, pasar túneles, transmitir vídeo, enviar su ubicación en su entorno según sensores de distancia, tomar y lanzar una pelota. El proyecto incorpora una Rasberry pi 3, PSOC 5 LP, una camara USB y una estructura impresa en 3D.

###### [Overview](#) | [Download](#download) | [Results](#results) | [Repository content](#repository-content) | [License](#license) | [Citing](#citing) | [Caveats](#caveats) | [Changelog](#changelog)

## Pasos para ejecutar cliente (Rasberry Pi)


## Pasos para ejecutar servidor (AWS)

1. Clonar el repositorio 
	`$ cd home/pi/Documents/`
	`$ git clone https://github.com/LASER-UD/Iot-for-monitoring-and-remote-control-of-robots`
2. Instalar archivos:
	`$ sudo npm install`
3. Ejecutar pm2 por primera vez cliente:
	`$ sudo pm2 start  nombre.py interpreter==/usr/bin/python3.7`
	`$ sudo pm2 save`
4. Ejecutar pm2 servidor:
	`$ cd home/pi/Documents/Iot-for-monitoring-and-remote-control-of-robots/bin`
	`$ sudo pm2 www`
	`$ sudo pm2 save`
	`$ sudo pm2 clean www`
## Posibles Errores
1. Detener Proceso desde terminal en caso de perder conexion ssh:
	* Ver el numero del proceso `$ sudo fuser -n tcp 80`
	* Copiar el numero del proceso 122
	*`$ sudo kill -9 122`
2. Nginx no arranca 
	* Eliminar Nginx: `$ sudo apt-get remove nginx nginx-common`
	* Eliminar Nginx: `$ sudo apt-get purge nginx nginx-common`
	* Intalar de nuevo : `$ sudo apt-get install nginx` 
3. Actualizacion de paquetes
	* Actualizar package-lock.json: `$ sudo npm install`
	* Ver el reporte de actualizaciones: `$  sudo npm audit`
4. Revisar las notificaciones del servidor 
	* Mira el estado y los identificadores de cada proceso: `$ sudo pm2 status`
	* Revisa las notificaciones del proceso 1: `$ sudo pm2 log 1`
	* Detiene el proceso: `$ sudo pm2 stop 1`
	* Inicia el proceso: `$ sudo pm2 start 1` 
	* Reinicia el proceso: `$ sudo pm2 restart 1` 
- Nota: los archivos de error o de conexión se configuran en la configuracion de nginx 
	* cambiar permisos de camara y puerto `$ sudo chmod 777 /dev/ttyACM0` `$ sudo chmod 777 /dev/video0`
