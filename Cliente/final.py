from twisted.internet.protocol import ReconnectingClientFactory
from autobahn.twisted.websocket import WebSocketClientProtocol, WebSocketClientFactory
from twisted.internet import reactor, interfaces
from zope.interface import implementer
import json
import base64
import subprocess
from twisted.internet import task
from twisted.internet import reactor
import cv2
import threading
import sys
import time
import serial
import subprocess
from twisted.internet.task import LoopingCall
server = "ritaportal.udistrital.edu.co"  # Server IP Address or domain eg: tabvn.com
port = 10207  # Server Port

class SerialD():
     cuenta=0
     def __init__(self):
          self.datos=None;
          self.ser = serial.Serial()
          self.ser.baudrate = 115200
          self.ser.port = '/dev/ttyACM0'
          self.sensores=[0,0,0,0,0]
          self.cambio=False;
          self.cambio1=False
          self.Rdatos=0
          
     def start(self):
            try:
                self.ser.open()
            except:
                self.ser.port='/dev/ttyUSB0'
                self.ser.open()
            self.hilo=threading.Thread(target=self.update, args=())
            self.hilo.start()
          
     def end(self):
          self.ser.close()
          
     def update(self):
        while self.ser.isOpen():
            self.ser.flush() #espera a  exista un dato
            datos=self.ser.readline()
            #print(datos)
            if (datos.decode('cp1250').replace('\r\n','')=='a'):
                        self.cambio1=True
            if (datos.decode('cp1250').replace('\r\n','')=='o'):
                        self.Rdatos=1
                        x=int(0)
            else:
                    if(datos.decode('cp1250').replace('\r\n','')=='e'):
                            self.Rdatos=0 
                            self.cambio=True
                    else:
                            if(self.Rdatos==1):
                                    try:
                                        data=int(datos.decode('cp1250'))
                                        if x<5:
                                            self.sensores[x]=data
                                        x=x+1
                                    except:
                                        print("raro")
            time.sleep(0.1)
            
                          
     def press(self,key):
         #print(key.encode('cp1250'))
         self.ser.write(key.encode('cp1250'))#codifica y envia
       


class AppProtocol(WebSocketClientProtocol):    
    def onOpen(self):
        self.seri=SerialD()
        print("Abierto")

    def onConnect(self, response):
        print("server conectado")

    def onConnecting(self, transport_details):
        print("Conectando")
        return None  # ask for defaults

    def onMessage(self, payload, isBinary):
        text_data_json = json.loads(payload.decode('utf8'))
        if(text_data_json['type']=='MC'):
                print("MC")
                self.seri.start()
                self._loop = LoopingCall(self.envioSerial)
                self._loop.start(0.1)
               
        elif(text_data_json['type']=='MD'):
                subprocess.call('/usr/bin/pm2 restart 0',shell=True)
                print("MD")
        else:
            message = text_data_json['message']
            print(message)
            self.seri.press(str(message))

    def onClose(self, wasClean, code, reason): 
        print("WebSocket connection closed")
        
    def envioSerial(self):
        if self.seri.cambio1==True:
                self.seri.cambio1=False
                self.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'bola','message':'entro'}).encode('utf8'))        
        if self.seri.cambio==True:
                self.seri.cambio=False
                self.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'sensores','message':self.seri.sensores}).encode('utf8'))
        
        
        
class AppFactory(WebSocketClientFactory, ReconnectingClientFactory):
    protocol = AppProtocol

    def clientConnectionFailed(self, connector, reason):
        print("Unable connect to the server")
        self.retry(connector)
        subprocess.call('/usr/bin/pm2 restart 0',shell=True)

    def clientConnectionLost(self, connector, reason):
        print("Lost connection and retrying...")
        self.retry(connector)
        subprocess.call('/usr/bin/pm2 restart 0',shell=True)


if __name__ == '__main__':
    
    from twisted.python import log
    from twisted.internet import reactor
    log.startLogging(sys.stdout)
    factory = AppFactory(u"ws://ritaportal.udistrital.edu.co:10207/jordan")
    reactor.connectTCP(server, port, factory)
    reactor.run()

