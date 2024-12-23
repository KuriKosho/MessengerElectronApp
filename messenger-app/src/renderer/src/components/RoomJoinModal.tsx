import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
interface RoomJoinModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  setRoomId: (room_id: string) => void
}
export default function RoomJoinModal({ isOpen, setIsOpen, setRoomId }: RoomJoinModalProps) {
  const [roomInput, setRoomInput] = useState('')

  const handleJoinRoom = () => {
    console.log('Joining room:', roomInput)
    setRoomId(roomInput)
    setIsOpen(false)
  }

  const handleCreateRoom = () => {
    console.log('Creating new room')
    setRoomId(roomInput)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Join or Create Room</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] bg-slate-100">
        <DialogHeader>
          <DialogTitle>Join or Create Room</DialogTitle>
          <DialogDescription>
            Enter a room link or ID to join, or create a new room.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="roomInput"
              placeholder="Room link or ID"
              className="col-span-4"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button onClick={handleJoinRoom} disabled={!roomInput.trim()} className="bg-slate-200">
            Join Room
          </Button>
          <Button onClick={handleCreateRoom} variant="default" className="bg-slate-300">
            Create New Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
