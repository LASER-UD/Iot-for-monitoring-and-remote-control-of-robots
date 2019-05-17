import json
import threading
#import cv2
import base64
from autobahn.asyncio.websocket import WebSocketClientProtocol, \
    WebSocketClientFactory
from asyncio.events import get_event_loop

try:
    import asyncio
except ImportError:
    import trollius as asyncio
""" 
class VideoCamera():
     def start(self):
         self.video = cv2.VideoCapture(0)
         (self.grabbed, self.frame) = self.video.read(0)

     def end(self):
         self.video.release()

     def get_frame(self):
         (self.grabbed, self.frame) = self.video.read(0)
         image = self.frame
         jpeg = cv2.imencode('.jpg', image)
         return jpeg.tobytes()
 """
decision=0

class MyClientProtocol(WebSocketClientProtocol):

    def onConnect(self, response):
        print("Server connected:")

    def onConnecting(self, transport_details):
        return None  # ask for defaults

    async def onOpen(self):
        # start sending messages every second ..
        self.sendMessage(json.dumps({'userFrom':'2','userTo': 'Rita','message':'conexion'}).encode('utf8'))
            #await asyncio.sleep(0.1)
        def envioImage():
            self.sendMessage(json.dumps({'userFrom':'2','userTo': 'Rita','message':'Imagen'}).encode('utf8'))
            if decision==1
                self.factory.loop.call_later(1, envioImage)
        # start sending messages every second ..
        envioImage()

    def onMessage(self, payload, isBinary):
        text_data_json = json.loads(payload)
        if(text_data_json['message']=='MC'):
            decision=1
            self.envioImage()
        elif(text_data_json['message']=='MD'):
            decision=0
        else:
            print("No entiendo")

    async def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))


def videos(camera,factory):
    factory.sendMessage(json.dumps({'userFrom':'Jordan','userTo': 'Rita','message':'co'}).encode('utf8'))
    camera.get_frame()

factory = WebSocketClientFactory(u"ws://ritaportal.udistrital.edu.co:10207/jordan")
factory.protocol = MyClientProtocol
loop = asyncio.get_event_loop()
coro = loop.create_connection(factory, 'ritaportal.udistrital.edu.co', 10207)
loop.run_until_complete(coro)
loop.run_forever()
#camera = VideoCamera()
#camera.start()
#timer = threading.Timer(0.001, videos,args=(camera,factory))
#timer.start()
#loop.stop()
#loop.close()