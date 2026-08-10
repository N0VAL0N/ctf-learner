// Парсинг ANSI-цветов в HTML
export function parseAnsiToHtml(text: string): string {
  // Простой парсер для цветов (можно расширить)
  const colorMap: Record<string, string> = {
    '31': 'ansi-red',
    '32': 'ansi-green',
    '33': 'ansi-yellow',
    '34': 'ansi-blue',
    '35': 'ansi-magenta',
    '36': 'ansi-cyan',
    '37': 'ansi-white',
    '1': 'ansi-bold'
  }

  // Ищем последовательности \x1b\[(...)m
  return text.replace(/\x1b\[(\d+)(?:;\d+)*m/g, (match, code) => {
    const className = colorMap[code] || ''
    return className ? `<span class="${className}">` : '</span>'
  })
}