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

server = "ritaportal.udistrital.edu.co"  # Server IP Address or domain eg: tabvn.com
port = 10207  # Server Port
stop = True

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        (self.grabbed, self.frame) = self.video.read()
        self.hilo=threading.Thread(target=self.update, args=())
        self.hilo.start()
        
    def __del__(self):
        self.video.release()
        global stop
        stop=True
        print("limpio")
        del self.hilo

    def get_frame(self):
        image = self.frame
        ret, jpeg = cv2.imencode('.jpg', image)
        out = jpeg.tobytes().decode('ascii')
        return out

    def update(self):
        global stop
        while not stop:
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
                self.proto.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':self.camera.get_frame()}).encode('utf8'))
                print("envio")
        
    def stopProducing(self):
        pass 
        
    def __del__(self):
        print("EliminandoProdutor")
        del self.camera

class AppProtocol(WebSocketClientProtocol):    
    def onOpen(self):
        print("Abierto")

    def onConnect(self, response):
        print("server conectado")

    def onConnecting(self, transport_details):
        self.producer = RandomByteStreamProducer(self)
        self.registerProducer(self.producer, True)
        print("Conectando")
        return None  # ask for defaults

    def onMessage(self, payload, isBinary):
        text_data_json = json.loads(payload.decode('utf8'))
        if(text_data_json['type']=='MC'):
                print("MC")
                self.producer.resumeProducing()
        elif(text_data_json['type']=='MD'):
                print("MD")
        else:
            print("No entiendo")

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

