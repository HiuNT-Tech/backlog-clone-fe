module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Code style changes
        'refactor', // Code refactoring
        'test',     // Adding tests
        'chore',    // Maintenance tasks
        'ci',       // CI/CD changes
        'build',    // Build system changes
        'perf',     // Performance improvements
        'revert',   // Revert changes
      ],
    ],
    'subject-case': [2, 'never'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
