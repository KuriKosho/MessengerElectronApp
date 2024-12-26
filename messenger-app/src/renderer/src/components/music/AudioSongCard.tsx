import React from 'react'
import AudioAlbumImage from './AudioAlbumImage'
import AudioAlbumInfo from './AudioAlbumInfo'
import './styles.css'
interface AudioSongCardProps {
  album: any
}
const AudioSongCard: React.FC<AudioSongCardProps> = ({ album }) => {
  return (
    <div className="songCard-body flex">
      <AudioAlbumImage url={album?.images[0]?.url} />
      <AudioAlbumInfo album={album} />
    </div>
  )
}

export default AudioSongCard
