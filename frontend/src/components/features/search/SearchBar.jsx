/**
 * Search Bar Component
 * Handles user search queries with category selection and search execution
 */
import { Group, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { SearchInput } from '../../core/ui/Input';
import { SearchButton } from '../../core/ui/Button';
import CategorySelector from '../categories/CategorySelector';

/**
 * Main search bar component that combines query input, category selection, and search execution
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onQueryChange - Query change handler
 * @param {Object} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Category change handler
 * @param {Function} props.onSearch - Search execution handler
 * @param {Array} props.categories - Available categories
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {Object} props.style - Additional styles
 */
export default function SearchBar({
  searchQuery,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onSearch,
  categories = [],
  isLoading = false,
  isError = false,
  style = {}
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSearch = () => {
    if (searchQuery?.trim() && selectedCategory) {
      onSearch();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Group 
      gap={isMobile ? "sm" : "md"} 
      style={{ 
        width: '100%', 
        maxWidth: '800px', 
        margin: '0 auto',
        ...style 
      }}
    >
      {/* Category Selector */}
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        isLoading={isLoading}
        isError={isError}
        style={{ 
          minWidth: isMobile ? '120px' : '180px',
          flexShrink: 0 
        }}
      />

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={onQueryChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter your search query..."
        style={{ flex: 1 }}
      />

      {/* Search Button */}
      <SearchButton
        onClick={handleSearch}
        loading={isLoading}
        disabled={!searchQuery?.trim() || !selectedCategory}
        style={{
          minWidth: isMobile ? '100px' : '120px',
          flexShrink: 0
        }}
      />
    </Group>
  );
}

/**
 * Compact search bar for smaller screens or embedded use
 * @param {Object} props - Component props (same as SearchBar)
 */
export function CompactSearchBar(props) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <SearchBar
      {...props}
      style={{
        maxWidth: isMobile ? '100%' : '600px',
        ...props.style
      }}
    />
  );
}

/**
 * Full-width search bar for header or prominent placement
 * @param {Object} props - Component props (same as SearchBar)
 */
export function FullWidthSearchBar(props) {
  return (
    <SearchBar
      {...props}
      style={{
        width: '100%',
        maxWidth: 'none',
        ...props.style
      }}
    />
  );
} 