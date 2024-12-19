import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mic, MicOff, PhoneOff, Users, Video, VideoOff } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  callee: {
    name: string
    avatar: string
  }
}

export function VideoCallModal({ isOpen, onClose, callee }: VideoCallModalProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
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
      <DialogContent className="sm:max-w-[700px] p-0 bg-slate-100">
        <DialogHeader className="p-4">
          <DialogTitle>Video Call with {callee.name}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <div
            className={`aspect-video bg-muted ${isFullScreen ? 'h-[80vh]' : 'h-[50vh]'} transition-all duration-300 ease-in-out`}
          >
            {/* Friend's video (placeholder) */}
            <video
              src="/placeholder.mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
            {/* User's video (placeholder) */}
            <div className="absolute top-4 right-4 w-1/4 aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
              <video
                src="/placeholder.mp4"
                autoPlay
                loop
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Your avatar" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {formatDuration(callDuration)}
          </div>
        </div>
        <div className="p-4 flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-slate-400"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-400"
            onClick={() => setIsVideoOff(!isVideoOff)}
            aria-label={isVideoOff ? 'Turn video on' : 'Turn video off'}
          >
            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            className="bg-slate-400"
            size="icon"
            onClick={() => setIsFullScreen(!isFullScreen)}
            aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
          >
            <Users className="h-4 w-4" />
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
      </DialogContent>
    </Dialog>
  )
}
