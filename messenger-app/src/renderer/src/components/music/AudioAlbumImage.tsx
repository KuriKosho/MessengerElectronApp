import React from 'react'
import './styles.css'
interface AudioAlbumImageProps {
  url: string
}
const AudioAlbumImage: React.FC<AudioAlbumImageProps> = ({ url }) => {
  return (
    <div className="albumImage flex">
      <img src={url} alt="album art" className="albumImage-art" />
      <div className="albumImage-shadow">
        <img src={url} alt="shadow" className="albumImage-shadow" />
      </div>
    </div>
  )
}

export default AudioAlbumImage
