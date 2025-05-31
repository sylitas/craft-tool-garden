
import { useState } from 'react';
import { Tool } from '@/types/Tool';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenTool = () => {
    // In a real implementation, this would navigate to the tool's page or open it
    console.log(`Opening tool: ${tool.name}`);
    // For demo purposes, we'll just show an alert
    alert(`Opening ${tool.name}! In a real app, this would navigate to /${tool.folder}/`);
  };

  return (
    <Card 
      className={`h-full transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${
        isHovered ? 'ring-2 ring-green-500 ring-opacity-50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-3xl mb-2">{tool.icon}</div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {tool.category}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-green-700 transition-colors">
          {tool.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {tool.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1">
          {tool.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Added {tool.dateAdded}
          </div>
          <Button 
            size="sm" 
            onClick={handleOpenTool}
            className="bg-green-600 hover:bg-green-700 transition-colors"
          >
            Open Tool
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
