module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 'off',
    '@typescript-eslint/member-delimiter-style': 0,
    'no-trailing-spaces': 0
  }
}
