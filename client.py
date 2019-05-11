import websocket
try:
    import thread
except ImportError:
    import _thread as thread
import time

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("desconectado")

def on_open(ws):
    def run(*args):
        ws.send(JSON.stringify({'userFrom':'Jordan','userTo': 'Rita','message':'Jordan en linea'}));)
        #time.sleep(1)
        #ws.close()
        print("envio")
    #thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://ritaportal.udistrital.edu.co:10207",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()