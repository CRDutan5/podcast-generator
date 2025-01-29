import { useRef, useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [transcriptType, setTranscriptType] = useState("text-upload");
  const [transcript, setTranscript] = useState("");
  const [file, setFile] = useState(null);
  const [podcastScript, setPodcastScript] = useState("");
  const [displayPlayButton, setDisplayPlayButton] = useState(false);
  const [textDisabled, setTextDisabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTranscriptTypeSelection = (e) => {
    if (e.target.id === "text-upload") {
      setFile(null);
    }
    if (e.target.id === "file-upload") {
      setTranscript("");
    }
    setPodcastScript("");
    setTranscriptType(e.target.id);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
  };

  const handleTranscriptSubmit = async (e) => {
    e.preventDefault();
    if (transcript.length === 0) {
      alert(`Transcript must have content`);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/generate-podcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript }),
        }
      );
      const data = await response.json();
      setPodcastScript(data.transcript);
      setDisplayPlayButton(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert(`You must attach an audio file!`);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch(
        `http://localhost:3000/api/generate-transcript`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate transcript");
      }
      const data = await response.json();
      setPodcastScript(data.transcript);
      setDisplayPlayButton(true);
      alert("Transcript generated successfully!");
    } catch (error) {
      console.error("Failed to transfer audio", error);
      alert("Something went wrong while processing the audio.");
    }
  };

  const playTextToSpeech = () => {
    if (speechSynthesis.paused && speechSynthesis.speaking) {
      return speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(podcastScript);
    utterance.rate = 1.2;
    utterance.addEventListener("end", () => {
      setTextDisabled(false);
      setDisplayPlayButton(false);
    });
    setTextDisabled(true);
    speechSynthesis.speak(utterance);
  };

  const pauseTextToSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setDisplayPlayButton(false);
      setTextDisabled(false);
    }
  }, [transcriptType]);

  return (
    <div className="min-h-[100vh] flex align-middle flex-col justify-center items-center bg-blue-200">
      <div className="flex flex-col bg-white items-center p-12 rounded-2xl w-[50vw] max-h-fit gap-y-6 justify-center align-middle mx-auto">
        <div>
          <h1 className="text-5xl">Podcast Generator</h1>
        </div>
        <div className="flex flex-row gap-y-6 gap-x-6 w-full justify-center mx-auto">
          <button
            className=" border-2 border-black p-2 rounded-xl w-full font-bold text-white bg-blue-500 hover:cursor-grab"
            id="file-upload"
            onClick={handleTranscriptTypeSelection}
          >
            Upload Audio
          </button>
          <button
            className="border-2 border-black p-2 w-full rounded-xl font-extrabold text-white bg-blue-500 hover:cursor-grab"
            id="text-upload"
            onClick={handleTranscriptTypeSelection}
          >
            Enter Transcript
          </button>
        </div>
        <form
          action="submit"
          className="flex flex-col w-full gap-y-6"
          onSubmit={
            transcriptType === "file-upload"
              ? handleAudioSubmit
              : handleTranscriptSubmit
          }
        >
          {transcriptType === "file-upload" ? (
            <input
              type="file"
              onChange={handleFileChange}
              className="border-2 border-black max-w-fit"
            />
          ) : (
            <textarea
              className="border-2 border-black w-full h-52"
              onChange={handleTranscriptChange}
              value={transcript}
              disabled={textDisabled}
            />
          )}
          {transcriptType && (
            <button
              className="border-2 border-black p-2 w-full rounded-xl font-extrabold text-white bg-blue-500 hover:cursor-grab"
              type="submit"
            >
              Generate Podcast
            </button>
          )}
        </form>
        {displayPlayButton && (
          <button
            className="border-2 border-black p-2 w-full rounded-xl font-extrabold text-white bg-blue-500"
            onClick={playTextToSpeech}
          >
            Play!
          </button>
        )}
        {speechSynthesis.speaking && (
          <button
            onClick={pauseTextToSpeech}
            className="border-2 border-black p-2 w-full rounded-xl font-extrabold text-white bg-blue-500"
          >
            Pause ||
          </button>
        )}
        {podcastScript && <p>{podcastScript}</p>}
      </div>
    </div>
  );
}

export default App;
