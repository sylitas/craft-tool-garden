import { useState, useEffect } from 'react';
import { ToolGrid } from '@/components/ToolGrid';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { toolsData } from '@/data/toolsData';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTools, setFilteredTools] = useState(toolsData);

  useEffect(() => {
    let filtered = toolsData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory]);

  const categories = [
    'all',
    ...new Set(toolsData.map((tool) => tool.category)),
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2'>
              🛠️ Craft Tool Garden
            </h1>
            <p className='text-gray-600 text-lg'>
              Discover and explore our collection of handcrafted tools
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {/* Stats */}
        <div className='text-center mb-8'>
          <p className='text-gray-600'>
            Showing{' '}
            <span className='font-semibold text-green-700'>
              {filteredTools.length}
            </span>{' '}
            of <span className='font-semibold'>{toolsData.length}</span> tools
          </p>
        </div>

        {/* Tools Grid */}
        <ToolGrid tools={filteredTools} />

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className='text-center py-16'>
            <div className='text-6xl mb-4'>🔍</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No tools found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='bg-green-800 text-white py-12 mt-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h3 className='text-2xl font-bold mb-4'>
            Growing Our Tool Collection
          </h3>
          <p className='text-green-100 mb-6'>
            Each tool in our garden is carefully crafted and maintained. New
            tools are added regularly by simply creating new folders in our
            project structure.
          </p>
          <div className='flex justify-center items-center gap-2 text-green-200'>
            <span>Built with</span>
            <span className='text-red-400'>❤️</span>
            <span>using React & Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
