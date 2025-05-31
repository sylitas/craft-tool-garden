import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toolsData } from '@/data/toolsData';

const ToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = toolsData.find((t) => t.id === toolId);
  const [ToolComponent, setToolComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tool) return;

    // Dynamically import the tool component
    const importToolComponent = async () => {
      setIsLoading(true);
      try {
        // Dynamic import based on toolId
        const module = await import(
          /* @vite-ignore */ `../tools/${toolId}/index`
        );
        setToolComponent(() => module.default);
      } catch (error) {
        console.error(`Tool component for "${toolId}" not found:`, error);
        setToolComponent(null);
      } finally {
        setIsLoading(false);
      }
    };

    importToolComponent();
  }, [toolId, tool]);

  // If tool doesn't exist, redirect to home
  if (!tool) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <h1 className='text-2xl font-bold mb-4'>Tool not found</h1>
        <Button onClick={() => navigate('/')}>Go back to home</Button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return <div className='flex justify-center p-12'>Loading tool...</div>;
  }

  // If we have a specific component for this tool, render it
  if (ToolComponent) {
    return <ToolComponent tool={tool} />;
  }

  // Default tool page content if no specific component is found
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Button variant='outline' onClick={() => navigate('/')} className='mb-6'>
        ← Back to Tools
      </Button>

      <div className='flex items-center gap-3 mb-8'>
        <div className='text-4xl'>{tool.icon}</div>
        <div>
          <h1 className='text-3xl font-bold'>{tool.name}</h1>
          <p className='text-gray-600'>{tool.description}</p>
        </div>
      </div>

      <div className='border p-4 rounded-md bg-gray-50'>
        <p>This is a placeholder for the {tool.name} tool content.</p>
      </div>
    </div>
  );
};

export default ToolPage;
