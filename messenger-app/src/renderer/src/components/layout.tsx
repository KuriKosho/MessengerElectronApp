import authService from '@renderer/services/authService'
import { RootState } from '@renderer/stores/store'
import { Gamepad2, LogOut, MessageCircle, Music, Radio, Settings, VideoIcon } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RoomJoinModal from './RoomJoinModal'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
const Layout = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const [isRoomOpen, setIsRoomOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChat = () => {
    navigate('/chat')
  }
  const handleLogout = async () => {
    try {
      console.log('currentUser', currentUser)
      await authService.logout(currentUser?.email || 'no email', dispatch)
      toast({
        variant: 'default',
        title: 'Logout Success',
        description: 'You are now logged out'
      })
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred during logout'
      })
    }
  }
  const handleGroupCall = () => {
    // dispatch(joinGroupCall())
    setIsRoomOpen(true)
  }
  const handleStream = () => {
    // dispatch(joinStream())
    navigate('/stream')
  }
  const handleGame = () => {
    // dispatch(joinGame())
    navigate('/game')
  }
  const handleMusic = () => {
    // dispatch(joinMusic())
    navigate('/music/library')
  }
  const handleServer = () => {
    // dispatch(joinServer())
    navigate('/server')
  }
  const handleSettings = () => {
    // dispatch(joinSettings())
    navigate('/settings')
  }
  return (
    <div className="w-15 border-r bg-muted/10 flex flex-col justify-between">
      {/* User profile */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-center">
          <Avatar className="h-10 w-10 bg-slate-300">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
            <AvatarFallback>{currentUser?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Action buttons at bottom */}
      <div className="mt-auto">
        <div className="p-4 flex flex-col gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200"
            aria-label="Chat"
            onClick={handleChat}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200"
            aria-label="Music"
            onClick={handleMusic}
          >
            <Music className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200"
            aria-label="stream"
            onClick={handleStream}
          >
            <Radio className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200"
            aria-label="Game"
            onClick={handleGame}
          >
            <Gamepad2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200"
            aria-label="Group call"
            onClick={handleGroupCall}
          >
            <VideoIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200"
            aria-label="Settings"
            onClick={handleSettings}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full hover:bg-slate-200 text-red-500 hover:text-red-600"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Group call modal */}
      {isRoomOpen && <RoomJoinModal isOpen={isRoomOpen} setIsOpen={setIsRoomOpen} />}
    </div>
  )
}

export default Layout
