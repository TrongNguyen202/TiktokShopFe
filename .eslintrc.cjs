module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    camelcase: 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'warn',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'no-nested-ternary': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    eqeqeq: 'off',
    'no-restricted-syntax': 'off',
    'prefer-destructuring': 'off',
    'no-unused-expressions': 'warn',
    radix: 'off',
    'no-underscore-dangle': 'off',

    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/no-array-index-key': 'off',
    'react/require-default-props': 'off',
    'react/no-unstable-nested-components': 'warn',
    'react/forbid-prop-types': 'warn',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/alt-text': 'off',
  },
};
