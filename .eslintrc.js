module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'space-before-function-paren': 0,
        'indent': 0,
        'no-multi-spaces': 'off',
        "no-multiple-empty-lines": [0, { "max": 100 }],
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        "no-unused-vars": [2, {
            "vars": "local",
            "args": "none"
        }],
        "semi": [0],
        "no-mixed-spaces-and-tabs": [0],
        "space-before-blocks": 0,
        "key-spacing": 0,
        "arrow-spacing": 0,
        "no-trailing-spaces": 0,
        "eol-last": 0,
        "prefer-const": 0,
        "quotes": 0,
        "keyword-spacing": 0,
        "object-curly-spacing": 0,
        "object-curly-spacing": 0,
        "comma-spacing": 0,
        "comma-dangle": 0,
        "curly": 0,
        "vue/no-unused-vars": 0


    }
}