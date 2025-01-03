import React from 'react'
import { IconContext } from 'react-icons'
import { FaPause } from 'react-icons/fa'
import { IoPlay, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5'
import './styles.css'
interface AudioControlProps {
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  handleNext: () => void
  handlePrev: () => void
}
const AudioControl: React.FC<AudioControlProps> = ({
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev
}) => {
  return (
    <IconContext.Provider value={{ size: '35px', color: '#C4D0E3' }}>
      <div className="controls-wrapper flex">
        <div className="action-btn flex" onClick={handlePrev}>
          <IoPlaySkipBack />
        </div>
        <div
          className={isPlaying ? 'play-pause-btn flex active' : 'play-pause-btn flex'}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <FaPause /> : <IoPlay />}
        </div>
        <div className="action-btn flex" onClick={handleNext}>
          <IoPlaySkipForward />
        </div>
      </div>
    </IconContext.Provider>
  )
}

export default AudioControl
