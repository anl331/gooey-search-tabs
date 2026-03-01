import { useState, useRef, useCallback, useEffect, useId } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { GoeySearchProps } from '../types'
import { animationPresets } from '../presets'
import { SearchIcon } from './SearchIcon'
import { CloseIcon } from './CloseIcon'

const CLOSE_SIZE = 44
const BAR_COLLAPSED = 44 // icon bar width when collapsed (padding + trigger)
const DEFAULT_INPUT_WIDTH = 220
const GAP = 8
const FADE_DUR = 0.1 // opacity fade duration for morph sequencing

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

  // Reset locked width when tabs change so it re-measures
  const tabsKey = tabs.map(t => `${t.label}|${t.value}`).join(',')
  useEffect(() => {
    setLockedWidth(null)
  }, [tabsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Measure and lock the wrapper width after first paint (only when tabs exist)
  useEffect(() => {
    if (hasTabs && wrapperRef.current && lockedWidth === null) {
      requestAnimationFrame(() => {
        if (wrapperRef.current) {
          // Measure tabs content directly so grid min-width:0 doesn't affect the result
          const tabsEl = wrapperRef.current.querySelector('.goey-search-tabs-content') as HTMLElement
          if (tabsEl) {
            setLockedWidth(BAR_COLLAPSED + GAP + tabsEl.scrollWidth)
          }
        }
      })
    }
  }, [lockedWidth, tabs, hasTabs])

  // Calculate dimensions for morph
  const tabsWidth = hasTabs && lockedWidth ? lockedWidth - BAR_COLLAPSED - GAP : undefined
  const inputExpandedWidth = hasTabs && lockedWidth
    ? lockedWidth - BAR_COLLAPSED - GAP - CLOSE_SIZE
    : DEFAULT_INPUT_WIDTH

  // Approximate time for the width morph to perceptually settle (for sequencing the final fade)
  const morphSettleTime = useSpring ? 0.35 : 0.25

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

  // Morph transition for the right-slot width animation
  // Delayed by FADE_DUR so opacity fades first, then width morphs
  const morphTransition = { ...transition, delay: FADE_DUR }

  // When hasTabs, the bar uses flex:1 so it fills remaining space as
  // the right-slot spring-animates. This lets the spring bounce flow
  // naturally to both pills (bar squishes as right-slot overshoots).
  const barStyle = hasTabs && lockedWidth
    ? { flex: '1 1 0%', minWidth: BAR_COLLAPSED, overflow: 'hidden' as const }
    : undefined

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
        <div className="goey-search-bar" style={barStyle}>
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
              hasTabs && lockedWidth ? (
                /* Tabs mode: fixed width input, revealed by bar's overflow:hidden
                   as the right-slot spring shrinks and bar grows via flex */
                <motion.div
                  key="input-area"
                  className="goey-search-input-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15, delay: FADE_DUR } }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  style={{ width: inputExpandedWidth, flexShrink: 0 }}
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
              ) : (
                /* No tabs: width animation for standalone input */
                <motion.div
                  key="input-area"
                  className="goey-search-input-wrapper"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: inputExpandedWidth,
                    opacity: 1,
                    transition: { ...transition, opacity: { duration: 0.08 } },
                  }}
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
              )
            )}
          </AnimatePresence>
        </div>

        {/* Right side: morphing pill (with tabs)
            flex-shrink:0 so the spring bounce isn't suppressed by flex,
            letting the bar squish naturally as the pill overshoots */}
        {hasTabs && (
          <motion.div
            className="goey-search-right-slot"
            initial={false}
            animate={{ width: expanded ? CLOSE_SIZE : (tabsWidth ?? 'auto') }}
            transition={tabsWidth != null ? morphTransition : { duration: 0 }}
            style={{ flexShrink: 0 }}
          >
            {/* Tabs — always rendered, opacity controlled.
                On collapse: fade in early so tabs are visible during the spring bounce */}
            <motion.div
              className={`goey-search-tabs-content ${classNames.tabList ?? ''}`.trim()}
              role="tablist"
              initial={false}
              animate={{ opacity: expanded ? 0 : 1 }}
              transition={{
                duration: expanded ? FADE_DUR : 0.2,
                delay: expanded ? 0 : FADE_DUR + morphSettleTime * 0.3,
              }}
              style={{ pointerEvents: expanded ? 'none' : 'auto' }}
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

            {/* Close button — always rendered, opacity controlled.
                On expand: fade in early so X is visible during the spring bounce */}
            <motion.button
              className={`goey-search-close-content ${classNames.closeButton ?? ''}`.trim()}
              initial={false}
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{
                duration: expanded ? 0.2 : FADE_DUR,
                delay: expanded ? FADE_DUR + morphSettleTime * 0.3 : 0,
              }}
              onClick={handleCollapse}
              aria-label="Close search"
              type="button"
              style={{ pointerEvents: expanded ? 'auto' : 'none' }}
            >
              <CloseIcon size={18} />
            </motion.button>
          </motion.div>
        )}

        {/* Right side: simple close button (no-tabs case) */}
        {!hasTabs && (
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="close-slot"
                className="goey-search-right-slot"
                style={{ width: CLOSE_SIZE }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <button
                  className={`goey-search-close-content ${classNames.closeButton ?? ''}`.trim()}
                  onClick={handleCollapse}
                  aria-label="Close search"
                  type="button"
                >
                  <CloseIcon size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </LayoutGroup>
  )
}
