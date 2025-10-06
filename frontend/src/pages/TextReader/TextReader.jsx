import React, { useState, useEffect, useRef } from "react";
import { Upload, Play, Pause, StopCircle, Volume2, RefreshCw } from "lucide-react";
import "./TextReader.css";

const TextReader = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [show, setShow] = useState(false);
  const [converting, setConverting] = useState(false);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
    }
    return () => {
      if (audioUrl && audioRef.current) {
        audioRef.current.ontimeupdate = null;
      }
    };
  }, [audioUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPlaybackRate(1)
      setDuration(0)
      setShow(false)
      setIsUsingFallback(false)
      setAudioUrl(null)
      setCurrentTime(0)
      setIsPlaying(false)
      
      
      setFile(selectedFile);
      setActiveTab("text");
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = (selectedFile) => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`${import.meta.env.VITE_URL}/textreader`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setText(data.text);
        setError("");
      })
      .catch(error => {
        console.error("Error uploading file:", error);
        setError("Error processing file. Please try again.");
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleGenerateAudio = async () => {
    if (!text) {
      setError("Please upload a file with text content first.");
      return;
    }

    try {
      setConverting(true)
      const response = await fetch(`${import.meta.env.VITE_URL}/generate-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error('Audio generation failed');
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setIsUsingFallback(false);
      setActiveTab("audio");
      setConverting(false)
      setShow(true)
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setError("File is too large!!! Click on Audio tab for audio.");
      useFallbackTTS();
    }
  };

  const useFallbackTTS = () => {
    setIsUsingFallback(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      setError("Text-to-speech is not supported in your browser.");
    }
  };
  

  const handlePlayPause = () => {
    if (isUsingFallback) {
      if (isPlaying) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (isUsingFallback) {
      window.speechSynthesis.cancel();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSliderChange = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setPlaybackRate(newRate);
    if (isUsingFallback && speechRef.current) {
      speechRef.current.rate = newRate;
    } else if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  return (
    <div className="text-reader-container">
      {/* Guidelines Section */}
      <div className="guidelines">
        <h2 className="guidelines-title">Important Guidelines</h2>
        <ul className="guidelines-list">
          <li>Handwritten PDFs or handwritten notes are not allowed.</li>
          <li>PDFs containing images are not allowed.</li>
          <li>
            Maximum PDF size: <b>5MB</b>.
          </li>
          <li>
            If you have images in a non-handwritten PDF, you can upload
            screenshots of those images, which are acceptable.
          </li>
        </ul>
      </div>
  
      <div className="reader-header">
        <div className="header-title">
          <Volume2 />
          Text to Speech Reader
        </div>
        <div className="header-description">
          Upload a document and convert it to speech
        </div>
      </div>
  
      <div className="reader-content">
        <div className="tabs-container">
          <div className="tabs-list">
            <button
              className="tab-trigger"
              data-state={activeTab === "upload" ? "active" : ""}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
            <button
              className="tab-trigger"
              data-state={activeTab === "text" ? "active" : ""}
              onClick={() => setActiveTab("text")}
            >
              Text
            </button>
            <button
              className="tab-trigger"
              data-state={activeTab === "audio" ? "active" : ""}
              onClick={() => setActiveTab("audio")}
            >
              Audio
            </button>
          </div>
  
          <div className="tab-content">
            {activeTab === "upload" && (
              <div className="upload-zone">
                <input
                  type="file"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="upload-input"
                />
                <Upload className="upload-icon" />
                <p className="upload-text">
                  Drop your file here or click to browse
                </p>
                <p className="upload-subtext">Supports PDF, TXT, and images</p>
              </div>
            )}
  
            {activeTab === "text" && (
              <div className="text-display">
                {text ? (
                  <>
                    <pre className="text-content">{text}</pre>
                    <button
                      className="convert-button"
                      onClick={handleGenerateAudio}
                    >
                      {converting ? "Converting..." : "Convert to Speech"}
                    </button>
                  </>
                ) : file ? (
                  <div className="loading-state">Converting file to text...</div>
                ) : (
                  <div className="empty-state">
                    Upload a file to see extracted text
                  </div>
                )}
              </div>
            )}
  
            {activeTab === "audio" && (
              <div className="audio-controls">
                {audioUrl || isUsingFallback ? (
                  <>
                    {show && (
                      <div className="time-slider">
                        <div className="time-display">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <input
                          type="range"
                          className="slider"
                          value={currentTime}
                          max={duration || 100}
                          step={0.1}
                          onChange={handleSliderChange}
                        />
                      </div>
                    )}
  
                    <div className="playback-controls">
                      <button className="control-button" onClick={handleStop}>
                        <StopCircle />
                      </button>
                      <button
                        className="control-button primary"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? <Pause /> : <Play />}
                      </button>
                    </div>
                    {show && (
                      <div className="speed-control">
                        <div className="speed-label">
                          <RefreshCw />
                          <span>Playback Speed: {playbackRate}x</span>
                        </div>
                        <input
                          type="range"
                          className="slider"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={playbackRate}
                          onChange={handleSpeedChange}
                        />
                      </div>
                    )}
                    {!isUsingFallback && (
                      <audio ref={audioRef} src={audioUrl} />
                    )}
                  </>
                ) : (
                  <div className="loading-state">Converting text to audio...</div>
                )}
              </div>
            )}
          </div>
        </div>
  
        {error && <div className="error-alert">{error}</div>}
      </div>
    </div>
  );
  
};

export default TextReader;