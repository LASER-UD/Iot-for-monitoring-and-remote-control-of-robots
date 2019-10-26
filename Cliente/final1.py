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

class VideoCamera(object):
    def start(self):
        self.capture=True;
        try:
            self.video = cv2.VideoCapture(0)
        except cv2.error:
            self.video = cv2.VideoCapture(1)
        (self.grabbed, self.frame) = self.video.read()
        self.hilo=threading.Thread(target=self.update, args=())
        self.hilo.start()
        self.n=0
        
    def stop(self):
        self.capture=False;
        self.video.release()

    def get_frame(self):
        try:
            #(self.grabbed, self.frame) = self.video.read()
            if(self.n==2):
                self.n=0
                image=cv2.resize(self.frame,(250,180),4)
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
            else:
                self.n=self.n+1;
                image=cv2.resize(self.frame,(250,180),4)
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 40]

            ret, jpeg = cv2.imencode('.jpg', image, encode_param)
            out = base64.b64encode(jpeg.tobytes()).decode('ascii')
            return out
        except:
            None
            
    def update(self):
        while self.capture:
            (self.grabbed, self.frame) = self.video.read()
            time.sleep(0.02)
        
            
@implementer(interfaces.IPushProducer)
class RandomByteStreamProducer:
    
    def __init__(self, proto):
        self.cuenta=0
        self.proto = proto
        self.paused = False
        self.camera = VideoCamera()


    def pauseProducing(self):
        self.paused = True
        
    def resumeProducing(self):
        self.paused = False   
        while not self.paused:
            if self.cuenta==3:
                self.cuenta=0;
                self.update()
            else:
                self.cuenta=self.cuenta+1;
            time.sleep(0.01)
     
    def stopProducing(self):
        subprocess.call('/usr/bin/pm2 restart 2',shell=True)    

         
    def update(self):
        self.proto.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':self.camera.get_frame()}).encode('utf8'))
                
    def __del__(self):
        print("EliminandoProdutor")
        subprocess.call('/usr/bin/pm2 restart 2',shell=True)   
        #if self.camera.capture:
            #self.camera.stop() 
            #print("Deteniendo la camara")
        

class AppProtocol(WebSocketClientProtocol):    
    def onOpen(self):
        self.producer = RandomByteStreamProducer(self)
        self.registerProducer(self.producer, True)
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
                self.producer.camera.start()
                self.producer.resumeProducing()
        elif(text_data_json['type']=='MD'):
                subprocess.call('/usr/bin/pm2 restart 2',shell=True)
                self.producer.pauseProducing()
                
                print("MD")
        else:
            message = text_data_json['message']
            print(message)
            

    def onClose(self, wasClean, code, reason):
        del self.producer    
        print("WebSocket connection closed")
        
   
        
        
        
class AppFactory(WebSocketClientFactory, ReconnectingClientFactory):
    protocol = AppProtocol

    def clientConnectionFailed(self, connector, reason):
        print("Unable connect to the server")
        self.retry(connector)
        subprocess.call('/usr/bin/pm2 restart 2',shell=True)

    def clientConnectionLost(self, connector, reason):
        print("Lost connection and retrying...")
        self.retry(connector)
        subprocess.call('/usr/bin/pm2 restart 2',shell=True)


if __name__ == '__main__':
    
    from twisted.python import log
    from twisted.internet import reactor
    log.startLogging(sys.stdout)
    factory = AppFactory(u"ws://ritaportal.udistrital.edu.co:10207/jordan1")
    reactor.connectTCP(server, port, factory)
    reactor.run()

