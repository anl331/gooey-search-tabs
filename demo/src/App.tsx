import { useState } from 'react'
import { GoeySearch } from 'goey-search'
import type { AnimationPresetName } from 'goey-search'
import 'goey-search/styles.css'
import './App.css'

const sampleTabs = [
  { label: 'Popular', value: 'popular', icon: <span style={{ fontSize: 14 }}>&#128293;</span> },
  { label: 'Favorites', value: 'favorites', icon: <span style={{ fontSize: 14 }}>&#10084;&#65039;</span> },
]

const threeTabs = [
  { label: 'Popular', value: 'popular', icon: <span style={{ fontSize: 14 }}>&#128293;</span> },
  { label: 'Favorites', value: 'favorites', icon: <span style={{ fontSize: 14 }}>&#10084;&#65039;</span> },
  { label: 'Recent', value: 'recent', icon: <span style={{ fontSize: 14 }}>&#128336;</span> },
]

function App() {
  const [preset, setPreset] = useState<AnimationPresetName>('smooth')
  const [searchLog, setSearchLog] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('popular')

  return (
    <div className="app">
      <header className="hero">
        <h1>goey-search</h1>
        <p className="subtitle">A morphing search bar with animated tab navigation</p>
        <div className="badges">
          <span className="badge">React</span>
          <span className="badge">Framer Motion</span>
          <span className="badge">TypeScript</span>
        </div>
      </header>

      <section className="demo-section">
        <h2>Default</h2>
        <p className="description">Click the search icon to expand. Press Escape or the X to collapse.</p>
        <div className="demo-area">
          <GoeySearch
            tabs={sampleTabs}
            placeholder="Search..."
            onSearch={(val) => setSearchLog((prev) => [`"${val}"`, ...prev].slice(0, 5))}
            preset={preset}
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Animation Presets</h2>
        <p className="description">Try different spring physics.</p>
        <div className="preset-buttons">
          {(['smooth', 'bouncy', 'subtle', 'snappy'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`preset-btn ${p === preset ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="demo-section">
        <h2>Three Tabs</h2>
        <p className="description">Works with any number of tabs.</p>
        <div className="demo-area">
          <GoeySearch
            tabs={threeTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            placeholder="Search..."
            preset={preset}
          />
        </div>
        <p className="small-note">Active tab: {activeTab}</p>
      </section>

      <section className="demo-section">
        <h2>No Tabs</h2>
        <p className="description">Just a search icon that expands into an input.</p>
        <div className="demo-area">
          <GoeySearch
            placeholder="Search anything..."
            preset={preset}
          />
        </div>
      </section>

      {searchLog.length > 0 && (
        <section className="demo-section">
          <h2>Search Log</h2>
          <ul className="search-log">
            {searchLog.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </section>
      )}

      <footer>
        <p>
          Part of the <a href="https://goey-toast.vercel.app" target="_blank" rel="noopener noreferrer">goey</a> family
        </p>
      </footer>
    </div>
  )
}

export default App
