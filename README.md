# goey-search

A morphing search bar component with animated tab navigation for React. Built with Framer Motion.

## Features

- Morphing search bar animation (tabs pill &rarr; input + close button)
- Animated tab navigation with sliding active indicator
- Spring physics with configurable bounce intensity
- Four animation presets: smooth, bouncy, subtle, snappy
- Keyboard shortcuts: Enter to search, Escape to collapse
- Controlled and uncontrolled modes for value and active tab
- No-tabs variant for a simple expanding search bar
- CSS class overrides via `classNames` prop
- Full accessibility: `role="search"`, `role="tablist"`, `aria-selected`, focus-visible outlines

## Installation

```bash
npm install goey-search
```

### Peer Dependencies

goey-search requires the following peer dependencies:

```bash
npm install react react-dom framer-motion
```

| Package        | Version    |
| -------------- | ---------- |
| react          | >= 18.0.0  |
| react-dom      | >= 18.0.0  |
| framer-motion  | >= 10.0.0  |

### CSS Import (Required)

You **must** import the goey-search stylesheet for the component to render correctly:

```tsx
import 'goey-search/styles.css'
```

Add this import once in your app's entry point (e.g., `main.tsx` or `App.tsx`). Without it, the search bar will appear unstyled.

## Quick Start

```tsx
import { GoeySearch } from 'goey-search'
import 'goey-search/styles.css'

function App() {
  return (
    <GoeySearch
      tabs={[
        { label: 'All', value: 'all' },
        { label: 'Images', value: 'images' },
      ]}
      placeholder="Search..."
      onSearch={(value) => console.log(value)}
    />
  )
}
```

## API Reference

### `GoeySearchProps`

Props for the `<GoeySearch />` component.

| Prop              | Type                          | Default | Description                              |
| ----------------- | ----------------------------- | ------- | ---------------------------------------- |
| `tabs`            | `GoeySearchTab[]`             | —       | Tab items shown in collapsed state       |
| `activeTab`       | `string`                      | —       | Controlled active tab value              |
| `defaultActiveTab`| `string`                      | —       | Default active tab (uncontrolled)        |
| `onTabChange`     | `(value: string) => void`     | —       | Called when a tab is clicked             |
| `onSearch`        | `(value: string) => void`     | —       | Called when user presses Enter           |
| `onChange`        | `(value: string) => void`     | —       | Called on every keystroke                |
| `placeholder`     | `string`                      | —       | Placeholder text for the input           |
| `value`           | `string`                      | —       | Controlled input value                   |
| `defaultValue`    | `string`                      | —       | Default input value (uncontrolled)       |
| `defaultExpanded` | `boolean`                     | `false` | Start in expanded state                  |
| `onExpandedChange`| `(expanded: boolean) => void` | —       | Called when expanded state changes        |
| `spring`          | `boolean`                     | `true`  | Use spring-based animation               |
| `bounce`          | `number`                      | —       | Spring bounce factor (0–1)               |
| `preset`          | `AnimationPresetName`         | —       | Named animation preset                   |
| `className`       | `string`                      | —       | CSS class on the outer container         |
| `style`           | `CSSProperties`               | —       | Inline styles on the outer container     |
| `classNames`      | `GoeySearchClassNames`        | —       | Custom class names for sub-elements      |

### `GoeySearchTab`

| Property | Type        | Required | Description                                  |
| -------- | ----------- | -------- | -------------------------------------------- |
| `label`  | `string`    | Yes      | Display label for the tab                    |
| `icon`   | `ReactNode` | No       | Optional icon rendered before the label      |
| `value`  | `string`    | Yes      | Unique value used for identification and callbacks |

### `GoeySearchClassNames`

Override styles for any part of the search bar.

| Key            | Target                  |
| -------------- | ----------------------- |
| `container`    | Outer wrapper           |
| `searchButton` | Search icon button      |
| `tabList`      | Tabs container          |
| `tab`          | Individual tab button   |
| `activeTab`    | Currently active tab    |
| `input`        | Search text input       |
| `closeButton`  | Close/collapse button   |

### Animation Presets

Four built-in presets control spring physics:

| Preset   | Bounce | Description                          |
| -------- | ------ | ------------------------------------ |
| `smooth` | 0.1    | Gentle spring with minimal bounce    |
| `bouncy` | 0.6    | Exaggerated bouncy effect            |
| `subtle` | 0.05   | Very smooth, almost no bounce        |
| `snappy` | 0.4    | Quick response with moderate bounce  |

```tsx
<GoeySearch preset="bouncy" />
```

## Usage Examples

### With Tabs

```tsx
<GoeySearch
  tabs={[
    { label: 'Popular', value: 'popular', icon: '🔥' },
    { label: 'Favorites', value: 'favorites', icon: '❤️' },
    { label: 'Recent', value: 'recent', icon: '🕐' },
  ]}
  placeholder="Search..."
  onSearch={(value) => console.log(value)}
  onTabChange={(tab) => console.log(tab)}
/>
```

### Without Tabs

```tsx
<GoeySearch
  placeholder="Search anything..."
  onSearch={(value) => console.log(value)}
/>
```

### Controlled Mode

```tsx
const [query, setQuery] = useState('')
const [tab, setTab] = useState('all')

<GoeySearch
  tabs={tabs}
  value={query}
  onChange={setQuery}
  activeTab={tab}
  onTabChange={setTab}
  onSearch={(val) => fetchResults(val, tab)}
/>
```

### Animation Presets

```tsx
// Named preset
<GoeySearch preset="bouncy" />

// Or manual spring control
<GoeySearch spring={true} bounce={0.6} />

// Disable spring (smooth easing)
<GoeySearch spring={false} />
```

### Custom Styling

```tsx
<GoeySearch
  className="my-search"
  classNames={{
    container: 'my-container',
    searchButton: 'my-search-btn',
    tab: 'my-tab',
    input: 'my-input',
  }}
/>
```

### Start Expanded

```tsx
<GoeySearch
  defaultExpanded
  placeholder="Type to search..."
  onExpandedChange={(expanded) => console.log(expanded)}
/>
```

## Keyboard Shortcuts

| Key    | Action                                |
| ------ | ------------------------------------- |
| Enter  | Submit search (fires `onSearch`)      |
| Escape | Collapse the search bar              |

## Exports

```ts
// Component
export { GoeySearch } from 'goey-search'

// Animation presets
export { animationPresets } from 'goey-search'

// Types
export type {
  GoeySearchProps,
  GoeySearchTab,
  GoeySearchClassNames,
  AnimationPreset,
  AnimationPresetName,
} from 'goey-search'
```

## Browser Support

goey-search works in all modern browsers that support:

- CSS Grid and Flexbox
- ResizeObserver
- `framer-motion` (Chrome, Firefox, Safari, Edge)

## License

[MIT](./LICENSE)
