import { 
  Box, 
  Container, 
  Title, 
  Text, 
  Stack, 
  Paper, 
  List, 
  ThemeIcon, 
  Divider, 
  Alert, 
  Code, 
  Badge,
  Accordion,
  Group,
  Button,
  useMantineTheme,
  useMantineColorScheme,
  Grid,
  Card,
  Breadcrumbs,
  Anchor
} from '@mantine/core';
import { 
  IconBook, 
  IconSearch, 
  IconSettings, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCheck, 
  IconX,
  IconInfoCircle,
  IconQuestionMark,
  IconBulb,
  IconAlertTriangle,
  IconExternalLink,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconPalette,
  IconKeyboard,
  IconMouse,
  IconArrowRight,
  IconHome,
  IconChevronRight
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

export default function Docs() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const tableOfContents = [
    { id: 'overview', title: 'Overview', icon: IconBook, description: 'What is CoSearch and its benefits' },
    { id: 'getting-started', title: 'Getting Started', icon: IconArrowRight, description: 'Quick setup guide' },
    { id: 'features', title: 'Features', icon: IconBulb, description: 'Core functionality overview' },
    { id: 'search-usage', title: 'How to Search', icon: IconSearch, description: 'Search workflows and tips' },
    { id: 'categories', title: 'Managing Categories', icon: IconSettings, description: 'Organize your search engines' },
    { id: 'urls', title: 'Managing URLs', icon: IconPlus, description: 'Add and configure search engines' },
    { id: 'settings', title: 'Settings & Preferences', icon: IconSettings, description: 'Customize your experience' },
    { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts', icon: IconKeyboard, description: 'Efficiency tips' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: IconQuestionMark, description: 'Common issues and solutions' },
    { id: 'faq', title: 'FAQ', icon: IconInfoCircle, description: 'Frequently asked questions' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const breadcrumbItems = [
    { title: 'Home', href: '/', icon: IconHome },
    { title: 'Documentation', href: '#', icon: IconBook }
  ].map((item, index) => (
    <Anchor
      key={index}
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        if (item.href !== '#') navigate(item.href);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
        textDecoration: 'none',
        fontSize: '14px'
      }}
    >
      <item.icon size={14} />
      {item.title}
    </Anchor>
  ));

  return (
    <Box 
      style={{ 
        minHeight: '100vh',
        background: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
        paddingTop: '2rem',
        paddingBottom: '4rem'
      }}
    >
      <Container size="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<IconChevronRight size={14} />} mb="xl">
          {breadcrumbItems}
        </Breadcrumbs>

        {/* Header */}
        <Box mb="xl">
          <Group gap="lg" align="flex-start">
            <ThemeIcon 
              size={64} 
              radius="xl" 
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            >
              <IconBook size={32} />
            </ThemeIcon>
            <div style={{ flex: 1 }}>
              <Title 
                order={1} 
                size={isMobile ? 'h2' : 'h1'}
                style={{ 
                  marginBottom: '0.5rem',
                  background: isDark 
                    ? 'linear-gradient(135deg, #74b9ff 0%, #00b894 100%)'
                    : 'linear-gradient(135deg, #0984e3 0%, #00b894 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                CoSearch Documentation
              </Title>
              <Text 
                size="lg" 
                c="dimmed"
                style={{ 
                  lineHeight: 1.6,
                  maxWidth: '600px'
                }}
              >
                Complete guide to using CoSearch - your powerful multi-engine search aggregator. 
                Learn how to set up, customize, and maximize your search efficiency.
              </Text>
            </div>
          </Group>
        </Box>

        <Grid gutter="xl">
          {/* Sidebar Navigation */}
          <Grid.Col span={isMobile ? 12 : 4}>
            <Paper 
              p="lg" 
              radius="lg" 
              withBorder 
              style={{ 
                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                position: isMobile ? 'static' : 'sticky',
                top: '2rem',
                height: 'fit-content'
              }}
            >
              <Title order={3} mb="lg" style={{ fontSize: '1.25rem' }}>
                Table of Contents
              </Title>
              <Stack gap="xs">
                {tableOfContents.map((item) => (
                  <Button
                    key={item.id}
                    variant="subtle"
                    leftSection={<item.icon size={16} />}
                    onClick={() => scrollToSection(item.id)}
                    justify="flex-start"
                    style={{ 
                      height: 'auto', 
                      padding: '12px 16px',
                      textAlign: 'left',
                      border: 'none',
                      borderRadius: theme.radius.md,
                      backgroundColor: 'transparent',
                      color: isDark ? theme.colors.gray[3] : theme.colors.gray[7],
                      transition: 'all 0.2s ease'
                    }}
                    styles={{
                      label: {
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: 1.4
                      }
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                        {item.title}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        opacity: 0.7,
                        lineHeight: 1.3
                      }}>
                        {item.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Main Content */}
          <Grid.Col span={isMobile ? 12 : 8}>
            <Stack gap="xl">
              {/* Overview Section */}
              <Box id="overview">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="blue">
                      <IconBook size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Overview
                    </Title>
                  </Group>
                  
                  <Text size="lg" mb="lg" style={{ lineHeight: 1.7 }}>
                    CoSearch is a powerful multi-engine search aggregator that revolutionizes how you search the web. 
                    Instead of visiting different search engines one by one, CoSearch lets you search across all your 
                    favorite engines with a single query, saving time and providing comprehensive results.
                  </Text>
                  
                  <Card 
                    withBorder 
                    p="lg" 
                    radius="md" 
                    mb="lg"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3]
                    }}
                  >
                    <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                      Key Benefits
                    </Title>
                    <Grid gutter="md">
                      <Grid.Col span={isMobile ? 12 : 6}>
                        <List size="sm" spacing="sm">
                          <List.Item>Search multiple engines simultaneously</List.Item>
                          <List.Item>Organize search engines by categories</List.Item>
                          <List.Item>Customize your search experience</List.Item>
                        </List>
                      </Grid.Col>
                      <Grid.Col span={isMobile ? 12 : 6}>
                        <List size="sm" spacing="sm">
                          <List.Item>Save time with efficient workflows</List.Item>
                          <List.Item>Export and import configurations</List.Item>
                          <List.Item>Professional, accessible interface</List.Item>
                        </List>
                      </Grid.Col>
                    </Grid>
                  </Card>

                  <Group gap="md" wrap="wrap">
                    <Badge size="lg" variant="light" color="green" style={{ fontSize: '12px', padding: '8px 12px' }}>
                      Easy Setup
                    </Badge>
                    <Badge size="lg" variant="light" color="blue" style={{ fontSize: '12px', padding: '8px 12px' }}>
                      Customizable
                    </Badge>
                    <Badge size="lg" variant="light" color="purple" style={{ fontSize: '12px', padding: '8px 12px' }}>
                      Multi-Engine
                    </Badge>
                    <Badge size="lg" variant="light" color="orange" style={{ fontSize: '12px', padding: '8px 12px' }}>
                      Time Saving
                    </Badge>
                  </Group>
                </Paper>
              </Box>

              {/* Getting Started Section */}
              <Box id="getting-started">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="green">
                      <IconArrowRight size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Getting Started
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <ThemeIcon size={48} radius="md" variant="light" color="blue" mb="md">
                          <IconBook size={24} />
                        </ThemeIcon>
                        <Title order={4} mb="sm" style={{ fontSize: '1.1rem' }}>
                          1. First Visit
                        </Title>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          When you first visit CoSearch, the system automatically creates your account, 
                          sets up default categories, and configures popular search engines.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <ThemeIcon size={48} radius="md" variant="light" color="green" mb="md">
                          <IconArrowRight size={24} />
                        </ThemeIcon>
                        <Title order={4} mb="sm" style={{ fontSize: '1.1rem' }}>
                          2. Onboarding
                        </Title>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Complete the interactive onboarding to learn about searching, managing categories, 
                          and customizing your experience.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <ThemeIcon size={48} radius="md" variant="light" color="orange" mb="md">
                          <IconSearch size={24} />
                        </ThemeIcon>
                        <Title order={4} mb="sm" style={{ fontSize: '1.1rem' }}>
                          3. Start Searching
                        </Title>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Once setup is complete, you can immediately start searching across multiple engines 
                          with just a few clicks.
                        </Text>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  <Alert 
                    icon={<IconInfoCircle size={16} />} 
                    title="Pro Tip" 
                    color="blue" 
                    variant="light" 
                    mt="lg"
                    style={{ borderRadius: theme.radius.md }}
                  >
                    You can always access the onboarding guide again from the settings menu if you need a refresher.
                  </Alert>
                </Paper>
              </Box>

              {/* Features Section */}
              <Box id="features">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="purple">
                      <IconBulb size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Features
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="blue">
                            <IconSearch size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Multi-Engine Search
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Search across multiple search engines simultaneously. Each category contains different 
                          search engines that open in new tabs when you perform a search.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="green">
                            <IconSettings size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Category Management
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Organize your search engines into categories like "General Search", "Shopping", "News", etc. 
                          Create, edit, and delete categories to match your workflow.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="orange">
                            <IconPlus size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            URL Management
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Add, edit, and remove search engine URLs within each category. Enable or disable specific 
                          search engines as needed.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="purple">
                            <IconPalette size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Customization
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Customize your experience with dark/light theme, export/import settings, and reset to 
                          default options.
                        </Text>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Box>

              {/* Search Usage Section */}
              <Box id="search-usage">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="blue">
                      <IconSearch size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      How to Search
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          Basic Search
                        </Title>
                        <List size="sm" spacing="sm" mb="md">
                          <List.Item>Select a category from the dropdown menu</List.Item>
                          <List.Item>Enter your search query in the search box</List.Item>
                          <List.Item>Press Enter or click the Search button</List.Item>
                          <List.Item>All enabled search engines will open in new tabs</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          Search Tips
                        </Title>
                        <List size="sm" spacing="sm">
                          <List.Item>Use specific categories for better results</List.Item>
                          <List.Item>Longer, more specific queries often yield better results</List.Item>
                          <List.Item>You can search multiple times without changing categories</List.Item>
                          <List.Item>Use quotes for exact phrase searches when supported</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  <Alert 
                    icon={<IconKeyboard size={16} />} 
                    title="Keyboard Shortcuts" 
                    color="green" 
                    variant="light" 
                    mt="lg"
                    style={{ borderRadius: theme.radius.md }}
                  >
                    <Text size="sm">
                      <strong>Enter:</strong> Perform search<br/>
                      <strong>Tab:</strong> Navigate between elements<br/>
                      <strong>Escape:</strong> Clear search box
                    </Text>
                  </Alert>
                </Paper>
              </Box>

              {/* Categories Section */}
              <Box id="categories">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="green">
                      <IconSettings size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Managing Categories
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <ThemeIcon size={40} radius="md" variant="light" color="blue" mb="md">
                          <IconPlus size={20} />
                        </ThemeIcon>
                        <Title order={4} mb="sm" style={{ fontSize: '1.1rem' }}>
                          Creating Categories
                        </Title>
                        <List size="sm" spacing="xs">
                          <List.Item>Click the settings button</List.Item>
                          <List.Item>Click "Add Category"</List.Item>
                          <List.Item>Enter a category name (max 15 characters)</List.Item>
                          <List.Item>Optionally add a description</List.Item>
                          <List.Item>Click "Add Category" to save</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <ThemeIcon size={40} radius="md" variant="light" color="orange" mb="md">
                          <IconEdit size={20} />
                        </ThemeIcon>
                        <Title order={4} mb="sm" style={{ fontSize: '1.1rem' }}>
                          Editing Categories
                        </Title>
                        <List size="sm" spacing="xs">
                          <List.Item>Open settings and find the category</List.Item>
                          <List.Item>Click the edit button</List.Item>
                          <List.Item>Modify the name and/or description</List.Item>
                          <List.Item>Click "Update Category" to save</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <ThemeIcon size={40} radius="md" variant="light" color="red" mb="md">
                          <IconTrash size={20} />
                        </ThemeIcon>
                        <Title order={4} mb="sm" style={{ fontSize: '1.1rem' }}>
                          Deleting Categories
                        </Title>
                        <List size="sm" spacing="xs">
                          <List.Item>Open settings and find the category</List.Item>
                          <List.Item>Click the edit button</List.Item>
                          <List.Item>Click "Delete Category"</List.Item>
                          <List.Item>Confirm the deletion</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  <Alert 
                    icon={<IconAlertTriangle size={16} />} 
                    title="Important" 
                    color="red" 
                    variant="light" 
                    mt="lg"
                    style={{ borderRadius: theme.radius.md }}
                  >
                    Deleting a category will permanently remove all URLs within that category. This action cannot be undone.
                  </Alert>
                </Paper>
              </Box>

              {/* URLs Section */}
              <Box id="urls">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="purple">
                      <IconPlus size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Managing URLs
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          Adding URLs
                        </Title>
                        <List size="sm" spacing="sm" mb="md">
                          <List.Item>Open settings and select a category</List.Item>
                          <List.Item>Click "Add URL"</List.Item>
                          <List.Item>Enter the site name (e.g., "Google")</List.Item>
                          <List.Item>Enter the search URL with <Code>{'{q}'}</Code> placeholder</List.Item>
                          <List.Item>Optionally upload an icon for the site</List.Item>
                          <List.Item>Click "Add URL" to save</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          URL Format
                        </Title>
                        <Text size="sm" mb="md" c="dimmed">
                          Search URLs should use the <Code>{'{q}'}</Code> placeholder for the search query:
                        </Text>
                        <List size="sm" spacing="xs">
                          <List.Item><Code>https://www.google.com/search?q={'{q}'}</Code></List.Item>
                          <List.Item><Code>https://www.bing.com/search?q={'{q}'}</Code></List.Item>
                          <List.Item><Code>https://www.amazon.com/s?k={'{q}'}</Code></List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Box>

              {/* Settings Section */}
              <Box id="settings">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="orange">
                      <IconSettings size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Settings & Preferences
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="blue">
                            <IconPalette size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Theme Settings
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Toggle between light and dark themes. Your preference is automatically saved and 
                          applies to all pages and components.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="green">
                            <IconDownload size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Data Export
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Backup your search configuration by clicking "Export Data" in user preferences. 
                          Copy the JSON data or save to file for safekeeping.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="purple">
                            <IconUpload size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Data Import
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Restore or share configurations by clicking "Import Data" in user preferences. 
                          Paste JSON data or upload a file to update all categories and URLs.
                        </Text>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 6}>
                      <Card withBorder p="lg" radius="md" style={{ height: '100%' }}>
                        <Group gap="sm" mb="md">
                          <ThemeIcon size={32} radius="md" variant="light" color="red">
                            <IconRefresh size={16} />
                          </ThemeIcon>
                          <Title order={4} style={{ fontSize: '1.1rem' }}>
                            Reset to Default
                          </Title>
                        </Group>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                          Restore default configuration by clicking "Reset to Default Data" in user preferences. 
                          All custom categories and URLs will be replaced with defaults.
                        </Text>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  <Alert 
                    icon={<IconAlertTriangle size={16} />} 
                    title="Warning" 
                    color="orange" 
                    variant="light" 
                    mt="lg"
                    style={{ borderRadius: theme.radius.md }}
                  >
                    Resetting to default will permanently delete all your custom categories and URLs. 
                    Make sure to export your data first if you want to keep it.
                  </Alert>
                </Paper>
              </Box>

              {/* Keyboard Shortcuts Section */}
              <Box id="keyboard-shortcuts">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="cyan">
                      <IconKeyboard size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Keyboard Shortcuts
                    </Title>
                  </Group>
                  
                  <Grid gutter="lg">
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          Search Shortcuts
                        </Title>
                        <List size="sm" spacing="sm">
                          <List.Item><strong>Enter:</strong> Perform search</List.Item>
                          <List.Item><strong>Escape:</strong> Clear search box</List.Item>
                          <List.Item><strong>Tab:</strong> Navigate between search elements</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          Navigation Shortcuts
                        </Title>
                        <List size="sm" spacing="sm">
                          <List.Item><strong>Tab:</strong> Move forward through elements</List.Item>
                          <List.Item><strong>Shift + Tab:</strong> Move backward through elements</List.Item>
                          <List.Item><strong>Space/Enter:</strong> Activate buttons and links</List.Item>
                          <List.Item><strong>Arrow Keys:</strong> Navigate dropdown menus</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                    
                    <Grid.Col span={isMobile ? 12 : 4}>
                      <Card withBorder p="lg" radius="md">
                        <Title order={4} mb="md" style={{ fontSize: '1.1rem' }}>
                          Settings Shortcuts
                        </Title>
                        <List size="sm" spacing="sm">
                          <List.Item><strong>Tab:</strong> Navigate through form fields</List.Item>
                          <List.Item><strong>Enter:</strong> Submit forms</List.Item>
                          <List.Item><strong>Escape:</strong> Close modals and dialogs</List.Item>
                        </List>
                      </Card>
                    </Grid.Col>
                  </Grid>

                  <Alert 
                    icon={<IconInfoCircle size={16} />} 
                    title="Accessibility" 
                    color="blue" 
                    variant="light" 
                    mt="lg"
                    style={{ borderRadius: theme.radius.md }}
                  >
                    All interactive elements support keyboard navigation and have proper focus indicators for accessibility.
                  </Alert>
                </Paper>
              </Box>

              {/* Troubleshooting Section */}
              <Box id="troubleshooting">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="red">
                      <IconQuestionMark size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Troubleshooting
                    </Title>
                  </Group>
                  
                  <Accordion variant="contained" radius="md">
                    <Accordion.Item value="no-results">
                      <Accordion.Control>No search results appear</Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="sm">
                          <Text size="sm">If no search results appear:</Text>
                          <List size="sm">
                            <List.Item>Check that you have selected a category</List.Item>
                            <List.Item>Verify that URLs are enabled in the selected category</List.Item>
                            <List.Item>Check your internet connection</List.Item>
                            <List.Item>Try refreshing the page</List.Item>
                          </List>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="urls-not-working">
                      <Accordion.Control>Search URLs are not working</Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="sm">
                          <Text size="sm">If search URLs are not working:</Text>
                          <List size="sm">
                            <List.Item>Verify the URL format includes <Code>{'{q}'}</Code> placeholder</List.Item>
                            <List.Item>Check that the search engine URL is correct</List.Item>
                            <List.Item>Ensure the URL starts with http:// or https://</List.Item>
                            <List.Item>Test the URL manually in your browser</List.Item>
                          </List>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="settings-not-saving">
                      <Accordion.Control>Settings are not saving</Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="sm">
                          <Text size="sm">If settings are not saving:</Text>
                          <List size="sm">
                            <List.Item>Check your internet connection</List.Item>
                            <List.Item>Try refreshing the page</List.Item>
                            <List.Item>Clear your browser cache and cookies</List.Item>
                            <List.Item>Check browser console for error messages</List.Item>
                          </List>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="import-export-issues">
                      <Accordion.Control>Import/Export not working</Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="sm">
                          <Text size="sm">If import/export is not working:</Text>
                          <List size="sm">
                            <List.Item>Verify the JSON format is correct</List.Item>
                            <List.Item>Check that the file is not corrupted</List.Item>
                            <List.Item>Ensure you have proper permissions</List.Item>
                            <List.Item>Try copying and pasting the data instead of file upload</List.Item>
                          </List>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="performance-issues">
                      <Accordion.Control>Performance issues</Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="sm">
                          <Text size="sm">If you experience performance issues:</Text>
                          <List size="sm">
                            <List.Item>Close unnecessary browser tabs</List.Item>
                            <List.Item>Disable browser extensions that might interfere</List.Item>
                            <List.Item>Try using a different browser</List.Item>
                            <List.Item>Check your device's available memory</List.Item>
                          </List>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Paper>
              </Box>

              {/* FAQ Section */}
              <Box id="faq">
                <Paper p="xl" radius="lg" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[7] : theme.white }}>
                  <Group gap="md" mb="lg">
                    <ThemeIcon size={40} radius="md" variant="light" color="indigo">
                      <IconInfoCircle size={20} />
                    </ThemeIcon>
                    <Title order={2} style={{ fontSize: '1.75rem' }}>
                      Frequently Asked Questions
                    </Title>
                  </Group>
                  
                  <Accordion variant="contained" radius="md">
                    <Accordion.Item value="what-is-cosearch">
                      <Accordion.Control>What is CoSearch?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          CoSearch is a multi-engine search aggregator that allows you to search across multiple search engines simultaneously. 
                          Instead of visiting different search engines one by one, you can search across all your favorite engines with a single query.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="how-many-engines">
                      <Accordion.Control>How many search engines can I add?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          There's no limit to the number of search engines you can add. You can create as many categories as you want 
                          and add as many URLs as needed within each category. However, keep in mind that opening too many tabs 
                          simultaneously might affect your browser's performance.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="data-storage">
                      <Accordion.Control>Where is my data stored?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          Your search configuration (categories and URLs) is stored in our secure database. Your data is associated 
                          with a unique user ID that's automatically generated when you first visit the site. We don't store any 
                          personal information or search queries.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="browser-support">
                      <Accordion.Control>Which browsers are supported?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          CoSearch works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. 
                          The application is responsive and works on both desktop and mobile devices.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="custom-search-engines">
                      <Accordion.Control>Can I add custom search engines?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          Yes! You can add any search engine that supports URL-based searches. Simply add the search URL 
                          with the <Code>{'{q}'}</Code> placeholder for the search query. This works for most major search engines 
                          and many specialized search sites.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="data-backup">
                      <Accordion.Control>How can I backup my data?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          You can export your search configuration at any time using the "Export Data" feature in the settings. 
                          This creates a JSON file that you can save locally or share with others. You can also import this data 
                          back into CoSearch or into another instance of the application.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="privacy">
                      <Accordion.Control>Is my privacy protected?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          Yes, we take privacy seriously. We only store your search configuration (categories and URLs). 
                          We don't store your search queries, browsing history, or any personal information. 
                          All searches are performed directly between your browser and the search engines.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="mobile-support">
                      <Accordion.Control>Does it work on mobile devices?</Accordion.Control>
                      <Accordion.Panel>
                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                          Yes! CoSearch is fully responsive and works on mobile devices. The interface automatically adapts 
                          to smaller screens, and all features are accessible on mobile browsers. However, opening many tabs 
                          simultaneously might be limited by your mobile browser's settings.
                        </Text>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Paper>
              </Box>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Footer */}
        <Paper 
          p="xl" 
          radius="lg" 
          withBorder 
          mt="xl"
          style={{ 
            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
            textAlign: 'center'
          }}
        >
          <Stack gap="md" align="center">
            <Title order={3} style={{ fontSize: '1.5rem' }}>
              Need More Help?
            </Title>
            <Text c="dimmed" style={{ maxWidth: '600px', lineHeight: 1.6 }}>
              If you couldn't find the answer you're looking for, try checking the troubleshooting section above 
              or contact support for additional assistance.
            </Text>
            <Group gap="md">
              <Button 
                variant="light" 
                leftSection={<IconHome size={16} />}
                onClick={() => navigate('/')}
              >
                Back to App
              </Button>
              <Button 
                variant="light" 
                leftSection={<IconArrowRight size={16} />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
} 