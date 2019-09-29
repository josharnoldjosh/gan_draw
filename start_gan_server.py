from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy
from io import StringIO

# test
from PIL import Image
from io import BytesIO
import base64

import os

from seg2real import Seg2Real

import time

# Init the server
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)

model = Seg2Real()

@app.route('/get_image', methods = ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS'])
def get_image():
    if request.method == 'POST':
        image_name = request.form['image_name']        
        image.open('./'+image_name)
        buffered = BytesIO()
        image.save(buffered, format="png")        
        img_str = 'data:image/png;base64,'+base64.b64encode(buffered.getvalue()).decode('ascii')
        return img_str
    return ""

@app.route('/save_image', methods = ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS'])
def save_image():
    if request.method == 'POST':

        data = request.form['file']
        py_data = data.replace('data:image/png;base64,','')
        image = Image.open(BytesIO(base64.b64decode(py_data))).convert('RGB') # Drop alpha

        unique_id = request.form['unique_id']
        turn_idx = request.form['turn_idx']

        image.save("/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/saved_data/"+unique_id+"_"+turn_idx+"_real.jpg")

        (red, green, blue) = image.split()        
        image = red.convert('L')
        image = model.seg2real(image)    
        buffered = BytesIO()
        image.save(buffered, format="png")        
        image.save("/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/saved_data/"+unique_id+"_"+turn_idx+"_synthetic.jpg")
    return ""

@app.route('/', methods = ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS'])
def root():
    if request.method == 'POST':              

        # load image
        data = request.form['file']
        py_data = data.replace('data:image/png;base64,','')
        image = Image.open(BytesIO(base64.b64decode(py_data))).convert('RGB') # Drop alpha

        (red, green, blue) = image.split()        

        image = red.convert('L')

        image = model.seg2real(image)
        
        buffered = BytesIO()
        image.save(buffered, format="png")        
        image.save('test.png')
        img_str = 'data:image/png;base64,'+base64.b64encode(buffered.getvalue()).decode('ascii')    
        return img_str
    else:
        return "get request"

if __name__ == '__main__':
    app.run(port=9000))