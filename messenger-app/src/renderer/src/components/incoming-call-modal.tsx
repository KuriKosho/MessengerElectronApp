import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Phone, PhoneOff, Video } from 'lucide-react'
import { useEffect, useState } from 'react'

interface IncomingCallModalProps {
  callerName: string
  onAnswer: () => void
  onDecline: () => void
}

export function IncomingCallModal({ callerName, onAnswer, onDecline }: IncomingCallModalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isRinging, setIsRinging] = useState(true)

  useEffect(() => {
    const ringInterval = setInterval(() => {
      setIsRinging((prev) => !prev)
    }, 1000)

    return () => clearInterval(ringInterval)
  }, [])

  const handleAnswer = () => {
    setIsOpen(false)
    onAnswer()
  }

  const handleDecline = () => {
    setIsOpen(false)
    onDecline()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} aria-labelledby="incoming-call-modal">
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Incoming Video Call</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className={`rounded-full bg-blue-100 p-4 ${isRinging ? 'animate-pulse' : ''}`}>
            <Video className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">Incoming Video Call</h2>
          <p className="text-lg text-center text-gray-500">{callerName}</p>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={handleDecline}
            variant="destructive"
            className="rounded-full p-4 bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            onClick={handleAnswer}
            variant="default"
            className="rounded-full p-4 bg-green-500 hover:bg-green-600"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
