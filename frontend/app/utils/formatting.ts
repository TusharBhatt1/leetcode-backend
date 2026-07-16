export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatValue(value: unknown): string {
  if (value === undefined) return 'Not returned';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return JSON.stringify(value);
}

export function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    accepted: '✅',
    pending: '⏳',
    running: '🏃',
    wrong_answer: '❌',
    error: '🔴',
  };
  return emojis[status] || '•';
}

export function getDifficultyClasses(difficulty: string): string {
  const classes: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
  };
  return classes[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

export function getStatusClasses(status: string): string {
  const classes: Record<string, string> = {
    accepted: 'bg-green-50 text-green-900 border-green-200',
    pending: 'bg-blue-50 text-blue-900 border-blue-200',
    running: 'bg-blue-50 text-blue-900 border-blue-200',
    wrong_answer: 'bg-red-50 text-red-900 border-red-200',
    error: 'bg-red-50 text-red-900 border-red-200',
  };
  return classes[status.toLowerCase()] || 'bg-gray-50 text-gray-900';
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural || `${singular}s`;
}
