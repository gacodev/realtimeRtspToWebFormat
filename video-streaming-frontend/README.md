# Real-Time Video Streaming with Animated Loading

This project demonstrates how to stream video content in real-time from a camera using an Express.js server and display it in a React application. During the loading phase, a text animation indicates that the video is being fetched and prepared.

## Project Structure

- **Backend**: An Express.js server that streams video content from an RTSP URL.
- **Frontend**: A React application that displays the video and a loading animation.

## Backend

The backend server is implemented using Express.js and `fluent-ffmpeg` to handle video streaming. It reads the video from an RTSP source and streams it to the client in real-time.

### Setup

1. **Clone the repository**:
   ```bash
   git clone 
   cd <repository-folder>
