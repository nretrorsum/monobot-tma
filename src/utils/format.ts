export function getCurrencySymbol(currencyCode: number): string {
  switch (currencyCode) {
    case 980: return '₴'
    case 840: return '$'
    case 978: return '€'
    default: return '₴'
  }
}

export function formatMoney(kopecks: number, currencyCode: number = 980): string {
  const value = Math.abs(kopecks) / 100
  const formatted = value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${formatted} ${getCurrencySymbol(currencyCode)}`
}

export function formatMoneyShort(kopecks: number, currencyCode: number = 980): string {
  const value = Math.abs(kopecks) / 100
  const formatted = value.toLocaleString('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${formatted} ${getCurrencySymbol(currencyCode)}`
}

export function formatMoneyValue(kopecks: number): string {
  const value = Math.abs(kopecks) / 100
  return value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
  })
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
