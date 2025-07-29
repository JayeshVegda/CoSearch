import { Box, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import SidebarNav from '../navigation/SidebarNav';
import UserPreferencePanel from '../settings/UserPreferencePanel';
import { useState, useEffect } from 'react';

export default function SidebarLayout({ children, categories = [], selectedCategory, onSelectCategory, onAddCategory }) {
  const [activeSection, setActiveSection] = useState('category'); // 'category' or 'user'
  const [categoriesOpened, setCategoriesOpened] = useState(true);
  const [internalSelectedCategory, setInternalSelectedCategory] = useState(selectedCategory || null);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Ensure first category is selected by default
  useEffect(() => {
    if (!internalSelectedCategory && categories.length > 0) {
      setInternalSelectedCategory(categories[0]);
      onSelectCategory && onSelectCategory(categories[0]);
    }
  }, [categories, internalSelectedCategory, onSelectCategory]);

  // Clicking Categories toggles open/collapse if already active, else activates and expands
  const handleActivateCategories = () => {
    if (activeSection === 'category') {
      setCategoriesOpened((prev) => !prev);
    } else {
      setActiveSection('category');
      setCategoriesOpened(true);
    }
  };

  const handleCategorySelect = (cat) => {
    setActiveSection('category');
    setCategoriesOpened(true);
    setInternalSelectedCategory(cat);
    onSelectCategory && onSelectCategory(cat);
  };

  const handleUserPref = () => {
    setActiveSection('user');
    setCategoriesOpened(false);
    setInternalSelectedCategory(null); // Deselect category when user preferences is active
  };

  return (
    <Box style={{ display: 'flex', height: '100%', minHeight: 0, overflow: 'hidden', width: '100%' }}>
      {/* Left: Sidebar */}
      <Box style={{
        background: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
        minWidth: 200,
        maxWidth: 250,
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <SidebarNav
          categories={categories}
          selectedCategory={internalSelectedCategory}
          onSelectCategory={handleCategorySelect}
          onAddCategory={onAddCategory}
          onShowUserPrefPanel={handleUserPref}
          activeSection={activeSection}
          categoriesOpened={categoriesOpened}
          onActivateCategories={handleActivateCategories}
        />
      </Box>
      {/* Right: Data/content panel */}
      <Box style={{ 
        flex: 1, 
        minWidth: 0, 
        width: '70%',
        height: '100%', 
        minHeight: 0, 
        overflow: 'auto', 
        background: isDark ? theme.colors.dark[7] : theme.white,
        color: isDark ? theme.colors.gray[0] : theme.colors.gray[9], // Ensure text color matches theme
        maxWidth: 'calc(100% - 200px)', // Ensure it doesn't overflow
      }}>
        {activeSection === 'user' ? <UserPreferencePanel onClose={() => {
          setActiveSection('category');
          setCategoriesOpened(true);
          if (categories.length > 0) {
            setInternalSelectedCategory(categories[0]);
            onSelectCategory && onSelectCategory(categories[0]);
          }
        }} /> : children}
      </Box>
    </Box>
  );
} 