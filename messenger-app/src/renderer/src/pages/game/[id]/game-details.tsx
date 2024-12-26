import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface GameDetailsParams {
  id: string
  embedUrl?: string
}

const GameDetails: React.FC = () => {
  const { id, embedUrl } = useParams<Record<string, string | undefined>>()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <Button onClick={handleBack} className="absolute top-4 left-4 z-10" variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="p-4 pt-16">
        <h1 className="text-2xl font-bold mb-4">Game Details - ID: {id}</h1>

        {embedUrl ? (
          <div className="w-full h-[calc(100vh-120px)]">
            <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen></iframe>
          </div>
        ) : (
          <p>No embed URL provided for this game.</p>
        )}
      </div>
    </div>
  )
}

export default GameDetails
