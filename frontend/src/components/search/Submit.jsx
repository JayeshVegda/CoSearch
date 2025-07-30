import { Button, Modal, Text, Group, Stack, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';
import { searchByCategory, filterSiteUrls } from '../../services/api/searchService';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';
import axiosInstance from '../../lib/axios';
import { useEffect, useState } from 'react';

function Submit({ searchResults, searchQuery, style = {}, onSearch, type = "button", selectedCategory }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [noUrlsModalOpen, setNoUrlsModalOpen] = useState(false);
  const [currentCategoryName, setCurrentCategoryName] = useState('');

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsChange = (event) => {
      // Force a refresh of the search data when settings change
      // This ensures the search button always has the latest settings
    };

    window.addEventListener('settingsChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('settingsChanged', handleSettingsChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    // Prevent default form submission if this is a form submit button
    if (type === "submit" && e) {
      e.preventDefault();
    }

    // If we have a search query and selected category, open the URLs directly
    if (searchQuery && searchQuery.trim() !== '' && selectedCategory) {
      // ALWAYS fetch fresh data from backend to get latest settings
      try {
        const categoryName = typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.categoryName;
        const userId = getOrCreateUserId();
        
        // Force fresh data by adding timestamp to bypass any caching
        const response = await axiosInstance.post('/user/search', {
          userId,
          categoryName,
          _timestamp: Date.now() // Force fresh data
        });
        
        const filteredResults = filterSiteUrls(response.data);
        :', filteredResults);
        
        if (filteredResults.length > 0) {
          // Replace {q} with search query in all URLs and open them
          filteredResults.forEach((result) => {
            const replacedUrl = result.url.replace(/{q}/g, encodeURIComponent(searchQuery.trim()));
            // Open each URL in a new tab
            window.open(replacedUrl, '_blank');
          });
        } else {
          setCurrentCategoryName(categoryName);
          setNoUrlsModalOpen(true);
        }
      } catch (error) {
        alert('Failed to fetch search data. Please try again.');
      }
    } else {
      if (!searchQuery || searchQuery.trim() === '') {
        alert('Please enter a search query.');
      }
      if (!selectedCategory) {
        alert('Please select a category.');
      }
    }
  };

  return (
    <>
      <Button
        type={type}
        onClick={handleSubmit}
        size="md"
        radius="lg"
        variant="gradient"
        gradient={{ from: theme.colors.blue[6], to: theme.colors.blue[7], deg: 45 }}
        leftSection={<IconSearch size={18} />}
        style={{
          ...style,
          fontWeight: 700,
          padding: isMobile ? '12px 24px' : '14px 28px',
          fontSize: isMobile ? '14px' : '16px',
          minWidth: isMobile ? '120px' : '140px',
          transition: 'all 0.3s ease',
                      boxShadow: `0 4px 12px ${theme.colors.blue[3]}40`,
            border: `1px solid ${theme.colors.blue[3]}40`,
          '&:hover': {
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: `0 8px 25px ${theme.colors.blue[4]}40, 0 0 20px ${theme.colors.blue[3]}40`,
            filter: 'brightness(1.1)',
          },
          '&:active': {
            transform: 'translateY(-1px) scale(0.98)',
            boxShadow: `0 4px 12px ${theme.colors.blue[3]}40`,
          }
        }}
        styles={{
          root: {
            fontWeight: 700,
            outline: 'none',
            '&:focus': {
              outline: `2px solid ${theme.colors.blue[6]}`,
              outlineOffset: '2px',
              boxShadow: `0 0 0 4px ${theme.colors.blue[6]}25, 0 8px 25px ${theme.colors.blue[4]}40`,
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.colors.blue[6]}`,
              outlineOffset: '2px',
              boxShadow: `0 0 0 4px ${theme.colors.blue[6]}25, 0 8px 25px ${theme.colors.blue[4]}40`,
            },
            '&:hover': {
              transform: 'translateY(-3px) scale(1.02)',
              boxShadow: `0 8px 25px ${theme.colors.blue[4]}40, 0 0 20px ${theme.colors.blue[3]}40`,
              filter: 'brightness(1.1)',
            },
            '&:active': {
              transform: 'translateY(-1px) scale(0.98)',
              boxShadow: `0 4px 12px ${theme.colors.blue[3]}40`,
            }
          }
        }}
        aria-label="Search button"
        role="button"
        tabIndex={0}
      >
        Search
      </Button>

      {/* No URLs Found Dialog */}
      <Modal
        opened={noUrlsModalOpen}
        onClose={() => setNoUrlsModalOpen(false)}
        title={
          <Group gap="xs">
            <IconAlertCircle size={20} color={theme.colors.red[6]} />
            <Text fw={600}>No URLs Found</Text>
          </Group>
        }
        centered
        size="sm"
        radius="lg"
        styles={{
          title: {
            fontSize: '18px',
            fontWeight: 600,
          },
          header: {
            borderBottom: `1px solid ${theme.colors.gray[3]}`,
            paddingBottom: '16px',
          }
        }}
      >
        <Stack gap="md">
          <Text c="dimmed" size="sm">
            No enabled URLs found in the <strong>{currentCategoryName}</strong> category.
          </Text>
          
          <Text size="sm">
            To use this category for searching:
          </Text>
          
          <Stack gap="xs" ml="md">
            <Text size="sm" c="dimmed">• Go to Settings</Text>
            <Text size="sm" c="dimmed">• Select the {currentCategoryName} category</Text>
            <Text size="sm" c="dimmed">• Enable some search sites</Text>
          </Stack>
          
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setNoUrlsModalOpen(false)}
              size="sm"
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default Submit;
