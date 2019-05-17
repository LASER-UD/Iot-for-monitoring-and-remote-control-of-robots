import websocket
import json
import base64
import cv2
#import serial
import threading
try:
    import thread
except ImportError:
    import _thread as thread
import time
# class SerialD():
#      cuenta=0
#      def __init__(self):
#           self.datos=None
#           self.ser = serial.Serial()
#           self.ser.baudrate = 115200
#           self.ser.port = '/dev/ttyACM0'
#      def start(self):
#           self.ser.open()
#      def end(self):
#           self.ser.close()
#      def update(self):
#          self.ser.write(b"g")
#          self.ser.flush() #espera a  exista un dato
#          self.datos=int(self.ser.readline())
#          return self.datos 
#      def press(self,key):
#          print(key.encode('cp1250'))
#          self.ser.write(key.encode('cp1250'))#codifica y envia
        
class VideoCamera():
     clientes=0
     image=None
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

# camera = VideoCamera()
# seri= SerialD()

def on_message(ws, message):
    
    text_data_json = json.loads(message)
    #msg = text_data_json['message']
    print(message)
    print(text_data_json)
    #seri.press(str(msg))

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("desconectado")

def on_open(ws):
    print("conectado")
    #def run(*args):
        #camera=VideoCamera()
        #camera.start()
        #i=0;
        #while 1:
          #ws.send(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':base64.b64encode(camera.get_frame()).decode('ascii')}))
          #base64.b64encode(camera.get_frame()).decode('ascii')
          #i=i+1;
          #print(i)
        
	#thread.start_new_thread(run,() )

def videos(camera,ws,i):
    ws.send(json.dumps({'userFrom':'2','userTo': '1','type':'imagen','message':base64.b64encode(camera.get_frame()).decode('ascii')}))
    #base64.b64encode(camera.get_frame()).decode('ascii')
    i=i+1;
    print(i)
    timer = threading.Timer(0.001, videos,args=(camera,ws,i))
    timer.start()

if __name__ == "__main__":
    camera = VideoCamera()
    camera.start()
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://ritaportal.udistrital.edu.co:10207/jordan",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    time.sleep(1)
    i=0
    timer = threading.Timer(0.001, videos,args=(camera , ws,i))
    timer.start()
    ws.on_open = on_open
    ws.run_forever()

