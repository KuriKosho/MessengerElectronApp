import useSpotifyAPI from '@renderer/hooks/useSpotifyAPI'
import { Album, Artist, ArtistsResponse, Playlist } from '@renderer/types/spotify'
import React, { useEffect, useState } from 'react'
import AudioWidgetCard from './AudioWidgetCard'
import './styles.css'
interface AudioWidgetProps {
  artistID?: string | number
}
const AudioWidget: React.FC<AudioWidgetProps> = ({ artistID }) => {
  const [similar, setSimilar] = useState<Artist[]>([])
  const [featured, setFeatured] = useState<Playlist[]>([])
  const [newRelease, setNewRelease] = useState<Album[]>([])
  const {
    data: similarData,
    loading: similarLoading,
    error: similarError
  } = useSpotifyAPI<ArtistsResponse>(`/artists/${artistID}/related-artists`)
  useEffect(() => {
    console.log('Similar Artists', similarData, 'Artist ID', artistID)
    if (similarData) {
      setSimilar(similarData.artists)
      console.log('Similar Artists', similarData, 'Artist ID', artistID)
    }
  }, [similarData])
  return (
    <div className="widgets-body flex flex-row flex-wrap items-center">
      <AudioWidgetCard title="Similar Artists" similar={similar} />
      <AudioWidgetCard title="Made For You" featured={featured} />
      <AudioWidgetCard title="New Releases" newRelease={newRelease} />
    </div>
  )
}

export default AudioWidget
