import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import React from 'react'

interface SearchFilterProps {
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearchChange, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm trò chơi..."
          className="pl-10 w-full"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-slate-200">
          <SelectValue placeholder="Lọc theo thể loại" />
        </SelectTrigger>
        <SelectContent className=" bg-slate-200">
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="recent">Gần đây</SelectItem>
          <SelectItem value="twoPlayer">2 người chơi</SelectItem>
          <SelectItem value="singlePlayer">1 người chơi</SelectItem>
          <SelectItem value="featured">Nổi bật</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SearchFilter
