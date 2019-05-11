
## Pasos para ejecutar proyecto

1. Clonar el repositorio 
	`$ cd home/pi/Documents/`
	`$ git clone https://github.com/LASER-UD/`
2. Instalar archivos:

## Posibles Errores
1. Nginx no arranca 
	* Eliminar Nginx: `$ sudo apt-get remove nginx nginx-common`
	* Eliminar Nginx: `$ sudo apt-get purge nginx nginx-common`
	* Intalar de nuevo : `$ sudo apt-get install nginx` 

- Nota: los archivos de error o de conexión se configuran en la configuracion de nginx 
	* cambiar permisos de camara y puerto `$ sudo chmod 777 /dev/ttyACM0` `$ sudo chmod 777 /dev/video0`