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

server = "ritaportal.udistrital.edu.co"  # Server IP Address or domain eg: tabvn.com
port = 10207  # Server Port

class SerialD():
     cuenta=0
     def __init__(self):
          self.datos=None;
          self.ser = serial.Serial()
          self.ser.baudrate = 115200
          self.ser.port = '/dev/ttyACM0'
     def start(self):
          self.ser.open()
     def end(self):
          self.ser.close()
     def update(self):
         self.ser.write(b"g")
         self.ser.flush() #espera a  exista un dato
         self.datos=int(self.ser.readline())
         return self.datos 
     def press(self,key):
         print(key.encode('cp1250'))
         self.ser.write(key.encode('cp1250'))#codifica y envia


class VideoCamera(object):
    def start(self):
        self.capture=True;
        self.video = cv2.VideoCapture(0)
        (self.grabbed, self.frame) = self.video.read()
        self.hilo=threading.Thread(target=self.update, args=())
        self.hilo.start()
        
    def __del__(self):
        self.video.release()
        print("limpio")
        
    
    def stop(self):
        self.capture=False;
        self.video.release()

    def get_frame(self):
#        (self.grabbed, image) = self.video.read()
        #gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        #ret, jpeg = cv2.imencode('.jpg', gray_image)
        image=cv2.resize(self.frame,(250,180),4)
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
        ret, jpeg = cv2.imencode('.jpg', image, encode_param)
        out = base64.b64encode(jpeg.tobytes()).decode('ascii')
        return out

    def update(self):
        while self.capture:
            (self.grabbed, self.frame) = self.video.read()
            


@implementer(interfaces.IPushProducer)
class RandomByteStreamProducer:
    
    def __init__(self, proto):
        self.proto = proto
        self.started = False
        self.paused = False
        self.camera = VideoCamera()

    def pauseProducing(self):
        self.paused = True
        
    def resumeProducing(self):
        self.paused = False
        if not self.started:
            self.started = True
        
        while not self.paused:
            #self.update()
                self.hilo=threading.Thread(target=self.update, args=())
                self.hilo.start()
                #time.sleep(0.005)
        
    def stopProducing(self):
        pass
         
    def update(self):
        self.proto.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':self.camera.get_frame()}).encode('utf8'))
        #print('enviando')
              
    def stopCamera(self):
        self.camera.stop() 

    def startCamera(self):
        self.camera.start() 
                
    def __del__(self):
        print("EliminandoProdutor")
        if self.camera.capture:
            self.camera.stop() 
            print("Deteniendo la camara")
        del self.camera

class AppProtocol(WebSocketClientProtocol):    
    def onOpen(self):
        self.producer = RandomByteStreamProducer(self)
        self.registerProducer(self.producer, True)
        self.seri = SerialD()
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
                self.producer.startCamera()
                self.producer.resumeProducing()
        elif(text_data_json['type']=='MD'):
                self.producer.pauseProducing()
                self.producer.stopCamera()
                self.seri.end()
                print("MD")
        else:
            message = text_data_json['message']
            self.seri.press(str(message))
            
    def onClose(self, wasClean, code, reason):
        del self.producer    
        print("WebSocket connection closed")
        
        
class AppFactory(WebSocketClientFactory, ReconnectingClientFactory):
    protocol = AppProtocol

    def clientConnectionFailed(self, connector, reason):
        print("Unable connect to the server")
        self.retry(connector)

    def clientConnectionLost(self, connector, reason):
        print("Lost connection and retrying...")
        self.retry(connector)


if __name__ == '__main__':
    
    from twisted.python import log
    from twisted.internet import reactor
    log.startLogging(sys.stdout)
    factory = AppFactory(u"ws://ritaportal.udistrital.edu.co:10207/jordan")
    reactor.connectTCP(server, port, factory)
    reactor.run()

