/**
 * Search Results Component
 * Displays search results and handles result interactions with proper error handling
 */
import { Box, Text, Group, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconSearch, IconAlertCircle, IconCheck } from '@tabler/icons-react';

/**
 * Main search results component that displays search outcomes and status
 * @param {Object} props - Component props
 * @param {Array} props.results - Search results array
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isError - Error state
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.searchQuery - Current search query
 * @param {Object} props.selectedCategory - Selected category
 * @param {Function} props.onResultClick - Result click handler
 * @param {Object} props.style - Additional styles
 */
export default function SearchResults({
  results = [],
  isLoading = false,
  isError = false,
  errorMessage = '',
  searchQuery = '',
  selectedCategory = null,
  onResultClick,
  style = {}
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Loading state
  if (isLoading) {
    return (
      <Box
        style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          color: isDark ? theme.colors.gray[3] : theme.colors.gray[6],
          ...style
        }}
      >
        <IconSearch size={48} style={{ marginBottom: theme.spacing.md }} />
        <Text size="lg" fw={500}>
          Searching for "{searchQuery}" in {selectedCategory?.categoryName || 'selected category'}...
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          Please wait while we process your request
        </Text>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box
        style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          color: theme.colors.red[6],
          ...style
        }}
      >
        <IconAlertCircle size={48} style={{ marginBottom: theme.spacing.md }} />
        <Text size="lg" fw={500} c="red">
          Search Failed
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          {errorMessage || 'An error occurred while searching. Please try again.'}
        </Text>
      </Box>
    );
  }

  // No results state
  if (!results || results.length === 0) {
    return (
      <Box
        style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          color: isDark ? theme.colors.gray[3] : theme.colors.gray[6],
          ...style
        }}
      >
        <IconSearch size={48} style={{ marginBottom: theme.spacing.md }} />
        <Text size="lg" fw={500}>
          No Results Found
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          Try adjusting your search terms or selecting a different category
        </Text>
      </Box>
    );
  }

  // Results display
  return (
    <Box style={{ ...style }}>
      {/* Results header */}
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Search Results
        </Text>
        <Text size="sm" c="dimmed">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </Text>
      </Group>

      {/* Results list */}
      <Box>
        {results.map((result, index) => (
          <SearchResultItem
            key={index}
            result={result}
            onClick={() => onResultClick?.(result)}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Individual search result item component
 * @param {Object} props - Component props
 * @param {Object} props.result - Result object
 * @param {Function} props.onClick - Click handler
 */
function SearchResultItem({ result, onClick }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      onClick={onClick}
      style={{
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: theme.radius.md,
        border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
          transform: 'translateY(-1px)',
          boxShadow: isDark 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Group justify="space-between" align="center">
        <Box style={{ flex: 1 }}>
          <Text fw={600} size="md" mb="xs">
            {result.name || result.title || 'Untitled'}
          </Text>
          {result.description && (
            <Text size="sm" c="dimmed" lineClamp={2}>
              {result.description}
            </Text>
          )}
          {result.url && (
            <Text size="xs" c="blue" mt="xs">
              {result.url}
            </Text>
          )}
        </Box>
        {result.isEnabled !== false && (
          <IconCheck 
            size={16} 
            color={theme.colors.green[6]} 
            style={{ flexShrink: 0 }}
          />
        )}
      </Group>
    </Box>
  );
}

/**
 * Compact search results for smaller displays
 * @param {Object} props - Component props (same as SearchResults)
 */
export function CompactSearchResults(props) {
  return (
    <SearchResults
      {...props}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        ...props.style
      }}
    />
  );
}

/**
 * Full-width search results for detailed displays
 * @param {Object} props - Component props (same as SearchResults)
 */
export function FullWidthSearchResults(props) {
  return (
    <SearchResults
      {...props}
      style={{
        width: '100%',
        ...props.style
      }}
    />
  );
} 