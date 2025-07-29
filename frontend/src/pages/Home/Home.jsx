import { useState, useEffect } from 'react';
import { Stack, Box, useMantineTheme, useMantineColorScheme, Loader, Alert, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBook } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import HomeHero from '../../components/logo/HomeHero';
import Bar from '../../components/search/Bar';
import ThemeToggle from '../../components/common/ThemeToggle';
import SettingsButton from '../../components/settings/SettingsButton';
import SiteTiles from '../../components/category/SiteTiles';
import OnboardingSlider from '../../components/onboarding/OnboardingSlider';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useUserInitialization } from '../../hooks/useUserInitialization';
import { debugOnboardingState } from '../../utils/onboardingUtils';
import { useCategoryList } from '../../components/category/CategoryBox.controller';
import { getOrCreateUserId } from '../../utils/getOrCreateUserId';



function Home() {
    console.log('Home component rendering...');
    
    // All hooks must be called at the top level, in the same order every time
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const navigate = useNavigate();
    
    // State hooks
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Get categories from API
    const localUserId = getOrCreateUserId();
    const { data: categories = [], isLoading: categoriesLoading } = useCategoryList(localUserId);
    
    // User initialization
    const { userId, isNewUser, isLoading: userLoading, error: userError } = useUserInitialization();
    
    // Onboarding state
    const { isLoading: onboardingLoading, completeOnboarding } = useOnboarding();
    
    // Form hook
    const form = useForm({
        initialValues: {
            category: '',
            query: ''
        }
    });
    



    
    // Load first category on mount
    useEffect(() => {
        console.log('Categories loaded:', categories, 'Selected category:', selectedCategory);
        if (categories.length > 0 && !selectedCategory) {
            console.log('Setting first category as selected:', categories[0]);
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    // Listen for onboarding completion
    useEffect(() => {
        const handleOnboardingCompleted = () => {
            console.log('Home: Onboarding completed, state will update automatically');
            // The useUserInitialization hook will handle updating isNewUser state
        };

        window.addEventListener('onboardingCompleted', handleOnboardingCompleted);
        return () => window.removeEventListener('onboardingCompleted', handleOnboardingCompleted);
    }, []);
    
    console.log('Home component state:', { 
        isDark, 
        categories: categories.length, 
        selectedCategory, 
        userId, 
        isNewUser, 
        userLoading, 
        categoriesLoading,
        onboardingLoading 
    });
    
    // Debug onboarding state
    debugOnboardingState();

    // Event handlers
    const handleCategoryChange = (value) => {
        console.log('Category changed to:', value);
        setSelectedCategory(value);
        form.setFieldValue('category', value);
        setSearchResults([]);
    };

    const handleQueryChange = (value) => {
        setSearchQuery(value);
        form.setFieldValue('query', value);
    };

    const handleSearch = (query) => {
        if (!selectedCategory) return;

        // For now, we'll use a simple search simulation
        // In the future, this could be enhanced to search through the API
        console.log('Searching for:', query, 'in category:', selectedCategory);
        setSearchResults([]);
    };

    const handleFormSubmit = (values) => {
        if (values.query && values.query.trim() !== '') {
            handleSearch(values.query);
        }
    };

    const containerStyle = {
        height: '100vh',
        backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '23rem',
        paddingTop: '0',
        position: 'relative',
        transition: 'background-color 0.3s ease'
    };

    const themeToggleStyle = {
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        zIndex: 1000,
    };

    console.log('Home component rendering JSX...');
    
    // Render loading state
    if (userLoading || categoriesLoading) {
        return (
            <Box style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: isDark ? theme.colors.dark[8] : theme.white
            }}>
                <Stack align="center" spacing="md">
                    <Loader size="lg" />
                    <div>{userLoading ? 'Initializing your experience...' : 'Loading categories...'}</div>
                </Stack>
            </Box>
        );
    }

    // Render error state
    if (userError) {
        return (
            <Box style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: isDark ? theme.colors.dark[8] : theme.white
            }}>
                <Alert title="Initialization Error" color="red" variant="filled">
                    {userError}
                </Alert>
            </Box>
        );
    }
    
    // Main render
    return (
        <Stack style={containerStyle}>
            <Box style={themeToggleStyle}>
                <ThemeToggle />
            </Box>
            <div style={{
                position: 'absolute',
                top: '50vh',
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                transform: 'translateY(-40%)',
                height: 'auto',
            }}>
                <HomeHero />
                <div style={{ marginBottom: '2rem' }}></div>
                <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <Bar 
                        onCategoryChange={handleCategoryChange}
                        searchResults={searchResults}
                        searchQuery={searchQuery}
                        onQueryChange={handleQueryChange}
                        selectedCategory={selectedCategory}
                        onSearch={handleSearch}
                    />
                </form>
                <div style={{
                    height: '160px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0.5rem 0',
                    position: 'relative',
                }}>
                    {selectedCategory && (
                        <SiteTiles 
                            selectedCategory={selectedCategory}
                            isLoading={categoriesLoading}
                        />
                    )}
                    {!selectedCategory && categories.length > 0 && (
                        <div style={{ textAlign: 'center', color: isDark ? theme.colors.gray[4] : theme.colors.gray[6] }}>
                            Select a category to view sites
                        </div>
                    )}
                </div>
            </div>
            <SettingsButton />
            

            
            {/* Onboarding Slider - Show only for new users */}
            <OnboardingSlider 
                opened={isNewUser && !onboardingLoading}
                onClose={completeOnboarding}
            />
        </Stack>
    );
}

export default Home;
