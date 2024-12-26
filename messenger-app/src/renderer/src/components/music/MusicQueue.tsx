import { Track } from '@renderer/types/spotify'
import React from 'react'
import './styles.css'
interface MusicQueueProps {
  tracks: Track[]
  setCurrentIndex: (index: number) => void
}
const MusicQueue: React.FC<MusicQueueProps> = ({ tracks, setCurrentIndex }) => {
  return (
    <div className="queue-container flex">
      <div className="queue flex">
        <p className="upNext">Up Next</p>
        <div className="queue-list">
          {tracks?.map((track, index) => (
            <div
              key={index + 'key'}
              className="queue-item flex"
              onClick={() => setCurrentIndex(index)}
            >
              <p className="track-name">{track?.name}</p>
              <p>0:30</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MusicQueue
