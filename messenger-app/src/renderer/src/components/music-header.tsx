import { Library, Play, Search, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from './ui/input'

const MusicHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="flex items-center space-x-4">
          <Link to="/library" className="flex items-center space-x-2 text-sm font-medium">
            <Library className="w-4 h-4" />
            <span>Library</span>
          </Link>
          <Link to="/player" className="flex items-center space-x-2 text-sm font-medium">
            <Play className="w-4 h-4" />
            <span>Player</span>
          </Link>
          <Link to="/trending" className="flex items-center space-x-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </Link>
        </nav>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for songs, artists, or albums"
            className="pl-8 pr-4 py-2 w-full"
          />
        </div>
      </div>
    </header>
  )
}

export default MusicHeader
