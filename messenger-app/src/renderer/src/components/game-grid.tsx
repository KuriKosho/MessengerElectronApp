import { Game } from '@renderer/pages/game/game-page'
import { Card, CardContent } from './ui/card'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

interface GameGridProps {
  games: Game[]
  onGameSelect: (game: Game) => void
}
export const GameGrid: React.FC<GameGridProps> = ({
  games,
  onGameSelect
}: {
  games: Game[]
  onGameSelect: (game: Game) => void
}) => (
  <ScrollArea className="w-full whitespace-nowrap rounded-md">
    <div className="flex w-max space-x-4 p-4">
      {games.map((game) => (
        <Card
          key={game.id}
          className="w-[200px] transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer bg-slate-300"
          onClick={() => onGameSelect(game)}
        >
          <CardContent className="p-0">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-[100px] object-cover rounded-t-lg"
            />
            <div className="p-2">
              <h3 className="font-medium text-sm">{game.title}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
)
