import Layout from '@renderer/components/layout'
import MusicHeader from '@renderer/components/music-header'
import FeedItem from '@renderer/components/music/FeedItem'
import useSpotifyAPI from '@renderer/hooks/useSpotifyAPI'
import { Album } from '@renderer/types/spotify'
import { useEffect, useState } from 'react'

const MusicTrendingPage = () => {
  const { data, loading, error } = useSpotifyAPI<any>('/browse/new-releases')
  const [newReleases, setNewReleases] = useState<Album[] | null>(null)
  useEffect(() => {
    if (data?.albums.items) {
      setNewReleases(data.albums.items)
      console.log(data)
    }
  }, [data])
  if (loading) return <p>Loading new releases...</p>
  if (error) return <p>Error: {error}</p>
  return (
    <div className="flex flex-row h-full w-full ">
      <Layout />
      <div className="w-full h-full">
        <MusicHeader />
        <div className="screen-container flex p-2 w-100 relative">
          <FeedItem title="New Releases" album={newReleases || []} />
        </div>
        <div className="screen-container flex p-2 w-100 relative">
          <FeedItem title="Hot trending" album={newReleases || []} />
        </div>
        <div className="screen-container flex p-2 w-100 relative">
          <FeedItem title="Top 1000" album={newReleases || []} />
        </div>
      </div>
    </div>
  )
}

export default MusicTrendingPage
