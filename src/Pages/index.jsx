import React, { useState, useRef, useEffect } from "react";
import video from "../assets/video-camera.png";
import audio from "../assets/microphone.png";
import { Header } from "../components/header";
import { ToggleVideo, ToggleAudio } from "../components/togglebtn";

const Main = () => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const videoRef = useRef(null); // Use useRef for video element
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Use useRef for media recorder
  const linkRef = useRef(""); // Use useRef for the video link
  const cameraActiveRef = useRef(true); // Use useRef for camera activation
  const audioActiveRef = useRef(true);

  const handleStartRecording = async () => {
    try {
      const constraints = {
        video: cameraActiveRef.current ? { mediaSource: "screen" } : false,
        audio: audioActiveRef.current ? true : false,
      };

      const userStream = await navigator.mediaDevices.getDisplayMedia(
        constraints
      );
      setStream(userStream);
      // Use the stream for recording or displaying in a video element
      setRecording(true);

      // Create a new MediaRecorder instance and store it in the useRef
      mediaRecorderRef.current = new MediaRecorder(userStream);

      // Event handler for data available
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const videoBlob = new Blob([event.data], { type: "video/webm" });
          videoRef.current.src = URL.createObjectURL(videoBlob);
          linkRef.current = videoRef.current.src; // Store the video link in the ref
        }
      };

      // Start recording
      mediaRecorderRef.current.start();
    } catch (error) {
      // Handle errors, e.g., user denied permission
      console.error("Error capturing screen:", error);
    }
  };

  const handleStopRecording = () => {
    // Implement stop recording logic here
    if (stream) {
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop(); // Stop each track in the stream
      });

      setRecording(false); // Update the recording state to false
      setStream(null); // Clear the stream from state

      // Stop the MediaRecorder instance
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      // Set the src attribute of the video element
      if (videoRef.current) {
        videoRef.current.src = linkRef.current;
      }
    }
  };

  const handleSaveRecording = () => {
    const blob = new Blob([event.data], { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded_video.webm'; // Set the filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  useEffect(() => {
    const accessWebcam = async () => {
      try {
        if (isCameraOn) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          // If camera is turned off, stop the video stream
          if (videoRef.current) {
            const stream = videoRef.current.srcObject;
            if (stream) {
              const tracks = stream.getTracks();
              tracks.forEach((track) => track.stop());
            }
            videoRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    accessWebcam();

    // Cleanup
    return () => {
      if (!isCameraOn && videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    const accessAudio = async () => {
      try {
        if (isAudioOn) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          if (audioRef.current) {
            audioRef.current.srcObject = stream;
          }
        } else {
          // If audio is turned off, stop the audio track
          if (audioRef.current) {
            const stream = audioRef.current.srcObject;
            if (stream) {
              const tracks = stream.getTracks();
              tracks.forEach((track) => track.stop());
            }
            audioRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error("Error accessing audio:", error);
      }
    };

    accessAudio();

    return () => {
      if (!isAudioOn && audioRef.current) {
        const stream = audioRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  });

  const handleToggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const handleToggleAudio = () => {
    setIsAudioOn((prevState) => !prevState);
  };
  return (
    <div className="main">
      <Header />
      <div className="text">
        <p>This extension helps you record and share help videos with ease</p>
      </div>

      <div className="SetVidAud">
        <div className="video">
          <div className="box">
            <img src={video} alt="" />
            Camera
          </div>

          <ToggleVideo checked={isCameraOn} onChange={handleToggleCamera} />
        </div>
        <div className="audio">
          <div className="box">
            <img src={audio} alt="" />
            Audio
          </div>
          <ToggleAudio checkedAud={isAudioOn} onChangeAud={handleToggleAudio} />
        </div>
      </div>
      <div className="button">
        {recording ? (
          <button onClick={handleStopRecording}>
            <div className="recording">Stop Recording</div>
          </button>
        ) : (
          <button onClick={handleStartRecording}>
            <div className="recording">Start Recording</div>
          </button>
        )}
      </div>

      <a href={a.href} target="_blank" rel="noreferrer">
        Click here to view the recorded video
      </a>
      <div className="videobox">
        <video ref={videoRef} autoPlay playsInline muted={!isCameraOn} />
      </div>
    </div>
  );
};

export default Main;
