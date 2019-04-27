import socket

i = "2"
f = "holaa"


import socket

f2 = str.encode("{\"id-dispositivo\":"+str(i)+","+"\"hall\":"+str(f)+"}", 'utf-8')
#f2 = str.encode(str(datos), 'utf-8')
clientsocket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
clientsocket.connect(('ritaportal.udistrital.edu.co', 10207))
clientsocket.send(f2)
print("enviado",f2.decode())
