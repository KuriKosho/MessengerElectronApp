import { Album } from '@renderer/types/spotify'
import React, { useRef } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { MdPlayCircleFilled } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import './trending.css'

interface FeedItemProps {
  title: string
  album: Album[]
}
const FeedItem: React.FC<FeedItemProps> = ({ album, title }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const navi = useNavigate()
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }
  const handleListen = (id: string, type: string) => {
    // navi.goTo('player', { id: id, type: type })
    navi(`/music/player/${type}/${id}`)
  }

  return (
    <div className="flex flex-col w-100">
      <div className="flex w-100 justify-between items-center">
        <h3 className="title">{title}</h3>
      </div>
      <div className="stories-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          <IoIosArrowBack />
        </button>
        <div className="stories-scroll" ref={scrollContainerRef}>
          {album.map((album) => (
            <div
              className="story position-relative"
              key={album.id}
              onClick={() => handleListen(album.id, 'albums')}
            >
              <img src={album.images[0].url} alt={album.name} />
              <p
                data-tooltip-id={`tooltip-${album.id}`}
                data-tooltip-content={album.name}
                data-tooltip-place="bottom-end"
              >
                {album.name.length > 10 ? album.name.substring(0, 10) + '...' : album.name}
              </p>
              <div className="story-play">
                <MdPlayCircleFilled size={25} />
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  )
}

export default FeedItem
