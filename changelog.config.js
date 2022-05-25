module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: [
    'feat',
    'fix',
    'chore',
    'refactor',
    'style',
    'ci',
    'docs',
    'test',
    'perf',
    'revert',
    'build'
  ],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues'],
  scopes: [],
  types: {
    feat: {
      description: '新功能',
      emoji: '✨',
      value: 'feat'
    },
    fix: {
      description: '修复bug',
      emoji: '🐛',
      value: 'fix'
    },
    chore: {
      description: '构建/工程依赖/工具',
      emoji: '🔨',
      value: 'chore'
    },
    ci: {
      description: 'CI related changes',
      emoji: '👷',
      value: 'ci'
    },
    docs: {
      description: '文档变更',
      emoji: '✏️',
      value: 'docs'
    },
    perf: {
      description: '性能优化',
      emoji: '🚀',
      value: 'perf'
    },
    refactor: {
      description: '重构',
      emoji: '♻️',
      value: 'refactor'
    },
    revert: {
      description: '回退',
      emoji: '⏪️',
      value: 'revert'
    },
    style: {
      description: '代码的样式美化',
      emoji: '💄',
      value: 'style'
    },
    test: {
      description: '测试',
      emoji: '🧪',
      value: 'test'
    },
    build: {
      description: '打包',
      emoji: '📦️',
      value: 'build'
    }
  }
};
