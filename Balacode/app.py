from flask import Flask, render_template, Response, request
from PIL import Image
import base64
from io import BytesIO
import win32clipboard as clp
import os
app = Flask(__name__)



@app.route('/', methods = ['GET','POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    elif request.method == 'POST':
        data_url = request.values.get('image')
        content = data_url.split(';')[1]
        im_b64 = content.split(',')[1]
        print(im_b64)
        im_bytes = base64.b64decode(im_b64)
    
    imgdata = base64.b64decode(im_b64)
    filename = 'some_image.png'

    with open(filename, 'wb') as f:
        f.write(imgdata)

    file_path = 'some_image.png'

    clp.OpenClipboard()
    clp.EmptyClipboard()

    # This works for Discord, but not for Paint.NET:
    wide_path = os.path.abspath(file_path).encode('utf-16-le') + b'\0'
    clp.SetClipboardData(clp.RegisterClipboardFormat('FileNameW'), wide_path)
    clp.CloseClipboard()    


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)