import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameGrid } from '@renderer/components/game-grid'
import Layout from '@renderer/components/layout'
import SearchFilter from '@renderer/components/search-game-filter'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { useState } from 'react'
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
  }
  return (
    <div className="flex flex-row h-full w-full ">
      <Layout />
      <div className="container mx-auto p-4 space-y-8">
        <SearchFilter onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
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

          <Card>
            <CardHeader>
              <CardTitle>{currentGame ? currentGame.title : 'Chọn một trò chơi để chơi'}</CardTitle>
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
        </ScrollArea>
      </div>
    </div>
  )
}

export default GamePage
