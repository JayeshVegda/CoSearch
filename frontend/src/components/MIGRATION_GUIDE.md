# Component Migration Guide

This guide helps developers migrate from the old component structure to the new organized structure.

## 🔄 Migration Overview

The components have been reorganized from a flat structure to a feature-based architecture:

### Old Structure (Flat)
```
components/
├── search/
├── settings/
├── category/
├── common/
├── layout/
└── ...
```

### New Structure (Organized)
```
components/
├── core/                    # Reusable components
│   ├── ui/                 # Button, Input, Modal
│   ├── layout/             # AppLayout, Container
│   └── forms/              # FormField, FormSection
├── features/               # Feature-specific components
│   ├── search/             # SearchBar, SearchResults
│   ├── settings/           # SettingsPanel
│   └── categories/         # CategorySelector
└── common/                 # Legacy components (temporary)
```

## 📋 Migration Steps

### Step 1: Update Imports

#### Old Import Pattern
```jsx
import { Bar } from './components/search/Bar';
import { CategoryBox } from './components/category/CategoryBox';
import { SettingsModal } from './components/settings/SettingsModal';
```

#### New Import Pattern
```jsx
import { SearchBar } from './components/features/search/SearchBar';
import { CategorySelector } from './components/features/categories/CategorySelector';
import { SettingsPanel } from './components/features/settings/SettingsPanel';
```

### Step 2: Component Name Updates

| Old Component | New Component | Location |
|---------------|---------------|----------|
| `Bar` | `SearchBar` | `features/search/SearchBar` |
| `CategoryBox` | `CategorySelector` | `features/categories/CategorySelector` |
| `SettingsModal` | `SettingsPanel` | `features/settings/SettingsPanel` |
| `Submit` | `SearchButton` | `core/ui/Button` |
| `QueryBox` | `SearchInput` | `core/ui/Input` |

### Step 3: Props Updates

Some components have been enhanced with better prop interfaces:

#### Old Props
```jsx
<Bar 
  data={categories}
  loading={isLoading}
  onCategoryChange={handleChange}
/>
```

#### New Props
```jsx
<SearchBar
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={handleChange}
  isLoading={isLoading}
  isError={isError}
  onSearch={handleSearch}
/>
```

## 🎯 Component Mapping

### Search Components
- `Bar.jsx` → `SearchBar.jsx`
- `QueryBox.jsx` → `SearchInput.jsx` (in core/ui/Input)
- `Submit.jsx` → `SearchButton.jsx` (in core/ui/Button)

### Category Components
- `CategoryBox.jsx` → `CategorySelector.jsx`
- `CategoryDisplay.jsx` → `CategoryDisplay.jsx` (enhanced)
- `SiteTiles.jsx` → `SiteTiles.jsx` (enhanced)

### Settings Components
- `SettingsModal.jsx` → `SettingsPanel.jsx`
- `SettingsButton.jsx` → `SettingsButton.jsx` (enhanced)
- `SettingsContent.jsx` → `SettingsContent.jsx` (enhanced)

### Layout Components
- `SidebarLayout.jsx` → `SidebarLayout.jsx` (enhanced)
- `HomeHero.jsx` → `HomeHero.jsx` (enhanced)

## 🔧 Enhanced Features

### New Component Features

1. **Consistent Theming**
   - All components now use Mantine theme variables
   - Proper light/dark mode support
   - No hardcoded colors

2. **Better Error Handling**
   - Loading states for all async operations
   - Error state display
   - Graceful fallbacks

3. **Accessibility Improvements**
   - ARIA labels and roles
   - Keyboard navigation support
   - Screen reader compatibility

4. **Responsive Design**
   - Mobile-first approach
   - Adaptive layouts
   - Touch-friendly interactions

### Component Variants

Many components now have specialized variants:

```jsx
// Compact variant for smaller screens
<CompactSearchBar {...props} />

// Full-width variant for headers
<FullWidthSearchBar {...props} />

// Large variant for prominent placement
<LargeCategorySelector {...props} />
```

## 🚀 Quick Migration Examples

### Example 1: Search Interface

#### Old Code
```jsx
import { Bar } from './components/search/Bar';
import { QueryBox } from './components/search/QueryBox';
import { Submit } from './components/search/Submit';

function SearchInterface() {
  return (
    <div>
      <Bar data={categories} onCategoryChange={setCategory} />
      <QueryBox value={query} onChange={setQuery} />
      <Submit onClick={handleSearch} />
    </div>
  );
}
```

#### New Code
```jsx
import { SearchBar } from './components/features/search/SearchBar';

function SearchInterface() {
  return (
    <SearchBar
      searchQuery={query}
      onQueryChange={setQuery}
      selectedCategory={category}
      onCategoryChange={setCategory}
      onSearch={handleSearch}
      categories={categories}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
```

### Example 2: Settings Modal

#### Old Code
```jsx
import { SettingsModal } from './components/settings/SettingsModal';

function App() {
  return (
    <SettingsModal
      opened={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      categoryList={categories}
    />
  );
}
```

#### New Code
```jsx
import { SettingsPanel } from './components/features/settings/SettingsPanel';

function App() {
  return (
    <SettingsPanel
      opened={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      categories={categories}
      onCategoriesChange={handleCategoriesChange}
    />
  );
}
```

## ⚠️ Breaking Changes

### 1. Import Paths
All import paths have changed. Update your imports to use the new structure.

### 2. Component Names
Some components have been renamed for clarity:
- `Bar` → `SearchBar`
- `CategoryBox` → `CategorySelector`
- `SettingsModal` → `SettingsPanel`

### 3. Props Interface
Enhanced components have more comprehensive prop interfaces. Check the documentation for each component.

## 🔍 Testing Migration

### 1. Visual Testing
- Check that components render correctly
- Verify light/dark mode switching
- Test responsive behavior

### 2. Functionality Testing
- Ensure all interactions work as expected
- Test error states and loading states
- Verify accessibility features

### 3. Performance Testing
- Check for any performance regressions
- Verify bundle size impact
- Test component re-rendering

## 📚 Additional Resources

- [Component Documentation](./README.md)
- [Mantine Theming Guide](https://mantine.dev/theming/)
- [React Best Practices](https://react.dev/learn)

## 🆘 Need Help?

If you encounter issues during migration:

1. **Check the component documentation** in each file
2. **Review the README** for usage examples
3. **Test incrementally** - migrate one component at a time
4. **Use the legacy components** temporarily if needed

The legacy components in the `common/` directory are still available for backward compatibility during the transition period. 