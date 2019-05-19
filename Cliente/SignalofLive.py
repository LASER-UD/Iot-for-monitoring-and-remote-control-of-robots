import RPi.GPIO as GPIO
import os
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT)

response = 1
while response==1:
	response=os.system("ping -c 1 ritaportal.udistrital.edu.co &")
	sleep(1)

while True:
	
	response=os.system("ping -c 1 ritaportal.udistrital.edu.co &")

	
	if response==0:
		GPIO.output(7,True)
		sleep(0.5) 
		GPIO.output(7,False)
		sleep(0.5) 

	sleep(1)
