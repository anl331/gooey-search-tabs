import type { ReactNode, CSSProperties } from 'react'
import type { AnimationPresetName } from './presets'

export interface GoeySearchTab {
  /** Display label for the tab */
  label: string
  /** Optional icon rendered before the label */
  icon?: ReactNode
  /** Unique value used for identification and callbacks */
  value: string
}

export interface GoeySearchProps {
  /** Tab items shown in collapsed state */
  tabs?: GoeySearchTab[]
  /** Currently active tab value (controlled) */
  activeTab?: string
  /** Default active tab value (uncontrolled) */
  defaultActiveTab?: string
  /** Called when a tab is clicked */
  onTabChange?: (value: string) => void
  /** Called when user submits the search (presses Enter) */
  onSearch?: (value: string) => void
  /** Called on every keystroke in the search input */
  onChange?: (value: string) => void
  /** Placeholder text for the search input */
  placeholder?: string
  /** Controlled search input value */
  value?: string
  /** Default search input value (uncontrolled) */
  defaultValue?: string
  /** Whether the search bar starts expanded */
  defaultExpanded?: boolean
  /** Called when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void
  /** Use spring-based animation */
  spring?: boolean
  /** Spring bounce factor (0-1) */
  bounce?: number
  /** Named animation preset */
  preset?: AnimationPresetName
  /** Additional CSS class on the outer container */
  className?: string
  /** Additional inline styles on the outer container */
  style?: CSSProperties
  /** Custom class names for sub-elements */
  classNames?: GoeySearchClassNames
}

export interface GoeySearchClassNames {
  container?: string
  searchButton?: string
  tabList?: string
  tab?: string
  activeTab?: string
  input?: string
  closeButton?: string
}
