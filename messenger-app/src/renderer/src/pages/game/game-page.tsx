import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameGrid } from '@renderer/components/game-grid'
import Layout from '@renderer/components/layout'
import SearchFilter from '@renderer/components/search-game-filter'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { featuredGames, recentGames, singlePlayerGames, twoPlayerGames } from './data'

export interface Game {
  id: string
  title: string
  imageUrl: string
  link: string
  embedUrl: string
}

const GamePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const navi = useNavigate()
  const filteredGames = (games: Game[]) => {
    return games.filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const handleGameSelect = (game: Game) => {
    setCurrentGame(game)
    setIsOpen(false)
  }
  return (
    <div className="flex flex-row h-full w-full relative ">
      <Layout />
      <div className="container mx-auto p-4 space-y-8 relative w-full">
        <SearchFilter onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
        {isOpen === true && (
          <ScrollArea className="h-full">
            {(filter === 'all' || filter === 'recent') && (
              <Card>
                <CardHeader>
                  <CardTitle>Trò chơi gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <GameGrid games={filteredGames(recentGames)} onGameSelect={handleGameSelect} />
                </CardContent>
              </Card>
            )}

            {(filter === 'all' || filter === 'twoPlayer') && (
              <Card>
                <CardHeader>
                  <CardTitle>Game 2 người chơi</CardTitle>
                </CardHeader>
                <CardContent>
                  <GameGrid games={filteredGames(twoPlayerGames)} onGameSelect={handleGameSelect} />
                </CardContent>
              </Card>
            )}

            {(filter === 'all' || filter === 'singlePlayer') && (
              <Card>
                <CardHeader>
                  <CardTitle>Game 1 người chơi</CardTitle>
                </CardHeader>
                <CardContent>
                  <GameGrid
                    games={filteredGames(singlePlayerGames)}
                    onGameSelect={handleGameSelect}
                  />
                </CardContent>
              </Card>
            )}

            {(filter === 'all' || filter === 'featured') && (
              <Card>
                <CardHeader>
                  <CardTitle>Game nổi bật</CardTitle>
                </CardHeader>
                <CardContent>
                  <GameGrid games={filteredGames(featuredGames)} onGameSelect={handleGameSelect} />
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        )}
        {isOpen === false && (
          <Card>
            <CardHeader className="flex flex-row items-center pt-0">
              <CardTitle>{currentGame ? currentGame.title : 'Chọn một trò chơi để chơi'}</CardTitle>
              {/* Back button */}
              <button
                className="flex flex-row items-center ml-auto bg-gray-100 p-2 rounded-md"
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </button>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                {currentGame ? (
                  <iframe
                    key={currentGame.id}
                    src={currentGame.embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    Chọn một trò chơi từ danh sách trên để bắt đầu chơi
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default GamePage
