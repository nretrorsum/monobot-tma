import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoadingScreen } from './components/LoadingScreen'
import { TabNavigation, type Tab } from './components/TabNavigation'
import { Dashboard } from './components/Dashboard'
import { Analytics } from './components/Analytics'
import { Goals } from './components/Goals'

export default function App() {
  const { isAuthenticated, isLoading, error } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  if (isLoading) return <LoadingScreen />

  if (error) {
    return (
      <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-white mb-2">
          Mono<span className="text-purple">bot</span>
        </h1>
        <p className="text-red text-sm mb-4">{error}</p>
        <div className="text-xs text-muted-light bg-card-bg rounded-xl p-4 max-w-sm text-left break-all">
          <div>API: {import.meta.env.VITE_API_URL || '(not set)'}</div>
          <div className="mt-1">Mode: {import.meta.env.DEV ? 'dev' : 'prod'}</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-page-bg text-text">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Mono<span className="text-purple">bot</span>
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card-bg">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-medium text-white">0</span>
            <span className="text-xs text-muted">днів</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 mb-4">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="px-6 pb-8 animate-fade-in" key={activeTab}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'goals' && <Goals />}
      </div>
    </div>
  )
}
