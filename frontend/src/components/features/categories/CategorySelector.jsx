/**
 * Category Selector Component
 * Handles category selection with dropdown interface and loading states
 */
import { Select, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

/**
 * Main category selector component with dropdown interface
 * @param {Object} props - Component props
 * @param {Array} props.categories - Available categories array
 * @param {Object} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Category change handler
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.size - Selector size (xs, sm, md, lg, xl)
 * @param {Object} props.style - Additional styles
 */
export default function CategorySelector({
  categories = [],
  selectedCategory,
  onCategoryChange,
  isLoading = false,
  isError = false,
  placeholder = "Select Category",
  size = "md",
  style = {}
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Normalize categories to ensure consistent format
  const normalizedCategories = categories.map(category => {
    if (typeof category === 'string') {
      return { categoryName: category, label: category };
    }
    if (category && typeof category === 'object') {
      return {
        categoryName: category.categoryName || category.name || category,
        label: category.label || category.categoryName || category.name || category
      };
    }
    return { categoryName: String(category), label: String(category) };
  });

  // Get selected value
  const selectedValue = selectedCategory 
    ? (typeof selectedCategory === 'string' 
        ? selectedCategory 
        : selectedCategory.categoryName || selectedCategory.name)
    : undefined;

  // Handle category change
  const handleChange = (value) => {
    if (onCategoryChange && value) {
      const category = normalizedCategories.find(cat => cat.categoryName === value);
      onCategoryChange(category || value);
    }
  };

  // Prepare select data
  const selectData = isLoading 
    ? ['Loading...'] 
    : isError 
      ? ['Error loading categories'] 
      : normalizedCategories.length > 0 
        ? normalizedCategories.map(cat => ({
            value: cat.categoryName,
            label: cat.label
          }))
        : ['No categories available'];

  return (
    <Select
      size={size}
      radius="lg"
      data={selectData}
      value={selectedValue}
      onChange={handleChange}
      placeholder={isLoading ? "Loading..." : placeholder}
      disabled={isLoading || isError || normalizedCategories.length === 0}
      rightSection={<IconChevronDown size={16} />}
      styles={{
        input: {
          border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
          fontSize: isMobile ? '14px' : '15px',
          fontWeight: 500,
          color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
          transition: 'all 0.15s ease',
          cursor: 'pointer',
          minWidth: isMobile ? '120px' : '180px',
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          borderRadius: '16px',
          '&:focus': {
            borderColor: theme.colors.blue[6],
            boxShadow: `0 0 0 2px ${theme.colors.blue[6]}20`,
            borderWidth: '2px'
          },
          '&:hover': {
            borderColor: theme.colors.blue[6],
            boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)'}`
          },
          '&::placeholder': {
            color: isDark ? theme.colors.gray[5] : theme.colors.gray[6]
          }
        },
        dropdown: {
          border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          maxHeight: '200px',
          overflowY: 'auto'
        },
        rightSection: {
          color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
          transition: 'transform 0.2s ease'
        },
        item: {
          color: isDark ? theme.colors.gray[1] : theme.colors.gray[8],
          backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          borderRadius: '8px',
          margin: '2px 4px',
          padding: '8px 12px',
          fontWeight: 500,
          transition: 'all 0.1s ease',
          '&:hover': {
            backgroundColor: isDark ? theme.colors.blue[9] : theme.colors.blue[0],
            color: isDark ? theme.colors.blue[2] : theme.colors.blue[6],
            transform: 'translateY(-1px)',
            boxShadow: `0 2px 6px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`
          },
          '&[data-selected]': {
            backgroundColor: theme.colors.blue[6],
            color: theme.white,
            fontWeight: 600,
            transform: 'translateY(-2px)',
            boxShadow: `0 3px 8px ${theme.colors.blue[6]}30`
          }
        }
      }}
      style={style}
    />
  );
}

/**
 * Compact category selector for smaller screens
 * @param {Object} props - Component props (same as CategorySelector)
 */
export function CompactCategorySelector(props) {
  return (
    <CategorySelector
      {...props}
      size="sm"
      style={{
        minWidth: '100px',
        ...props.style
      }}
    />
  );
}

/**
 * Large category selector for prominent placement
 * @param {Object} props - Component props (same as CategorySelector)
 */
export function LargeCategorySelector(props) {
  return (
    <CategorySelector
      {...props}
      size="lg"
      style={{
        minWidth: '200px',
        ...props.style
      }}
    />
  );
} 