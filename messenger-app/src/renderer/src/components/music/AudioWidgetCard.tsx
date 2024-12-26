import React, { useEffect } from 'react'
import { IconContext } from 'react-icons'
import { FaCircleChevronRight } from 'react-icons/fa6'
import AudioWidgetEntry from './AudioWidgetEntry'
import './styles.css'
interface AudioWidgetCardProps {
  title: string
  similar?: any[]
  featured?: any[]
  newRelease?: any[]
}
const AudioWidgetCard: React.FC<AudioWidgetCardProps> = ({
  featured,
  newRelease,
  similar,
  title
}) => {
  useEffect(() => {
    console.log('similar', similar, 'featured', featured, 'newRelease', newRelease)
  }, [featured, newRelease, similar])

  return (
    <div className="widgetcard-body">
      <p className="widget-title">{title}</p>
      {similar
        ? similar.map((artist) => (
            <AudioWidgetEntry
              key={artist?.id}
              title={artist?.name}
              subtitle={artist?.followers?.total + ' Followers'}
              image={artist?.images[2]?.url}
            />
          ))
        : featured
          ? featured.map((playlist) => (
              <AudioWidgetEntry
                key={playlist?.id}
                title={playlist?.name}
                subtitle={playlist?.tracks?.total + ' Songs'}
                image={playlist?.images[0]?.url}
              />
            ))
          : newRelease
            ? newRelease.map((album) => (
                <AudioWidgetEntry
                  key={album?.id}
                  title={album?.name}
                  subtitle={album?.artists[0]?.name}
                  image={album?.images[2]?.url}
                />
              ))
            : null}
      <div className="widget-fade">
        <div className="fade-button">
          <IconContext.Provider value={{ size: '24px', color: '#c4d0e3' }}>
            <FaCircleChevronRight />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default AudioWidgetCard
