export function extractEmoji(name: string): { emoji: string; cleanName: string } {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u
  const match = name.match(emojiRegex)
  if (match) {
    return { emoji: match[1], cleanName: name.slice(match[0].length) }
  }
  return { emoji: '🎯', cleanName: name }
}
