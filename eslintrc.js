module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'node': true,
        'es2020': true
    },
    'globals': {
        'fetch': 'readonly'
    },
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always']
    }
};
