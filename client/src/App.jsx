import { useRef, useState } from "react";
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

  const handleTranscriptTypeSelection = (e) => {
    if (e.target.id === "text-upload") {
      setFile(null);
    }
    if (e.target.id === "file-upload") {
      setTranscript("");
    }
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
      console.log(data);
      setPodcastScript(data.transcript);
      setDisplayPlayButton(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleAudioSubmit = (e) => {
    e.preventDefault();
    try {
    } catch (error) {}
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
  console.log("transcript", transcriptType);
  console.log("file", file);

  return (
    <div className="flex flex-col items-center gap-y-6 justify-center align-middle min-h-screen">
      <div>
        <h1 className="text-7xl">Podcast Generator</h1>
      </div>
      <div className="flex flex-row gap-y-6 gap-x-6">
        <button
          className=" border-2 border-black p-2 hover:cursor-grab"
          id="file-upload"
          onClick={handleTranscriptTypeSelection}
        >
          Upload Audio
        </button>
        <button
          className="border-2 border-black p-2 hover:cursor-grab"
          id="text-upload"
          onClick={handleTranscriptTypeSelection}
        >
          Enter Transcript
        </button>
      </div>
      <form
        action="submit"
        className="flex flex-col h-50 gap-y-6"
        onSubmit={handleTranscriptSubmit}
      >
        {transcriptType === "file-upload" ? (
          <input type="file" onChange={handleFileChange} />
        ) : (
          <textarea
            className="border-2 border-black w-2xl h-52"
            onChange={handleTranscriptChange}
            value={transcript}
            disabled={textDisabled}
          />
        )}
        {transcriptType && (
          <button
            className="border-2 border-black p-2 hover:cursor-grab"
            type="submit"
          >
            Generate Podcast
          </button>
        )}
      </form>
      {displayPlayButton && (
        <button
          className="border-2 border-black p-2 hover:cursor-grab w-100"
          onClick={playTextToSpeech}
        >
          Play!
        </button>
      )}
      {speechSynthesis.speaking && (
        <button onClick={pauseTextToSpeech}>Pause ||</button>
      )}
    </div>
  );
}

export default App;
