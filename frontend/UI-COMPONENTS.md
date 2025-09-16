# SomniaVault UI Component System

This document outlines the standardized UI component system for the SomniaVault DeFi platform. The system ensures consistency across the application and provides a library of reusable components for developers.

## Component Overview

The UI component system includes standardized versions of:

- Buttons
- Cards
- Form elements (inputs, selects, etc.)
- Badges
- Modals
- Typography styles
- Loading indicators

## Usage Guidelines

### 1. Importing Components

```tsx
import { 
  StandardButton, 
  StandardCard, 
  StandardFormField,
  StandardBadge,
  StandardSelect,
  StandardModal
} from './components/StandardUI';
```

### 2. CSS Classes

The component library provides standardized CSS classes for consistent styling:

- Buttons: `btn`, `btn-primary`, `btn-secondary`, `btn-accent`, `btn-outline`
- Cards: `card`, `card-hover`, `card-glow`, `card-glow-purple`, `card-glow-green`
- Form elements: `form-input`, `form-label`, `form-select`
- Typography: `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`, `text-body`
- Badges: `badge`, `badge-blue`, `badge-green`, `badge-red`, `badge-yellow`, `badge-purple`
- Layout: `divider`, `divider-vertical`
- Animation: `hover-lift`, `hover-glow`

### 3. Example Implementation

#### Button Example

```tsx
<StandardButton 
  variant="primary" 
  size="lg"
  onClick={handleClick}
  disabled={loading}
  isLoading={loading}
>
  Submit
</StandardButton>
```

#### Form Field Example

```tsx
<StandardFormField
  id="amount"
  label="Amount (ETH)"
  type="number"
  placeholder="0.000"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  helperText="Available balance: 2.5 ETH"
  maxButton
  onMaxClick={() => setAmount('2.5')}
  required
/>
```

#### Card Example

```tsx
<StandardCard
  title="Vault Overview"
  subtitle="Performance and statistics"
  variant="hover"
>
  <p>Card content goes here</p>
</StandardCard>
```

#### Modal Example

```tsx
<StandardModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Deposit to Vault"
>
  <p>Modal content goes here</p>
  
  <div className="flex justify-end mt-4">
    <StandardButton onClick={() => setIsModalOpen(false)}>
      Close
    </StandardButton>
  </div>
</StandardModal>
```

## Demo Page

A demo page showcasing all components is available at `/ui-components`.

## Design Principles

The UI component system adheres to the following design principles:

1. **Consistency**: All components follow the same design language and styling conventions.
2. **Reusability**: Components are designed to be easily reused across the application.
3. **Accessibility**: Components are designed with accessibility in mind.
4. **Responsiveness**: All components are responsive and work well on different screen sizes.
5. **Performance**: Components are optimized for performance and minimize re-renders.

## Animation System

The UI system includes a set of standardized animations:

- `animate-fadeIn`: Fade in animation
- `animate-slideUp`: Slide up animation
- `animate-slideDown`: Slide down animation
- `animate-spin`: Spinning animation
- `animate-pulse`: Pulsing animation
- `floating-animation`: Floating animation

## Responsive Design

The UI system includes responsive utilities for building layouts that work across different screen sizes:

- Mobile-first approach
- Responsive containers
- Media queries for different breakpoints

## Component Props

### StandardButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | "button" \| "submit" \| "reset" | "button" | Button type |
| variant | "primary" \| "secondary" \| "accent" \| "outline" | "primary" | Button style variant |
| size | "sm" \| "md" \| "lg" | "md" | Button size |
| onClick | () => void | undefined | Click handler |
| disabled | boolean | false | Disable button |
| isLoading | boolean | false | Show loading spinner |
| fullWidth | boolean | false | Make button full width |
| icon | React.ReactNode | undefined | Icon to show with text |
| className | string | "" | Additional CSS classes |

### StandardFormField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | required | Input ID |
| label | string | required | Field label |
| type | string | required | Input type |
| placeholder | string | undefined | Input placeholder |
| value | string | required | Input value |
| onChange | (e) => void | required | Change handler |
| error | string | undefined | Error message |
| helperText | string | undefined | Helper text |
| required | boolean | false | Make field required |
| disabled | boolean | false | Disable field |
| maxButton | boolean | false | Show MAX button |
| onMaxClick | () => void | undefined | MAX button handler |

For the full list of component props, check the StandardUI.tsx file.