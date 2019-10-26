import RPi.GPIO as GPIO
import os
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT)

import socket
import subprocess
n=0
while True:
#creamos el socket de conexion
	
	con = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
	response=0
	try:
		con.connect(('www.google.com', 80))
		if(n==1):
			n=0
	except:
		if(n==0):
			n=1
			subprocess.call('/usr/bin/pm2 restart 0',shell=True)
			subprocess.call('/usr/bin/pm2 restart 2',shell=True)     
		response=1
		con.close()
	#response=1
	#try:
	#os.system("ping -c 1 google.com &")
	#except:
	#response=0
	
	#print(response)
	
	if response==0:
		GPIO.output(7,True)
	else:
		GPIO.output(7,False)
	
	sleep(1)
	
