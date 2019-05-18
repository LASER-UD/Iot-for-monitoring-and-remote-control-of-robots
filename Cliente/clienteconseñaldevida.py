from twisted.internet.protocol import ReconnectingClientFactory
from autobahn.twisted.websocket import WebSocketClientProtocol, WebSocketClientFactory
from twisted.internet import reactor, interfaces
from zope.interface import implementer
import json
import base64
import subprocess
from twisted.internet import task
from twisted.internet import reactor

server = "ritaportal.udistrital.edu.co"  # Server IP Address or domain eg: tabvn.com
port = 10207  # Server Port
import cv2


class VideoCamera(object):
    image=None;
    def start(self):
        self.video = cv2.VideoCapture(0)
        (self.grabbed, self.frame) = self.video.read()

    def end(self):
        self.video.release()

    def get_frame(self):
        (self.grabbed, self.frame) = self.video.read()
        image = self.frame
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

@implementer(interfaces.IPushProducer)
class RandomByteStreamProducer:
    
    def __init__(self, proto):
        self.proto = proto
        self.started = False
        self.paused = False
        self.camera = VideoCamera()
        self.camera.start()


    def resumeProducing(self):
        self.paused = False
        if not self.started:
            self.started = True
        
        while not self.paused:
                #self.proto.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':'holq'}).encode('utf8'))
                self.proto.sendMessage(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':base64.b64encode(self.camera.get_frame()).decode('ascii')}).encode('utf8'))
                print("envio")

    def pauseProducing(self):
        self.paused = True
        
    def stopProducing(self):
        pass 
    

class AppProtocol(WebSocketClientProtocol):    
    def onOpen(self):
        self.producer = RandomByteStreamProducer(self)
        self.registerProducer(self.producer, True)
        print("Abierto")

    def onConnect(self, response):
        print("server conectado")

    def onConnecting(self, transport_details):
        return None  # ask for defaults

    def onMessage(self, payload, isBinary):
        text_data_json = json.loads(payload.decode('utf8'))
        if(text_data_json['type']=='MC'):
                print("MC")
                self.producer.resumeProducing()
        elif(text_data_json['type']=='MD'):
                print("MD")
                self.producer.pauseProducing()
                self.producer.stop()
        else:
            print("No entiendo")

    async def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))
        
        
class AppFactory(WebSocketClientFactory, ReconnectingClientFactory):
    protocol = AppProtocol

    def clientConnectionFailed(self, connector, reason):
        print("Unable connect to the server {0}".format(reason))
        self.retry(connector)

    def clientConnectionLost(self, connector, reason):
        print("Lost connection and retrying... {0}".format(reason))
        self.retry(connector)


if __name__ == '__main__':
    import sys
    from twisted.python import log
    from twisted.internet import reactor
    log.startLogging(sys.stdout)
    factory = AppFactory(u"ws://ritaportal.udistrital.edu.co:10207/jordan")
    reactor.connectTCP(server, port, factory)
    reactor.run()

