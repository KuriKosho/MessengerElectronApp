import { Track } from '@renderer/types/spotify'
import React, { useEffect, useRef, useState } from 'react'
import AudioControl from './AudioControl'
import AudioProgress from './AudioProgress'
import AudioWave from './AudioWave'
import './styles.css'

interface AudioPlayerProps {
  currentTrack: Track
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  total: Track[]
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentIndex,
  currentTrack,
  setCurrentIndex,
  total
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackProgress, setTrackProgress] = useState(0)
  const audioSrc = total[currentIndex]?.preview_url

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const isReady = useRef(false)

  const { duration } = audioRef.current || {}
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0

  // Helper: Format time
  const addZero = (n: number) => (n > 9 ? '' + n : '0' + n)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${addZero(minutes)}:${addZero(secs)}`
  }

  // Update timer
  const startTimer = () => {
    clearInterval(intervalRef.current!)
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current?.ended) {
        handleNext()
      } else if (audioRef.current) {
        setTrackProgress(audioRef.current.currentTime)
      }
    }, 1000)
  }

  // Play/Pause logic
  useEffect(() => {
    if (!audioRef.current || !audioSrc) return

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('Audio play error:', error)
        setIsPlaying(false)
      })
      startTimer()
    } else {
      audioRef.current.pause()
      clearInterval(intervalRef.current!)
    }
  }, [isPlaying])

  // Track change logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    if (audioSrc) {
      audioRef.current = new Audio(audioSrc)
      setTrackProgress(0)

      if (isReady.current) {
        audioRef.current.play().then(() => setIsPlaying(true))
        startTimer()
      } else {
        isReady.current = true
      }
    }
  }, [audioSrc])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      clearInterval(intervalRef.current!)
    }
  }, [])

  // Update artist list
  const [artists, setArtists] = useState<string>('')
  useEffect(() => {
    const artistNames = currentTrack?.album?.artists?.map((artist: any) => artist.name).join(', ')
    setArtists(artistNames || '')
  }, [currentTrack])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total.length - 1 ? prev + 1 : 0))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total.length - 1))
  }

  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <AudioProgress
          percentage={currentPercentage}
          isPlaying={isPlaying}
          image={currentTrack?.album?.images[0]?.url}
          size={300}
          color="#C96850"
        />
      </div>
      <div className="player-right-body flex">
        {/* <p className="song-title">{currentTrack?.name}</p> */}
        {/* Make it shorter */}
        <p className="song-title">
          {currentTrack?.name?.length > 17
            ? currentTrack?.name.substring(0, 17) + '...'
            : currentTrack?.name}
        </p>
        <p className="song-artist">{artists}</p>
        <div className="player-right-bottom flex">
          <div className="song-duration flex">
            <p className="duration">{formatTime(trackProgress)}</p>
            <AudioWave isPlaying={isPlaying} />
            <p className="duration">{formatTime(duration || 0)}</p>
          </div>
          <AudioControl
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
// import React, { useEffect, useRef, useState } from 'react';
// import './styles.css';
// import { Track } from '../types/spotify';

// interface AudioPlayerProps {
//   currentTrack: Track;
//   currentIndex: number;
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
//   total: Track[];
// }

// const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentIndex, currentTrack, setCurrentIndex, total }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [trackProgress, setTrackProgress] = useState(0);
//   const audioSrc = total[currentIndex]?.preview_url; // Use full track URL if available

//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const intervalRef = useRef<number | null>(null);
//   const isReady = useRef(false);

//   const { duration } = audioRef.current || {};
//   const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

//   const addZero = (n: number) => (n > 9 ? "" + n : "0" + n);
//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${addZero(minutes)}:${addZero(secs)}`;
//   };

//   const startTimer = () => {
//     clearInterval(intervalRef.current!);
//     intervalRef.current = window.setInterval(() => {
//       if (audioRef.current?.ended) {
//         handleNext();
//       } else if (audioRef.current) {
//         setTrackProgress(audioRef.current.currentTime);
//       }
//     }, 1000);
//   };

//   useEffect(() => {
//     if (!audioRef.current || !audioSrc) return;

//     if (isPlaying) {
//       audioRef.current.play().catch((error) => {
//         console.error("Audio play error:", error);
//         setIsPlaying(false);
//       });
//       startTimer();
//     } else {
//       audioRef.current.pause();
//       clearInterval(intervalRef.current!);
//     }
//   }, [isPlaying]);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }

//     if (audioSrc) {
//       audioRef.current = new Audio(audioSrc);
//       setTrackProgress(0);

//       if (isReady.current) {
//         audioRef.current.play().then(() => setIsPlaying(true));
//         startTimer();
//       } else {
//         isReady.current = true;
//       }
//     }
//   }, [audioSrc]);

//   useEffect(() => {
//     return () => {
//       audioRef.current?.pause();
//       clearInterval(intervalRef.current!);
//     };
//   }, []);

//   useEffect(() => {
//     const handleLoadedMetadata = () => {
//       setTrackProgress(audioRef.current?.currentTime || 0);
//     };

//     audioRef.current?.addEventListener('loadedmetadata', handleLoadedMetadata);

//     return () => {
//       audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
//     };
//   }, [audioSrc]);

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev < total.length - 1 ? prev + 1 : 0));
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total.length - 1));
//   };

//   const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!duration) return;
//     const newTime = (duration * parseFloat(event.target.value)) / 100;
//     if (audioRef.current) {
//       audioRef.current.currentTime = newTime;
//       setTrackProgress(newTime);
//     }
//   };

//   const artists = currentTrack?.album?.artists.map((artist: any) => artist.name).join(", ");

//   return (
//     <div className="audio-player">
//       <div className="track-info">
//         <h2>{currentTrack?.name}</h2>
//         <h3>{artists}</h3>
//         <div className="track-progress">
//           <span>{formatTime(trackProgress)}</span>
//           <input
//             type="range"
//             value={currentPercentage}
//             step="1"
//             min="0"
//             max="100"
//             onChange={handleSeek}
//           />
//           <span>{formatTime(duration || 0)}</span>
//         </div>
//       </div>
//       <div className="controls">
//         <button onClick={handlePrev}>Prev</button>
//         <button onClick={() => setIsPlaying(!isPlaying)}>
//           {isPlaying ? "Pause" : "Play"}
//         </button>
//         <button onClick={handleNext}>Next</button>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;
