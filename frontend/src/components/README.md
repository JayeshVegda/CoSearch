# Components Directory

This directory contains all React components organized by functionality and complexity. The structure follows a feature-based architecture with clear separation between core UI components and feature-specific components.

## 📁 Directory Structure

```
components/
├── core/                    # Core reusable components
│   ├── ui/                 # Basic UI components (Button, Input, Modal)
│   ├── layout/             # Layout components (AppLayout, Container)
│   └── forms/              # Form-related components (FormField, FormSection)
├── features/               # Feature-specific components
│   ├── search/             # Search functionality components
│   ├── settings/           # Settings management components
│   └── categories/         # Category management components
├── common/                 # Legacy/common components (for backward compatibility)
└── index.js               # Centralized exports
```

## 🎯 Component Categories

### Core Components (`/core`)

These are the foundational, reusable components used throughout the application.

#### UI Components (`/core/ui`)
- **Button** - Enhanced button with consistent theming and variants
- **Input** - Text input with validation and theming
- **Modal** - Modal dialog with consistent styling

#### Layout Components (`/core/layout`)
- **AppLayout** - Main application layout wrapper
- **Container** - Content container with consistent width/padding
- **Section** - Content section with title and description

#### Form Components (`/core/forms`)
- **FormField** - Form field wrapper with label, description, and error handling
- **FormSection** - Grouping component for related form fields
- **FormActions** - Action buttons container for forms

### Feature Components (`/features`)

These components are specific to application features and business logic.

#### Search Components (`/features/search`)
- **SearchBar** - Complete search interface with category selection
- **SearchResults** - Search results display with loading/error states

#### Settings Components (`/features/settings`)
- **SettingsPanel** - Comprehensive settings management interface
- **CategoryManager** - Category CRUD operations
- **UrlManager** - URL management within categories

#### Category Components (`/features/categories`)
- **CategorySelector** - Dropdown for category selection
- **CategoryDisplay** - Visual category representation

## 🚀 Usage Examples

### Basic Component Usage

```jsx
import { Button, Input, Modal } from '@/components';

function MyComponent() {
  return (
    <div>
      <Input 
        label="Email"
        placeholder="Enter your email"
        required
      />
      <Button onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
```

### Feature Component Usage

```jsx
import { SearchBar, CategorySelector } from '@/components';

function SearchPage() {
  return (
    <SearchBar
      searchQuery={query}
      onQueryChange={setQuery}
      selectedCategory={category}
      onCategoryChange={setCategory}
      onSearch={handleSearch}
      categories={categories}
    />
  );
}
```

### Layout Usage

```jsx
import { AppLayout, Container, Section } from '@/components';

function App() {
  return (
    <AppLayout>
      <Container>
        <Section title="Welcome" description="Get started with your search">
          {/* Your content here */}
        </Section>
      </Container>
    </AppLayout>
  );
}
```

## 📋 Component Guidelines

### 1. Documentation
Every component should have:
- Clear description in the first two lines
- Comprehensive JSDoc comments
- Usage examples in comments

### 2. Props Interface
- Use TypeScript-style prop documentation
- Provide default values where appropriate
- Include all possible props in documentation

### 3. Theming
- Use Mantine theme variables consistently
- Support both light and dark modes
- Avoid hardcoded colors

### 4. Error Handling
- Provide loading states
- Handle error conditions gracefully
- Show appropriate user feedback

### 5. Accessibility
- Include proper ARIA labels
- Support keyboard navigation
- Provide screen reader support

## 🔧 Development Workflow

### Adding New Components

1. **Determine Category**: Is it core UI, layout, form, or feature-specific?
2. **Create File**: Use appropriate directory structure
3. **Add Documentation**: Include comprehensive JSDoc comments
4. **Export**: Add to `index.js` for easy importing
5. **Test**: Ensure it works in both light and dark themes

### Component Naming

- Use PascalCase for component names
- Use descriptive, action-oriented names
- Include variant suffixes (e.g., `CompactSearchBar`)

### File Structure

```
ComponentName.jsx
├── Documentation (first 2 lines)
├── Imports
├── Main component
├── Specialized variants
└── Exports
```

## 🎨 Theming Guidelines

### Color Usage
```jsx
// ✅ Good - Using theme colors
color: isDark ? theme.colors.gray[1] : theme.colors.gray[8]

// ❌ Bad - Hardcoded colors
color: '#333333'
```

### Consistent Styling
```jsx
// ✅ Good - Consistent spacing and radius
padding: theme.spacing.md,
borderRadius: theme.radius.lg,

// ❌ Bad - Inconsistent values
padding: '16px',
borderRadius: '8px',
```

## 📦 Import Patterns

### Direct Imports
```jsx
import { Button, Input, Modal } from '@/components';
```

### Feature-Specific Imports
```jsx
import { SearchBar, SearchResults } from '@/components';
```

### Core Component Imports
```jsx
import { AppLayout, Container } from '@/components';
```

## 🔄 Migration from Legacy

The `common/` directory contains legacy components that are being gradually replaced. When updating existing code:

1. **Identify Legacy Usage**: Look for imports from old component locations
2. **Update Imports**: Use new organized structure
3. **Test Functionality**: Ensure no breaking changes
4. **Remove Legacy**: Once fully migrated, legacy components can be removed

## 🧪 Testing

Each component should be tested for:
- ✅ Rendering in both light and dark themes
- ✅ Responsive behavior on different screen sizes
- ✅ Accessibility compliance
- ✅ Error state handling
- ✅ Loading state display

## 📚 Additional Resources

- [Mantine Documentation](https://mantine.dev/)
- [React Best Practices](https://react.dev/learn)
- [Accessibility Guidelines](https://www.w3.org/WAI/) 