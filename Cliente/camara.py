import cv2
import base64

def show_webcam(mirror=False):
    cam = cv2.VideoCapture(0)
    while True:
        ret_val, img = cam.read()
        if mirror:
            img = cv2.flip(img, 1)
        image=cv2.resize(img,(320,240),4)
        ret, jpeg = cv2.imencode('.jpg', image)
        out = base64.b64encode(jpeg.tobytes()).decode('ascii')
        cv2.imshow('my webcam', image)
        if cv2.waitKey(1) == 27:
            break  # esc to quit
    cv2.destroyAllWindows()


def main():
    show_webcam(mirror=True)


if __name__ == '__main__':
    main()
