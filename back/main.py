import os
from fastapi import FastAPI, File, UploadFile
from fastapi.encoders import jsonable_encoder
import tensorflow as tf
from tensorflow import keras
import librosa
import numpy as np
import os
import cv2
import numpy as np
import webrtcvad
from moviepy.editor import VideoFileClip
import pickle

# Load the encoder, scaler, and model from disk
with open('encoder.pkl', 'rb') as encoder_file:
    encoder = pickle.load(encoder_file)

with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)
vad = webrtcvad.Vad()  # voiceDetection Model
vad.set_mode(3)
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades+'haarcascade_frontalface_default.xml')  # faceDetection Model
Amodel = keras.models.load_model('Mymodel')  # speech emotion detection model
Imodel = keras.models.load_model('faceModel')  # face emotion detection model
threshold=0.088
segment_duration = 2 # seconds
frame_rate = 2


def extract_features(data, sample_rate):
    # ZCR
    result = np.array([])
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
    result = np.hstack((result, zcr))  # stacking horizontally

    # Chroma_stft
    stft = np.abs(librosa.stft(data))
    # chroma_stft turn a numpy array into 12 numpy arrays
    chroma_stft = np.mean(librosa.feature.chroma_stft(
        S=stft, sr=sample_rate).T, axis=0)
    result = np.hstack((result, chroma_stft))  # stacking horizontally

    # MFCC
    mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mfcc))  # stacking horizontally

    # Root Mean Square Value
    rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
    result = np.hstack((result, rms))  # stacking horizontally

    # MelSpectogram
    mel = np.mean(librosa.feature.melspectrogram(
        y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mel))  # stacking horizontally

    return result


app = FastAPI()


@app.post("/upload-video")
async def upload_video(video: UploadFile = File(...)):
    # Create the videos folder if it doesn't exist
    os.makedirs("videos", exist_ok=True)
    os.makedirs("audio", exist_ok=True)
    # Construct the file location and save the file
    file_location = os.path.join("videos", video.filename)
    with open(file_location, "wb+") as video_file:
        video_content = await video.read()
        video_file.write(video_content)
# Load the video file using moviepy
    video_clip = VideoFileClip(file_location)
    cap = cv2.VideoCapture(file_location)
    # Extract the audio from the video clip
    audio_clip = video_clip.audio

    # Save the audio to a file
    audio_file_path = os.path.join("audio", "audio.wav")
    audio_clip.write_audiofile(audio_file_path)
    
    data, sample_rate = librosa.load(audio_file_path)
    # sample_rate is the number of samples per second
    audio_duration = len(data) / sample_rate

    num_segments = int(np.ceil(audio_duration / segment_duration))
    result1 = []
    mean_output1 = []
    # Split the audio data into segments
    segments = np.array_split(data, num_segments)
    for segment in segments:#pass through the audio model
        # Perform any necessary preprocessing on the segment
        zc = np.mean(librosa.feature.zero_crossing_rate(y=segment).T, axis=0)
        if zc < threshold:
            preprocessed_segment = scaler.transform(extract_features(
                segment, sample_rate).reshape(1, 162)).reshape(1, 162, 1)

            # Pass the preprocessed segment through the AI model
            output = Amodel.predict(preprocessed_segment)
            
            
            result1.append(encoder.inverse_transform(output)[0][0])
        else:
            output = np.array([0, 0, 0, 0, 0, 0, 0])
            result1.append("no voice detected")
        mean_output1.append(output)
    # Load the video
    
    video = cv2.VideoCapture(file_location)
    current_frame_rate = video.get(cv2.CAP_PROP_FPS)
    frame_interval = int(current_frame_rate / frame_rate) 
    # Calculate the total number of frames
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))

    # Initialize variables
    mean_output2 = []
    result2=[]
    face_detected=False
    output_buffer = np.array([0,0,0,0,0,0,0])
    current_time = 0
    frame_count = 0
    frame_traited_count=0
    counti=0
    face_count=0
    # Iterate over each frame
    while video.isOpened():
        ret, frame = video.read()

        if not ret:
            break
        # Pass the frame through your AI model
        if frame_count % frame_interval == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            frame_traited_count+=1
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
            for (x, y, w, h) in faces:
                face_detected=True
                sub_picture = (gray[y:y+h, x:x+w])
                input=cv2.resize(sub_picture,(48,48)).reshape(1,48,48,1)
                output=Imodel.predict(input)
                output_buffer=(output_buffer+output)/2
                
                break
            # Accumulate the output in the buffer
            
            face_count=0
            
            # Calculate the current time based on the frame count and frame rate
            current_time = frame_traited_count / frame_rate
            #if(face_detected):
            #    cv2.imshow("Frame", sub_picture)
            #    cv2.waitKey(1)
            # Check if the current time exceeds the time interval
            if current_time >= segment_duration:
                # Calculate the mean of the model's output in the buffer
                
                # Store or process the mean value as needed
                mean_output2.append(output_buffer)
                if(face_detected):
                  result2.append(encoder.inverse_transform(output_buffer)[0][0])
                else:
                    result2.append("no face detected")  
                
                # Reset variables
                output_buffer = np.array([0,0,0,0,0,0,0])
                frame_traited_count = 0
                face_detected=False
                counti+=1
        frame_count += 1
        
        # Stop iterating if we have processed all frames
        if frame_count >= total_frames:
            break

    # Release the video object
    video.release()
    result3=[]
    mean_output3=[(x + y)/2 for x, y in zip(mean_output1, mean_output2)]
    for a in mean_output3:
        if((a!=np.array([0,0,0,0,0,0,0])).any()):
            result3.append(encoder.inverse_transform(a)[0][0])
        else:
            result3.append("No Data")
    array_1d = np.mean(mean_output3, axis=0)
    if(len(result1)>len(result2)):
        del result1[len(result1)-1]

    return jsonable_encoder({'audio':dict(enumerate(result1)),'image':dict(enumerate(result2)),'both':dict(enumerate(result3)),'overall':encoder.inverse_transform(array_1d)[0][0]})
