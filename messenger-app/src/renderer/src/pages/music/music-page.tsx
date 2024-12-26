import Layout from '@renderer/components/layout'
import MusicHeader from '@renderer/components/music-header'

const MusicPage = () => {
  return (
    <div className="flex flex-row h-full w-full ">
      <Layout />
      <div className="w-full h-full">
        <MusicHeader />
      </div>
    </div>
  )
}

export default MusicPage
