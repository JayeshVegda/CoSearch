import React, { useState } from 'react';
import { 
  Modal, 
  Stepper, 
  Button, 
  Text, 
  Title, 
  Stack, 
  Group, 
  Paper,
  List,
  ThemeIcon,
  Alert,
  Box
} from '@mantine/core';
import { IconCheck, IconArrowRight, IconArrowLeft, IconX } from '@tabler/icons-react';

const OnboardingSlider = ({ opened, onClose }) => {
  const [active, setActive] = useState(0);

  const steps = [
    {
      title: 'Getting Started',
      description: 'Let\'s set up your browser for the best experience',
      content: (
        <Stack gap="md">
          <Title order={3} ta="center" c="blue.6">
            🚀 Let's Get You Started
          </Title>
          <Text size="lg" ta="center" c="dimmed">
            CoSearch is your personalized search aggregator that lets you search across multiple sites simultaneously.
          </Text>
          <Paper p="md" withBorder>
            <Text size="sm" fw={500} mb="xs">
              What you'll be able to do:
            </Text>
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="green" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              <List.Item>Search across multiple websites at once</List.Item>
              <List.Item>Organize your favorite search sites by categories</List.Item>
              <List.Item>Customize your search experience</List.Item>
              <List.Item>Save time with efficient multi-site searching</List.Item>
            </List>
          </Paper>
        </Stack>
      )
    },
    {
      title: 'Browser Settings Setup',
      description: 'Configure your browser for optimal performance',
      content: (
        <Stack gap="lg">
          <Alert variant="light" color="blue" title="Important Setup Required">
            To ensure CoSearch works properly, you need to configure your browser settings. 
            This will allow the app to open search results in new tabs/windows.
          </Alert>
          
          <Paper p="md" withBorder>
            <Title order={4} mb="md">Google Chrome Setup</Title>
            <List spacing="xs" size="sm">
              <List.Item>Open the Chrome menu at the top right</List.Item>
              <List.Item>Select <strong>Settings</strong></List.Item>
              <List.Item>Select <strong>Privacy and Security</strong> in the left side menu</List.Item>
              <List.Item>Select <strong>Site Settings</strong></List.Item>
              <List.Item>Select <strong>Pop-ups and redirects</strong></List.Item>
              <List.Item>Select <strong>Add</strong> next to "Allowed to send pop-ups and use redirects"</List.Item>
              <List.Item>Input <strong>http://localhost:5173</strong> and select <strong>Add</strong></List.Item>
            </List>
          </Paper>

          <Paper p="md" withBorder>
            <Title order={4} mb="md">Firefox Setup</Title>
            <List spacing="xs" size="sm">
              <List.Item>Click the menu button and select <strong>Settings</strong></List.Item>
              <List.Item>Select <strong>Privacy & Security</strong></List.Item>
              <List.Item>Scroll down to <strong>Permissions</strong></List.Item>
              <List.Item>Click <strong>Settings</strong> next to "Block pop-up windows"</List.Item>
              <List.Item>Add <strong>http://localhost:5173</strong> to the allowed sites</List.Item>
            </List>
          </Paper>

          <Paper p="md" withBorder>
            <Title order={4} mb="md">Edge Setup</Title>
            <List spacing="xs" size="sm">
              <List.Item>Click the menu button and select <strong>Settings</strong></List.Item>
              <List.Item>Select <strong>Cookies and site permissions</strong></List.Item>
              <List.Item>Select <strong>Pop-ups and redirects</strong></List.Item>
              <List.Item>Click <strong>Add</strong> and enter <strong>http://localhost:5173</strong></List.Item>
            </List>
          </Paper>
        </Stack>
      )
    },
    {
      title: 'Test Your Setup',
      description: 'Verify that everything is working correctly',
      content: (
        <Stack gap="lg">
          <Title order={3} ta="center" c="green.6">
            ✅ Setup Complete!
          </Title>
          
          <Paper p="md" withBorder>
            <Text size="lg" mb="md">
              To test if your setup is working:
            </Text>
            <List spacing="xs" size="sm">
              <List.Item>Try searching for something in any category</List.Item>
              <List.Item>Click on a search result</List.Item>
              <List.Item>It should open in a new tab/window</List.Item>
              <List.Item>If it doesn't work, go back and check your browser settings</List.Item>
            </List>
          </Paper>

          <Alert variant="light" color="green" title="You're All Set!">
            Your browser is now configured for the best CoSearch experience. 
            You can start searching across multiple sites simultaneously!
          </Alert>


        </Stack>
      )
    }
  ];

  const nextStep = () => {
    if (active === steps.length - 1) {
      // Let the parent component handle completion
      onClose();
    } else {
      setActive((current) => current + 1);
    }
  };

  const prevStep = () => {
    setActive((current) => current - 1);
  };

  const handleClose = () => {
    // Let the parent component handle completion
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="lg"
      title="Setup Guide"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={active === 0}
    >
      <Stack gap="xl">
        <Stepper active={active} breakpoint="sm">
          {steps.map((step, index) => (
            <Stepper.Step 
              key={index}
              label={step.title}
              description={step.description}
            >
              <Box mt="xl">
                {step.content}
              </Box>
            </Stepper.Step>
          ))}
        </Stepper>
        
        <Group justify="space-between">
          <Button
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
            leftSection={<IconArrowLeft size={16} />}
          >
            Back
          </Button>

          <Group>
            {active === 0 && (
              <Button
                variant="subtle"
                onClick={handleClose}
                leftSection={<IconX size={16} />}
              >
                Skip
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              rightSection={active === steps.length - 1 ? <IconCheck size={16} /> : <IconArrowRight size={16} />}
            >
              {active === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export default OnboardingSlider; 