import Layout from '@renderer/components/layout'
import MusicHeader from '@renderer/components/music-header'
import AudioPlayer from '@renderer/components/music/AudioPlayer'
import AudioSongCard from '@renderer/components/music/AudioSongCard'
import AudioWidget from '@renderer/components/music/AudioWidget'
import MusicQueue from '@renderer/components/music/MusicQueue'
import useSpotifyAPI from '@renderer/hooks/useSpotifyAPI'
import { PlaylistTracksResponse, Track } from '@renderer/types/spotify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './player.css'
const MusicPlayerPage = () => {
  const { id, type } = useParams<{ id: string; type: string }>()
  const [endpoint, setEndpoint] = useState<string>('')
  useEffect(() => {
    console.log('Music Player Page ID:', id)
    console.log('Music Player Page Type:', type)
    switch (type) {
      case 'playlists':
        setEndpoint(`/playlists/${id}/tracks`)
        break
      case 'albums':
        setEndpoint(`/albums/${id}/tracks`)
        break
      default:
        setEndpoint(`/playlists/${id}/tracks`)
        break
    }
  }, [id, type])
  const { data, loading, error } = useSpotifyAPI<PlaylistTracksResponse>(endpoint)
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    setCurrentTrack(tracks[currentIndex])
  }, [currentIndex, tracks])

  useEffect(() => {
    console.log('Music Player Page ID:', id)
    console.log('Music Player Page Data:', data)
    if (data) {
      setTracks(data.items.map((item) => item.track))
      setCurrentTrack(data.items[0]?.track)
    }
  }, [data])
  if (loading) return <p>Loading tracks...</p>
  if (error) return <p>Error: {error}</p>
  return (
    <div className="flex flex-row h-full w-full ">
      <Layout />
      <div className="w-full h-full">
        <MusicHeader />
        <div className="w-full h-full">
          <div className="screen-container flex">
            <div className="left-player-body">
              <AudioPlayer
                currentTrack={currentTrack || ({} as Track)}
                total={tracks}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
              <AudioWidget artistID={currentTrack?.album?.id} />
            </div>
            <div className="right-player-body h-100">
              <AudioSongCard album={currentTrack?.album} />
              <MusicQueue tracks={tracks} setCurrentIndex={setCurrentIndex} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayerPage
