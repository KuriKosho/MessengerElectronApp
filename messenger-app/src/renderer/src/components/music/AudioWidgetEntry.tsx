import React from 'react'
import './styles.css'
interface AudioWidgetEntryProps {
  title: string
  subtitle: string
  image: string
}
const AudioWidgetEntry: React.FC<AudioWidgetEntryProps> = ({ image, subtitle, title }) => {
  return (
    <div className="entry-body flex">
      <img src={image} alt={title} className="entry-image" />
      <div className="entry-right-body flex">
        <p className="entry-title">{title}</p>
        <p className="entry-subtitle">{subtitle}</p>
      </div>
    </div>
  )
}

export default AudioWidgetEntry
