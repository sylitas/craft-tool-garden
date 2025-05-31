
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
      <Input
        type="text"
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border-green-200 focus:border-green-500 focus:ring-green-500"
      />
    </div>
  );
};
