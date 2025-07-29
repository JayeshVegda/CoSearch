import { Stack, ScrollArea, NavLink, Button, useMantineTheme, useMantineColorScheme, rem } from '@mantine/core';
import { IconSettings, IconFolder, IconUser, IconPlus, IconHelp, IconTrash, IconInfoCircle } from '@tabler/icons-react';

export default function SidebarNav({ categories = [], selectedCategory, onSelectCategory, onAddCategory, onShowUserPrefPanel, activeSection, categoriesOpened, onToggleCategories, onActivateCategories }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Notion-style minimal: only left border and bold text for active, no background
  const getNavLinkStyle = (active) => ({
    marginBottom: rem(4),
    borderRadius: theme.radius.md,
    fontWeight: active ? 700 : 500,
    fontSize: 15,
    borderLeft: active ? `3px solid ${theme.colors.blue[6]}` : '3px solid transparent',
    background: 'transparent',
    color: active ? (isDark ? theme.white : theme.colors.blue[7]) : (isDark ? theme.colors.gray[2] : theme.colors.dark[7]),
    transition: 'border 0.15s, color 0.15s',
    cursor: 'pointer',
    paddingLeft: rem(10),
  });
  const getChildNavLinkStyle = (active) => ({
    marginBottom: rem(2),
    marginLeft: rem(8),
    borderRadius: theme.radius.sm,
    fontWeight: active ? 700 : 500,
    borderLeft: active ? `3px solid ${theme.colors.blue[6]}` : '3px solid transparent',
    background: 'transparent',
    color: active ? (isDark ? theme.white : theme.colors.blue[7]) : (isDark ? theme.colors.gray[2] : theme.colors.dark[7]),
    transition: 'border 0.15s, color 0.15s',
    cursor: 'pointer',
    paddingLeft: rem(10),
  });
  const getButtonStyle = () => ({
    marginTop: rem(8),
    borderRadius: theme.radius.md,
    fontWeight: 600,
    fontSize: 15,
    borderLeft: '3px solid transparent',
    background: 'transparent',
    color: isDark ? theme.colors.gray[2] : theme.colors.dark[7],
    transition: 'border 0.15s, color 0.15s',
    cursor: 'pointer',
    paddingLeft: rem(10),
    boxShadow: 'none',
  });

  return (
    <Stack gap="md" h="100%" p="md" bg={isDark ? theme.colors.dark[8] : theme.colors.gray[0]} style={{ overflow: 'hidden', width: '100%' }}> 
      <ScrollArea flex={1} mih={0} type="auto" scrollbarSize={6} scrollbars="y">
        <NavLink
          label="Categories"
          leftSection={<IconFolder size={18} />}
          childrenOffset={16}
          opened={activeSection === 'category' && categoriesOpened}
          onClick={onActivateCategories}
          variant="light"
          color={theme.primaryColor}
          radius="md"
          active={activeSection === 'category' && categoriesOpened}
          style={{
            ...getNavLinkStyle(activeSection === 'category' && categoriesOpened),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
          styles={{
            label: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }
          }}
        >
          {categories.length > 0 && activeSection === 'category' && categoriesOpened ? (
            categories.map((cat, idx) => {
              const active = cat?.categoryName === selectedCategory?.categoryName && activeSection === 'category';
              return (
                <NavLink
                  key={cat.categoryName || idx}
                  leftSection={<IconFolder size={16} />}
                  label={cat.categoryName}
                  active={active}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  onSelect={() => onSelectCategory && onSelectCategory(cat)}
                  variant="subtle"
                  color={theme.primaryColor}
                  radius="sm"
                  style={{
                    ...getChildNavLinkStyle(active),
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                  styles={{
                    label: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%'
                    }
                  }}
                />
              );
            })
          ) : null}
          {activeSection === 'category' && categoriesOpened && (
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              variant="subtle"
              color={theme.primaryColor}
              radius="md"
              mt="sm"
              onClick={onAddCategory}
              style={getButtonStyle()}
            >
              Add Category
            </Button>
          )}
        </NavLink>
        <NavLink
          label="User Preferences"
          leftSection={<IconUser size={18} />}
          variant="subtle"
          color={theme.primaryColor}
          radius="md"
          onClick={onShowUserPrefPanel}
          active={activeSection === 'user'}
          style={{
            ...getNavLinkStyle(activeSection === 'user'),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
          styles={{
            label: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }
          }}
        />
      </ScrollArea>
    </Stack>
  );
} 