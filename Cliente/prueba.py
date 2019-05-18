import cv2
#import serial
import threading

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

def videos(camera,ws):
    camera.get_frame()
    #ws.send(json.dumps({'userFrom':'Jordan','userTo': 'mecanico','message':base64.b64encode(camera.get_frame()).decode('ascii')}))
    print(ws)
    timer = threading.Timer(0.033, videos,args=(camera,ws))
    timer.start()

if __name__ == "__main__":
    ws=5
    camera = VideoCamera()
    camera.start()
    timer = threading.Timer(0.033, videos,args=(camera,ws))
    timer.start()
