# The Emotion Recognition App Project

Welcome to the repository for our innovative mobile application designed for emotion recognition in videos. This project leverages artificial intelligence to accurately identify emotions through two specialized AI models—one for recognizing emotions from audio and another for detecting facial expressions. Additionally, our application incorporates models to detect the presence of voices and faces in the videos.

![alt text](<first sep.png>)

This versatile application allows users to upload videos from their mobile devices and perform emotion detection on any detected audio or visual elements. Whether it's a subtle facial expression or a distinct voice tone, our app strives to understand the underlying emotions conveyed in the video content.

For a practical demonstration, watch our project demo on YouTube where we provide a brief overview of the emotion prediction process. Watch the demo [here](https://www.youtube.com/watch?v=0uGNMNZdlAY&t).

Additionally, delve into our presentation included in this repository, which outlines the necessity of this project along with detailed insights into the training and deployment processes of our models.

## Technology Stack:

**FastApi:** A modern, fast (high-performance) web framework for building APIs with Python. It's designed to be easy to use while also enabling new, high-level features not available before.
**React Native:** A framework for building native apps using React. It allows for cross-platform mobile app development, which means developers can build mobile apps that run on both iOS and Android using a single codebase.
**TensorFlow:** An open-source library for numerical computation that makes machine learning faster and easier. It's used here primarily for training the emotion recognition models.
**OpenCV:** The leading library for computer vision tasks, used in this project for video frame manipulation and face detection.

## How to run this project:

1-Dependencies:

```bash
npm install
pip install "fastapi[all]
pip install "uvicorn[standard]"
pip install python-multipart
```

2-Run the Backend:

```bash
cd back
uvicorn fast_back.main:app --reload
cd ..
```

3-Run the Frontend:

```bash
cd front
npx expo start --tunnel
cd ..
```

Scan the QR code with the expo app to run the App
