import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { GoeySearchProps } from '../types'
import { animationPresets } from '../presets'
import { SearchIcon } from './SearchIcon'
import { CloseIcon } from './CloseIcon'

const CLOSE_SIZE = 44
const BAR_COLLAPSED = 44 // icon bar width when collapsed (padding + icon)
const DEFAULT_INPUT_WIDTH = 220
const GAP = 8

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
  const instanceId = useId()
  const resolved = preset ? animationPresets[preset] : undefined
  const useSpring = springProp ?? resolved?.spring ?? true
  const bounce = bounceProp ?? resolved?.bounce ?? 0.1

  const [expanded, setExpanded] = useState(defaultExpanded)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab ?? tabs[0]?.value ?? ''
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [lockedWidth, setLockedWidth] = useState<number | null>(null)

  const searchValue = controlledValue ?? internalValue
  const currentActiveTab = controlledActiveTab ?? internalActiveTab
  const hasTabs = tabs.length > 0

  const transition = useSpring
    ? { type: 'spring' as const, bounce, duration: 0.5 }
    : { type: 'tween' as const, duration: 0.3, ease: 'easeInOut' as const }

  // Measure and lock the wrapper width after first paint (only when tabs exist)
  useEffect(() => {
    if (hasTabs && wrapperRef.current && lockedWidth === null) {
      requestAnimationFrame(() => {
        if (wrapperRef.current) {
          setLockedWidth(wrapperRef.current.offsetWidth)
        }
      })
    }
  }, [lockedWidth, tabs, hasTabs])

  // Calculate input width to keep total width constant
  // Only applies when we have tabs (width is locked)
  const inputExpandedWidth = hasTabs && lockedWidth
    ? lockedWidth - BAR_COLLAPSED - GAP - CLOSE_SIZE
    : DEFAULT_INPUT_WIDTH

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

  const fastFade = { duration: 0.12 }
  const instantFade = { duration: 0.06 }

  return (
    <LayoutGroup id={instanceId}>
      <div
        ref={wrapperRef}
        className={`goey-search-wrapper ${className ?? ''} ${classNames.container ?? ''}`.trim()}
        style={{
          ...style,
          ...(hasTabs && lockedWidth ? { width: lockedWidth } : undefined),
        }}
        role="search"
        aria-label="Search"
        data-expanded={expanded}
      >
        {/* Left side: always a pill, content drives the width */}
        <div className="goey-search-bar">
          <button
            className={`goey-search-trigger ${classNames.searchButton ?? ''}`.trim()}
            onClick={expanded ? undefined : handleExpand}
            aria-label={expanded ? 'Search' : 'Open search'}
            type="button"
            tabIndex={expanded ? -1 : 0}
          >
            <SearchIcon size={18} />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="input-area"
                className="goey-search-input-wrapper"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: inputExpandedWidth, opacity: 1, transition }}
                exit={{
                  width: 0,
                  opacity: 0,
                  transition: { ...transition, opacity: { duration: 0.08 } },
                }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side: tabs morph into close button via shared layoutId */}
        {(hasTabs || expanded) && (
          <div className="goey-search-right-slot">
            {/* Morphing background shape — shared layoutId creates the morph */}
            {hasTabs && (
              <motion.div
                layoutId="goey-search-right-bg"
                className={expanded ? 'goey-search-close-bubble' : 'goey-search-tabs-bg'}
                transition={transition}
                style={{ borderRadius: 999 }}
              />
            )}

            {/* Content layer — fades in/out on top of the morphing bg */}
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.button
                  key="close-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: fastFade }}
                  exit={{ opacity: 0, transition: instantFade }}
                  className={`goey-search-close-content ${classNames.closeButton ?? ''}`.trim()}
                  onClick={handleCollapse}
                  aria-label="Close search"
                  type="button"
                >
                  <CloseIcon size={18} />
                </motion.button>
              ) : hasTabs ? (
                <motion.div
                  key="tabs-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: fastFade }}
                  exit={{ opacity: 0, transition: instantFade }}
                  className={`goey-search-tabs-content ${classNames.tabList ?? ''}`.trim()}
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
                          classNames.tab ?? '',
                          isActive ? (classNames.activeTab ?? '') : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => handleTabClick(tab.value)}
                        type="button"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="goey-search-active-indicator"
                            className="goey-search-tab-indicator"
                            transition={transition}
                          />
                        )}
                        <span className="goey-search-tab-content">
                          {tab.icon && (
                            <span className="goey-search-tab-icon">{tab.icon}</span>
                          )}
                          {tab.label}
                        </span>
                      </button>
                    )
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>
    </LayoutGroup>
  )
}
