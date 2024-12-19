import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mic, MicOff, PhoneOff } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VoiceCallModalProps {
  isOpen: boolean
  onClose: () => void
  callee: {
    name: string
    avatar: string
  }
}

export function VoiceCallModal({ isOpen, onClose, callee }: VoiceCallModalProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-100">
        <DialogHeader>
          <DialogTitle>Voice Call with {callee.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4 ">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 bg-slate-400">
              <AvatarImage src={callee.avatar} alt={callee.name} />
              <AvatarFallback>{callee.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {formatDuration(callDuration)}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-400"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={onClose}
              aria-label="End call"
              className="bg-red-500"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
