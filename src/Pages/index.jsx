import React, { useState , useRef} from "react";
import Logo from "../assets/Layer 2.png";
import settings from "../assets/setting-2.png";
import close from "../assets/close-circle.png";
import tv from "../assets/monitor.png";
import copy from "../assets/copy.png";
import video from "../assets/video-camera.png";
import audio from "../assets/microphone.png";

const Main = () => {
    const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null); // Use useRef for video element
  const mediaRecorderRef = useRef(null); // Use useRef for media recorder
  const linkRef = useRef(''); // Use useRef for the video link
  const cameraActiveRef = useRef(true); // Use useRef for camera activation
  const audioActiveRef = useRef(true);



  const handleStartRecording = async () => {
    try {
      const constraints = {
        video: cameraActiveRef.current ? { mediaSource: 'screen' } : false,
        audio: audioActiveRef.current ? true : false,
      };

      const userStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      setStream(userStream);
      // Use the stream for recording or displaying in a video element
      setRecording(true);

      // Create a new MediaRecorder instance and store it in the useRef
      mediaRecorderRef.current = new MediaRecorder(userStream);

      // Event handler for data available
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const videoBlob = new Blob([event.data], { type: 'video/webm' });
          videoRef.current.src = URL.createObjectURL(videoBlob);
          linkRef.current = videoRef.current.src; // Store the video link in the ref
        }
      };

      // Start recording
      mediaRecorderRef.current.start();
    } catch (error) {
      // Handle errors, e.g., user denied permission
      console.error('Error capturing screen:', error);
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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Set the src attribute of the video element
      if (videoRef.current) {
        videoRef.current.src = linkRef.current;
      }
    }
  };
  return (
    <div className="body">
      <div className="header">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <h2>HelpMeOut</h2>
        </div>
        <div className="set">
          <img src={settings} alt="set" />
          <img src={close} alt="close" onClick={() => window.close()} />
        </div>
      </div>
      <div className="text">
        <p>This extension helps you record and share help videos with ease</p>
      </div>
      <div className="tabs">
        <div className="tv">
          <img src={tv} alt="tv" />
          <p>Full screen</p>
        </div>
        <div className="copy">
          <img src={copy} alt="copy" />
          <p>Current tab</p>
        </div>
      </div>

      <div className="video">
        <div className="box">
          <img src={video} alt="" />
          Camera
        </div>

        <div className="toggle">
          <input className="toggle_input" type="checkbox" id="toggleBtn"  />
          <label className="toggle_label" for="toggleBtn">
            <div className="toggle-btn"></div>
          </label>
        </div>
      </div>
      <div className="audio">
        <div className="box">
          <img src={audio} alt="" />
          Audio
        </div>
        <div className="toggle">
          <input className="toggle_input" type="checkbox" id="toggleBtn2" />
          <label className="toggle_label" for="toggleBtn2">
            <div className="toggle-btn"></div>
          </label>
        </div>
      </div>
      {recording ? (
        <button onClick={handleStopRecording}><div className="recording">Stop Recording</div></button>
      ) : (
        <button onClick={handleStartRecording}><div className="recording">Start Recording</div></button>
      )}
<a href={linkRef.current} target="_blank" rel="noreferrer">
        Click here to view the recorded video
      {/* <video ref={videoRef} controls /> */}
      </a>
    </div>
  );
};

export default Main;
