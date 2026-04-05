export type Tab = 'dashboard' | 'analytics' | 'goals'

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Сьогодні' },
  { id: 'analytics', label: 'Аналітика' },
  { id: 'goals', label: 'Цілі' },
]

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-card-bg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: activeTab === tab.id ? '#7c5cfc' : 'transparent',
            color: activeTab === tab.id ? 'white' : '#6a6a7c',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
