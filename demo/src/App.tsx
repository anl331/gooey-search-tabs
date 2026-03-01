import { useState, useEffect, useRef } from 'react'
import { GoeySearch, animationPresets } from 'goey-search'
import type { AnimationPresetName } from 'goey-search'
import { Analytics } from '@vercel/analytics/react'
import 'goey-search/styles.css'
import './App.css'

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function NpmIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return { copied, copy }
}

const PRESET_NAMES: AnimationPresetName[] = ['smooth', 'bouncy', 'subtle', 'snappy']


function App() {
  const installCopy = useCopy()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [heroLanding, setHeroLanding] = useState(false)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const prevHeroVisible = useRef(true)

  // Playground state
  const [pgTabs, setPgTabs] = useState([
    { label: '\u{1F525} Popular', value: 'popular' },
    { label: '\u2764\uFE0F Favorites', value: 'favorites' },
  ])
  const [pgPreset, setPgPreset] = useState<AnimationPresetName | null>('smooth')
  const [pgSpring, setPgSpring] = useState(true)
  const [pgBounce, setPgBounce] = useState(0.1)
  const [pgPlaceholder, setPgPlaceholder] = useState('Search...')
  const codeCopy = useCopy()

  // Watch hero title visibility for header transform
  useEffect(() => {
    if (!heroTitleRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: `-${56}px 0px 0px 0px` }
    )
    observer.observe(heroTitleRef.current)
    return () => observer.disconnect()
  }, [])

  // Trigger landing animation when hero reappears (scrolling back up)
  useEffect(() => {
    if (heroVisible && !prevHeroVisible.current) {
      setHeroLanding(true)
      const timer = setTimeout(() => setHeroLanding(false), 500)
      return () => clearTimeout(timer)
    }
    prevHeroVisible.current = heroVisible
  }, [heroVisible])

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Generated code for playground
  const tabsCode = pgTabs.length > 0
    ? `\n      tabs={[\n${pgTabs.map((t) => `        { label: '${t.label}', value: '${t.value}' },`).join('\n')}\n      ]}`
    : ''
  const presetCode = pgPreset ? `\n      preset="${pgPreset}"` : ''
  const springCode = !pgPreset && !pgSpring ? `\n      spring={false}` : ''
  const bounceCode = !pgPreset && pgSpring && pgBounce !== 0.1 ? `\n      bounce={${pgBounce}}` : ''
  const placeholderCode = pgPlaceholder ? `\n      placeholder="${pgPlaceholder}"` : ''
  const generatedCode = `<GoeySearch${tabsCode}${presetCode}${springCode}${bounceCode}${placeholderCode}\n    />`

  return (
    <>
      <Analytics />

      {/* Header */}
      <header className={`site-header${!heroVisible ? ' header--hero-hidden' : ''}`}>
        <div className="header-inner">
          <button className="header-logo" onClick={() => window.scrollTo(0, 0)}>
            goey-search <img src="/mascot.png" className="header-mascot" alt="" />
          </button>

          <nav className="header-nav">
            <button className="nav-link" onClick={() => scrollTo('playground')}>Playground</button>
            <button className="nav-link" onClick={() => scrollTo('docs')}>Docs</button>
          </nav>

          <div className="header-icons">
            <a href="https://github.com/anl331/goey-search" target="_blank" rel="noopener noreferrer" className="header-icon-link" aria-label="GitHub">
              <GithubIcon size={18} />
            </a>
            <a href="https://www.npmjs.com/package/goey-search" target="_blank" rel="noopener noreferrer" className="header-icon-link" aria-label="npm">
              <NpmIcon size={18} />
            </a>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button className="mobile-menu-link" onClick={() => scrollTo('playground')}>Playground</button>
            <button className="mobile-menu-link" onClick={() => scrollTo('docs')}>Docs</button>
            <div className="mobile-menu-divider" />
            <div className="mobile-menu-icons">
              <a href="https://github.com/anl331/goey-search" target="_blank" rel="noopener noreferrer" className="header-icon-link">
                <GithubIcon size={18} /> GitHub
              </a>
              <a href="https://www.npmjs.com/package/goey-search" target="_blank" rel="noopener noreferrer" className="header-icon-link">
                <NpmIcon size={18} /> npm
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <span /> v0.1.0
        </div>
        <h1 ref={heroTitleRef} className={heroLanding ? 'hero-title--landing' : ''}>goey-search <img src="/mascot.png" className={`hero-mascot${heroLanding ? ' hero-mascot--landing' : ''}`} alt="" /></h1>
        <p className="hero-description">
          A morphing search bar with animated tab navigation for React.
          Spring physics, keyboard shortcuts, and full customization out of the box.
        </p>
        <div className="hero-install">
          <div className="install-wrapper">
            <code><span className="prompt">$</span> npm install goey-search</code>
            <button className="copy-btn" onClick={() => installCopy.copy('npm install goey-search')}>
              {installCopy.copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <a href="https://www.buymeacoffee.com/gxWiwwHU0P" target="_blank" rel="noopener noreferrer" className="bmc-btn">
            <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="" width={20} height={28} />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </div>

      {/* Playground */}
      <div className="playground-section" id="playground">
        <div className="playground-header">
          <h2>Playground</h2>
          <p>Configure props, preview live, and grab the generated code.</p>
        </div>

        <div className="playground-card">
          {/* Live Preview */}
          <div className="playground-preview">
            <GoeySearch
              tabs={pgTabs.length > 0 ? pgTabs.map((t) => ({
                label: t.label,
                value: t.value,
              })) : undefined}
              placeholder={pgPlaceholder}
              spring={pgSpring}
              bounce={pgBounce}
            />
          </div>

          {/* Controls grid */}
          <div className="playground-controls">
            {/* Tabs Editor */}
            <div className="playground-row">
              <span className="playground-label">Tabs</span>
              <div className="tab-editor">
                {pgTabs.map((tab, i) => (
                  <div className="tab-editor-row" key={i}>
                    <input
                      className="playground-input"
                      value={tab.label}
                      placeholder="Label (emojis welcome)"
                      onChange={(e) => {
                        const next = [...pgTabs]
                        next[i] = { ...next[i], label: e.target.value, value: e.target.value.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || `tab-${i}` }
                        setPgTabs(next)
                      }}
                    />
                    <button
                      className="tab-remove-btn"
                      onClick={() => setPgTabs(pgTabs.filter((_, j) => j !== i))}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  className="add-tab-btn"
                  onClick={() => setPgTabs([...pgTabs, { label: `Tab ${pgTabs.length + 1}`, value: `tab-${pgTabs.length + 1}` }])}
                >
                  + Add Tab
                </button>
              </div>
            </div>

            {/* Right side controls */}
            <div className="playground-right-controls">
              {/* Preset Selector */}
              <div className="playground-row">
                <span className="playground-label">Animation Preset</span>
                <div className="preset-buttons">
                  {PRESET_NAMES.map((p) => (
                    <button
                      key={p}
                      className="preset-pill"
                      data-active={pgPreset === p}
                      onClick={() => {
                        setPgPreset(p)
                        const pr = animationPresets[p]
                        setPgSpring(pr.spring)
                        setPgBounce(pr.bounce)
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spring Toggle */}
              <div className="playground-row">
                <div className="toggle-row">
                  <span className="toggle-row-label">Spring animation</span>
                  <button
                    className="toggle"
                    data-on={pgSpring}
                    onClick={() => { setPgSpring(!pgSpring); setPgPreset(null) }}
                  >
                    <div className="toggle-knob" />
                  </button>
                </div>
              </div>

              {/* Bounce Slider */}
              <div className="playground-row">
                <div className="slider-item">
                  <div className="slider-item-header">
                    <span className="slider-item-label">Bounce</span>
                    <span className="slider-item-value">{pgBounce.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={pgBounce}
                    onChange={(e) => { setPgBounce(Number(e.target.value)); setPgPreset(null) }}
                  />
                </div>
              </div>

              {/* Placeholder Input */}
              <div className="playground-row">
                <span className="playground-label">Placeholder</span>
                <input
                  className="playground-input"
                  value={pgPlaceholder}
                  onChange={(e) => setPgPlaceholder(e.target.value)}
                  placeholder="Placeholder text..."
                />
              </div>
            </div>
          </div>

          {/* Generated Code */}
          <div className="playground-code">
            <button className="code-copy-btn" onClick={() => codeCopy.copy(generatedCode)}>
              {codeCopy.copied ? 'Copied!' : 'Copy'}
            </button>
            <pre><code>{generatedCode}</code></pre>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="docs" id="docs">
        <div className="docs-header">
          <h2>Documentation</h2>
          <p>Everything you need to add a morphing search bar to your React app.</p>
        </div>

        {/* 01 Quick Start */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">01</div>
            <h3>Quick Start</h3>
          </div>
          <div className="doc-section-content">
            <p>
              Import the <span className="inline-code">GoeySearch</span> component and the stylesheet.
            </p>
            <pre><code>{`import { GoeySearch } from 'goey-search'
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
}`}</code></pre>
            <p>
              Requires <span className="inline-code">react</span>,{' '}
              <span className="inline-code">react-dom</span>, and{' '}
              <span className="inline-code">framer-motion</span> as peer dependencies.
            </p>
          </div>
        </div>

        {/* 02 GoeySearch Props */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">02</div>
            <h3>GoeySearch Props</h3>
          </div>
          <div className="doc-section-content">
            <div className="table-scroll">
            <table className="prop-table">
              <thead>
                <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>tabs</td><td>GoeySearchTab[]</td><td>—</td><td>Tab items shown in collapsed state</td></tr>
                <tr><td>activeTab</td><td>string</td><td>—</td><td>Controlled active tab value</td></tr>
                <tr><td>defaultActiveTab</td><td>string</td><td>—</td><td>Default active tab (uncontrolled)</td></tr>
                <tr><td>onTabChange</td><td>(value: string) =&gt; void</td><td>—</td><td>Called when a tab is clicked</td></tr>
                <tr><td>onSearch</td><td>(value: string) =&gt; void</td><td>—</td><td>Called when user presses Enter</td></tr>
                <tr><td>onChange</td><td>(value: string) =&gt; void</td><td>—</td><td>Called on every keystroke</td></tr>
                <tr><td>placeholder</td><td>string</td><td>—</td><td>Placeholder text for the input</td></tr>
                <tr><td>value</td><td>string</td><td>—</td><td>Controlled input value</td></tr>
                <tr><td>defaultValue</td><td>string</td><td>—</td><td>Default input value (uncontrolled)</td></tr>
                <tr><td>defaultExpanded</td><td>boolean</td><td>false</td><td>Start in expanded state</td></tr>
                <tr><td>onExpandedChange</td><td>(expanded: boolean) =&gt; void</td><td>—</td><td>Called when expanded state changes</td></tr>
                <tr><td>spring</td><td>boolean</td><td>true</td><td>Use spring-based animation</td></tr>
                <tr><td>bounce</td><td>number</td><td>—</td><td>Spring bounce factor (0–1)</td></tr>
                <tr><td>preset</td><td>AnimationPresetName</td><td>—</td><td>Named animation preset</td></tr>
                <tr><td>className</td><td>string</td><td>—</td><td>Class on the outer container</td></tr>
                <tr><td>style</td><td>CSSProperties</td><td>—</td><td>Inline styles on the outer container</td></tr>
                <tr><td>classNames</td><td>GoeySearchClassNames</td><td>—</td><td>Custom class names for sub-elements</td></tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* 03 GoeySearchTab */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">03</div>
            <h3>GoeySearchTab</h3>
          </div>
          <div className="doc-section-content">
            <p>
              Each tab requires a <span className="inline-code">label</span> and{' '}
              <span className="inline-code">value</span>.
            </p>
            <pre><code>{`interface GoeySearchTab {
  label: string
  value: string
}`}</code></pre>
            <div className="table-scroll">
            <table className="prop-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Required</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>label</td><td>string</td><td>Yes</td><td>Display label for the tab (emojis welcome)</td></tr>
                <tr><td>value</td><td>string</td><td>Yes</td><td>Unique value for identification and callbacks</td></tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* 04 GoeySearchClassNames */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">04</div>
            <h3>Custom Styling</h3>
          </div>
          <div className="doc-section-content">
            <p>
              Override styles for any part of the search bar with{' '}
              <span className="inline-code">classNames</span>.
            </p>
            <pre><code>{`<GoeySearch
  classNames={{
    container: 'my-container',
    searchButton: 'my-search-btn',
    tab: 'my-tab',
    input: 'my-input',
  }}
/>`}</code></pre>
            <div className="table-scroll">
            <table className="prop-table">
              <thead>
                <tr><th>Key</th><th>Target</th></tr>
              </thead>
              <tbody>
                <tr><td>container</td><td>Outer wrapper</td></tr>
                <tr><td>searchButton</td><td>Search icon button</td></tr>
                <tr><td>tabList</td><td>Tabs container</td></tr>
                <tr><td>tab</td><td>Individual tab button</td></tr>
                <tr><td>activeTab</td><td>Currently active tab</td></tr>
                <tr><td>input</td><td>Search text input</td></tr>
                <tr><td>closeButton</td><td>Close/collapse button</td></tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* 05 Animation Presets */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">05</div>
            <h3>Animation Presets</h3>
          </div>
          <div className="doc-section-content">
            <p>
              Four built-in presets control spring physics. Apply via the{' '}
              <span className="inline-code">preset</span> prop.
            </p>
            <pre><code>{`<GoeySearch preset="bouncy" />

// Or import and inspect the presets object
import { animationPresets } from 'goey-search'`}</code></pre>
            <div className="table-scroll">
            <table className="prop-table">
              <thead>
                <tr><th>Preset</th><th>Bounce</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>smooth</td><td>0.1</td><td>Gentle spring with minimal bounce</td></tr>
                <tr><td>bouncy</td><td>0.6</td><td>Exaggerated bouncy effect</td></tr>
                <tr><td>subtle</td><td>0.05</td><td>Very smooth, almost no bounce</td></tr>
                <tr><td>snappy</td><td>0.4</td><td>Quick response with moderate bounce</td></tr>
              </tbody>
            </table>
            </div>
            <p>
              You can also set <span className="inline-code">spring</span> and{' '}
              <span className="inline-code">bounce</span> individually for full control.
              When <span className="inline-code">spring</span> is{' '}
              <span className="inline-code">false</span>, animations use smooth ease-in-out curves.
            </p>
          </div>
        </div>

        {/* 06 Tabs */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">06</div>
            <h3>Tabs</h3>
          </div>
          <div className="doc-section-content">
            <p>
              Pass an array of tabs to show category navigation. Omit tabs for a simple search bar.
            </p>
            <pre><code>{`// With tabs
<GoeySearch
  tabs={[
    { label: '🔥 Popular', value: 'popular' },
    { label: '❤️ Favorites', value: 'favorites' },
    { label: '🕐 Recent', value: 'recent' },
  ]}
  onTabChange={(value) => console.log(value)}
/>

// Without tabs — simple search bar
<GoeySearch placeholder="Search..." />`}</code></pre>
          </div>
        </div>

        {/* 07 Controlled Mode */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">07</div>
            <h3>Controlled Mode</h3>
          </div>
          <div className="doc-section-content">
            <p>
              Control both the search input value and the active tab from your own state.
            </p>
            <pre><code>{`const [query, setQuery] = useState('')
const [tab, setTab] = useState('all')

<GoeySearch
  tabs={tabs}
  value={query}
  onChange={setQuery}
  activeTab={tab}
  onTabChange={setTab}
  onSearch={(val) => fetchResults(val, tab)}
/>`}</code></pre>
          </div>
        </div>

        {/* 08 Keyboard Shortcuts */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">08</div>
            <h3>Keyboard Shortcuts</h3>
          </div>
          <div className="doc-section-content">
            <div className="table-scroll">
            <table className="prop-table">
              <thead>
                <tr><th>Key</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>Enter</td><td>Submit search (fires onSearch callback)</td></tr>
                <tr><td>Escape</td><td>Collapse the search bar</td></tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* 09 Exports */}
        <div className="doc-section">
          <div className="doc-section-label">
            <div className="doc-number">09</div>
            <h3>Exports</h3>
          </div>
          <div className="doc-section-content">
            <pre><code>{`// Component
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
} from 'goey-search'`}</code></pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <p>
          Part of the{' '}
          <a href="https://goey-toast.vercel.app" target="_blank" rel="noopener noreferrer">goey</a>{' '}
          family
        </p>
      </footer>
    </>
  )
}

export default App
