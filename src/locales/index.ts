export type Locale = 'ru' | 'en'

export interface Translation {
  [key: string]: string
}

export const translations: Record<Locale, Translation> = {
  ru: {
    // Навигация
    'nav.home': 'Главная',
    'nav.lessons': 'Уроки',
    'nav.compiler': 'Компилятор',
    'nav.settings': 'Настройки',

    // Главная
    'home.welcome': 'Добро пожаловать в CTF Learner',
    'home.lessons_completed': 'Уроков пройдено',
    'home.tasks_solved': 'Задач решено',
    'home.total_lessons': 'Всего уроков',
    'home.progress': 'Прогресс',
    'home.go_to_lessons': 'Перейти к урокам',
    'home.open_compiler': 'Открыть компилятор',

    // Уроки
    'lessons.title': 'Уроки',
    'lessons.search_placeholder': 'Поиск по урокам...',
    'lessons.no_results': 'Нет уроков по вашему запросу',

    // Компилятор
    'compiler.title': 'Компилятор Python',
    'compiler.loading': '⏳ Загрузка Pyodide...',
    'compiler.run': 'Run',
    'compiler.clear': 'Clear',
    'compiler.copy': 'Copy',
    'compiler.output': 'Output',
    'compiler.run_hint': 'Запустить код (Ctrl+Enter)',
    'compiler.clear_hint': 'Очистить редактор',
    'compiler.copy_hint': 'Скопировать код',
    'compiler.placeholder': 'Run the code to see the output',

    // Настройки
    'settings.title': 'Настройки',
    'settings.general': 'Общие',
    'settings.compiler': 'Компилятор',
    'settings.theme': 'Тема',
    'settings.theme_dark': 'Тёмная',
    'settings.theme_light': 'Светлая',
    'settings.theme_hint': 'Выберите тему для всего приложения',
    'settings.global_font': 'Глобальный размер шрифта: {size}px',
    'settings.global_font_hint': 'Изменяет размер текста во всём приложении',
    'settings.editor_font': 'Размер шрифта в редакторе: {size}px',
    'settings.editor_font_hint': 'Размер шрифта внутри редактора кода (Monaco)',
    'settings.line_numbers': 'Показывать номера строк',
    'settings.line_numbers_hint': 'Отображать номера строк в редакторе',
    'settings.minimap': 'Мини-карта',
    'settings.minimap_hint': 'Показывать мини-карту кода справа от редактора',
    'settings.language': 'Язык',
    'settings.language_hint': 'Выберите язык интерфейса',
    'settings.language_ru': 'Русский',
    'settings.language_en': 'English',
    'settings.reset_progress': 'Сбросить прогресс',
    'settings.export': 'Экспорт (QR)',
    'settings.import': 'Импорт (QR)',

    // QR Модалка
    'qr.export_title': 'Экспорт прогресса',
    'qr.import_title': 'Импорт прогресса',
    'qr.scan_hint': 'Отсканируйте QR-код на телефоне, чтобы импортировать прогресс',
    'qr.copy_data': 'Скопировать данные',
    'qr.paste_data': 'Вставьте данные, полученные с другого устройства:',
    'qr.import_button': 'Импортировать',
    'qr.close': 'Закрыть',
    'qr.invalid_data': 'Неверный формат данных',

    // Уроки (детально)
    'lesson.back': '← Назад',
    'lesson.completed': '✅ Урок пройден',
    'lesson.mark_completed': 'Отметить урок пройденным',
    'lesson.tasks': 'Задачи',
    'lesson.task': 'Задача',
    'lesson.solve': 'Решить',
    'lesson.solved': '✅ Решено',
    'lesson.examples': 'Примеры',
    'lesson.not_found': 'Урок не найден',

    // Консоль
    'console.clear': 'Очистить вывод',

    // Ошибки
    'error.generic': 'Произошла ошибка',

    'settings.bracket_pairs': 'Подсветка скобок',
    'settings.bracket_pairs_hint': 'Показывать цветные пары скобок',
    'settings.error_highlight': 'Подсветка ошибок',
    'settings.error_highlight_hint': 'Подсвечивать синтаксические ошибки',
    'settings.render_whitespace': 'Отображение пробелов',
    'settings.render_whitespace_hint': 'Показывать пробелы и табуляции',

    'home.lines_of_code': 'Строк кода написано',
    'nav.practice': 'Практика',
    'nav.library': 'Библиотека',
    'practice.title': 'Практика',
    'practice.subtitle': 'Генерация случайных задач для тренировки',
    'practice.category': 'Категория',
    'practice.difficulty': 'Сложность',
    'practice.generate': 'Сгенерировать задачу',
    'practice.empty': 'Нажмите "Сгенерировать задачу", чтобы начать',
    'library.title': 'Библиотека',
    'library.subtitle': 'Шпаргалка по Python с примерами кода',
    'library.search_placeholder': 'Поиск по библиотеке...',
    'home.go_to_practice': 'Перейти к практике',

    'lesson.completed_title': 'Урок завершён!',
    'lesson.completed_message': 'Вы успешно прошли все задания урока.',
    'lesson.finish': 'Завершить урок',
    'lesson.insert_code': 'Вставьте код вместо ???',
    'practice.mode': 'Режим',
    'practice.mode_simple': 'Простой',
    'practice.mode_olympiad': 'Олимпиадный',
    'library.filter_title': 'Фильтры',
    'library.filter_category': 'Категория',

    'practice.count': 'Количество заданий',

    'library.sort_by': 'Сортировка',

    'library.filter_difficulty': 'Сложность',

    // Практика (новые ключи)
    'practice.next': 'Следующее',
    'practice.skip': 'Пропустить',
    'practice.results': 'Результаты',
    'practice.solved': 'Решено',
    'practice.skipped': 'Пропущено',
    'practice.not_enough_tasks': 'Недостаточно задач (доступно {count})',
    'practice.finish': 'Завершить',
    'practice.retry_skipped': 'Повторить пропущенные',
    'practice.all_done': '🎉 Все задачи пройдены!',
    'practice.your_score': 'Ваш результат',
    'practice.skipped_tasks': 'Пропущенные задачи',
    'practice.retry': 'Повторить',
    'practice.total': 'Всего',
    'practice.new': 'Новая практика',
    'practice.check': 'Проверить',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.lessons': 'Lessons',
    'nav.compiler': 'Compiler',
    'nav.settings': 'Settings',

    // Home
    'home.welcome': 'Welcome to CTF Learner',
    'home.lessons_completed': 'Lessons completed',
    'home.tasks_solved': 'Tasks solved',
    'home.total_lessons': 'Total lessons',
    'home.progress': 'Progress',
    'home.go_to_lessons': 'Go to lessons',
    'home.open_compiler': 'Open compiler',

    // Lessons
    'lessons.title': 'Lessons',
    'lessons.search_placeholder': 'Search lessons...',
    'lessons.no_results': 'No lessons found',

    // Compiler
    'compiler.title': 'Python Compiler',
    'compiler.loading': '⏳ Loading Pyodide...',
    'compiler.run': 'Run',
    'compiler.clear': 'Clear',
    'compiler.copy': 'Copy',
    'compiler.output': 'Output',
    'compiler.run_hint': 'Run code (Ctrl+Enter)',
    'compiler.clear_hint': 'Clear editor',
    'compiler.copy_hint': 'Copy code',
    'compiler.placeholder': 'Run the code to see the output',

    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.compiler': 'Compiler',
    'settings.theme': 'Theme',
    'settings.theme_dark': 'Dark',
    'settings.theme_light': 'Light',
    'settings.theme_hint': 'Choose theme for the whole app',
    'settings.global_font': 'Global Font Size: {size}px',
    'settings.global_font_hint': 'Changes font size of all text in the app',
    'settings.editor_font': 'Editor Font Size: {size}px',
    'settings.editor_font_hint': 'Font size inside the code editor (Monaco)',
    'settings.line_numbers': 'Show Line Numbers',
    'settings.line_numbers_hint': 'Display line numbers in the editor',
    'settings.minimap': 'Minimap',
    'settings.minimap_hint': 'Show minimap of the code on the right side of the editor',
    'settings.language': 'Language',
    'settings.language_hint': 'Choose interface language',
    'settings.language_ru': 'Русский',
    'settings.language_en': 'English',
    'settings.reset_progress': 'Reset progress',
    'settings.export': 'Export (QR)',
    'settings.import': 'Import (QR)',

    // QR Modal
    'qr.export_title': 'Export progress',
    'qr.import_title': 'Import progress',
    'qr.scan_hint': 'Scan QR code on your phone to import progress',
    'qr.copy_data': 'Copy data',
    'qr.paste_data': 'Paste data from another device:',
    'qr.import_button': 'Import',
    'qr.close': 'Close',
    'qr.invalid_data': 'Invalid data format',

    // Lesson detail
    'lesson.back': '← Back',
    'lesson.completed': '✅ Lesson completed',
    'lesson.mark_completed': 'Mark lesson as completed',
    'lesson.tasks': 'Tasks',
    'lesson.task': 'Task',
    'lesson.solve': 'Solve',
    'lesson.solved': '✅ Solved',
    'lesson.examples': 'Examples',
    'lesson.not_found': 'Lesson not found',

    // Console
    'console.clear': 'Clear output',

    // Errors
    'error.generic': 'An error occurred',

    'settings.bracket_pairs': 'Bracket Pair Colorization',
    'settings.bracket_pairs_hint': 'Show colored bracket pairs',
    'settings.error_highlight': 'Error Highlighting',
    'settings.error_highlight_hint': 'Highlight syntax errors',
    'settings.render_whitespace': 'Render Whitespace',
    'settings.render_whitespace_hint': 'Show spaces and tabs',

    'home.lines_of_code': 'Lines of code written',
    'nav.practice': 'Practice',
    'nav.library': 'Library',
    'practice.title': 'Practice',
    'practice.subtitle': 'Generate random tasks for training',
    'practice.category': 'Category',
    'practice.difficulty': 'Difficulty',
    'practice.generate': 'Generate task',
    'practice.empty': 'Click "Generate task" to start',
    'library.title': 'Library',
    'library.subtitle': 'Python cheat sheet with code examples',
    'library.search_placeholder': 'Search library...',
    'home.go_to_practice': 'Go to practice',

    'lesson.completed_title': 'Lesson completed!',
    'lesson.completed_message': 'You have successfully completed all tasks.',
    'lesson.finish': 'Finish lesson',
    'lesson.insert_code': 'Insert code instead of ???',
    'practice.mode': 'Mode',
    'practice.mode_simple': 'Simple',
    'practice.mode_olympiad': 'Olympiad',
    'library.filter_title': 'Filters',
    'library.filter_category': 'Category',

    'practice.count': 'Number of tasks',
    'library.sort_by': 'Sort by',

    'library.filter_difficulty': 'Difficulty',

    // Practice (new keys)
    'practice.next': 'Next',
    'practice.skip': 'Skip',
    'practice.results': 'Results',
    'practice.solved': 'Solved',
    'practice.skipped': 'Skipped',
    'practice.not_enough_tasks': 'Not enough tasks (available {count})',
    'practice.finish': 'Finish',
    'practice.retry_skipped': 'Retry skipped',
    'practice.all_done': '🎉 All tasks completed!',
    'practice.your_score': 'Your score',
    'practice.skipped_tasks': 'Skipped tasks',
    'practice.retry': 'Retry',
    'practice.total': 'Total',
    'practice.new': 'New practice',
    'practice.check': 'Check',
  }
}

export function t(key: string, locale: Locale = 'ru', params?: Record<string, string | number>): string {
  let text = translations[locale]?.[key] || translations['ru'][key] || key
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }
  return text
}