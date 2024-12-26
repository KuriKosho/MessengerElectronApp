import Layout from '@renderer/components/layout'
import MusicHeader from '@renderer/components/music-header'
import useSpotifyAPI from '@renderer/hooks/useSpotifyAPI'
import { Playlist } from '@renderer/types/spotify'
import {
  SCOPES,
  SPOTIFY_AUTH_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI
} from '@renderer/utils/spotifyPath'
import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './library.css'
const MusicLibraryPage = () => {
  const { data, loading, error } = useSpotifyAPI<{ items: Playlist[] }>('/me/playlists')
  const navi = useNavigate()
  if (loading) return <p>Loading playlists...</p>

  const handleLogin = () => {
    const scopes = SCOPES.join('%20')
    const authUrl = `${SPOTIFY_AUTH_URL}?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scopes}&show_dialog=true`
    window.location.href = authUrl
  }
  const playPlaylist = async (playlistId: string) => {
    // navi.goTo('player', { id: playlistId, type: 'playlists' })
    navi(`/music/player/playlists/${playlistId}`)
  }
  if (error)
    return (
      <button onClick={handleLogin} className="position-absolute bottom-0">
        Login to Spotify
      </button>
    )
  const renderPlaylists = () => {
    return (
      <>
        <div className="screen-container w-100">
          <div className="library-body">
            {data?.items.map((playlist) => (
              <div
                className="playlist-card position-relative"
                key={playlist.id}
                onClick={() => playPlaylist(playlist.id)}
              >
                <img src={playlist.images[0].url} className="playlist-image" alt="Playlist-Art" />
                {/* Made max length of name */}
                {/* <p className="playlist-title">{playlist.name}</p> */}
                <p className="playlist-title">
                  {playlist.name.length > 13
                    ? playlist.name.substring(0, 13) + '...'
                    : playlist.name}
                </p>
                <p className="playlist-subtitle">{playlist.tracks.total} Songs</p>
                <div className="playlist-fade">
                  <Play size={30} color="#000000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
  return (
    <div className="flex flex-row h-full w-full ">
      <Layout />
      <div className="w-full h-full">
        <MusicHeader />
        <div className="flex w-100 h-100">
          {data?.items.length ? (
            renderPlaylists()
          ) : (
            <button onClick={handleLogin} className="position-absolute bottom-0">
              Login to Spotify
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MusicLibraryPage
