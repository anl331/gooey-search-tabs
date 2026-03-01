import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { GoeySearchProps } from '../types'
import { animationPresets } from '../presets'
import { SearchIcon } from './SearchIcon'
import { CloseIcon } from './CloseIcon'

export const GoeySearch = ({
  tabs = [],
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onTabChange,
  onSearch,
  onChange,
  placeholder = 'Search',
  value: controlledValue,
  defaultValue = '',
  defaultExpanded = false,
  onExpandedChange,
  spring: springProp,
  bounce: bounceProp,
  preset,
  className,
  style,
  classNames = {},
}: GoeySearchProps) => {
  // Resolve animation config from preset or direct props
  const resolved = preset ? animationPresets[preset] : undefined
  const useSpring = springProp ?? resolved?.spring ?? true
  const bounce = bounceProp ?? resolved?.bounce ?? 0.1

  // State
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab ?? tabs[0]?.value ?? ''
  )
  const inputRef = useRef<HTMLInputElement>(null)

  // Controlled vs uncontrolled
  const searchValue = controlledValue ?? internalValue
  const currentActiveTab = controlledActiveTab ?? internalActiveTab

  // Transition config
  const transition = useSpring
    ? { type: 'spring' as const, bounce, duration: 0.5 }
    : { type: 'tween' as const, duration: 0.3, ease: 'easeInOut' as const }

  const handleExpand = useCallback(() => {
    setExpanded(true)
    onExpandedChange?.(true)
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [onExpandedChange])

  const handleCollapse = useCallback(() => {
    setExpanded(false)
    onExpandedChange?.(false)
    if (controlledValue === undefined) {
      setInternalValue('')
    }
  }, [onExpandedChange, controlledValue])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (controlledValue === undefined) {
        setInternalValue(val)
      }
      onChange?.(val)
    },
    [controlledValue, onChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(searchValue)
      }
      if (e.key === 'Escape') {
        handleCollapse()
      }
    },
    [onSearch, searchValue, handleCollapse]
  )

  const handleTabClick = useCallback(
    (value: string) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(value)
      }
      onTabChange?.(value)
    },
    [controlledActiveTab, onTabChange]
  )

  useEffect(() => {
    if (defaultExpanded) {
      inputRef.current?.focus()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={transition}
        className={`goey-search-container ${className ?? ''} ${classNames.container ?? ''}`.trim()}
        style={style}
        role="search"
        aria-label="Search"
        data-expanded={expanded}
      >
        <motion.button
          layout
          layoutId="goey-search-icon"
          transition={transition}
          className={`goey-search-trigger ${classNames.searchButton ?? ''}`.trim()}
          onClick={expanded ? undefined : handleExpand}
          aria-label={expanded ? 'Search' : 'Open search'}
          type="button"
          style={expanded ? { cursor: 'default' } : undefined}
        >
          <SearchIcon size={18} />
        </motion.button>

        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.div
              key="search-input-area"
              className="goey-search-input-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              layout
            >
              <input
                ref={inputRef}
                type="text"
                className={`goey-search-input ${classNames.input ?? ''}`.trim()}
                placeholder={placeholder}
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                aria-label="Search input"
              />
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={transition}
                className={`goey-search-close ${classNames.closeButton ?? ''}`.trim()}
                onClick={handleCollapse}
                aria-label="Close search"
                type="button"
              >
                <CloseIcon size={16} />
              </motion.button>
            </motion.div>
          ) : tabs.length > 0 ? (
            <motion.div
              key="search-tabs"
              className={`goey-search-tabs ${classNames.tabList ?? ''}`.trim()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              layout
              role="tablist"
            >
              {tabs.map((tab) => {
                const isActive = tab.value === currentActiveTab
                return (
                  <button
                    key={tab.value}
                    role="tab"
                    aria-selected={isActive}
                    className={[
                      'goey-search-tab',
                      isActive ? 'goey-search-tab--active' : '',
                      classNames.tab ?? '',
                      isActive ? (classNames.activeTab ?? '') : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleTabClick(tab.value)}
                    type="button"
                  >
                    {tab.icon && (
                      <span className="goey-search-tab-icon">{tab.icon}</span>
                    )}
                    {tab.label}
                  </button>
                )
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}
