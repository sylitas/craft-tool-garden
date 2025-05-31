
import { ToolCard } from './ToolCard';
import { Tool } from '@/types/Tool';

interface ToolGridProps {
  tools: Tool[];
}

export const ToolGrid = ({ tools }: ToolGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
