module.exports = {
    "extends": "google",
    "installedESLint": true,

    "rules": {
        "indent": ["error", 4],
        "comma-dangle": ["error", "always-multiline"],
        "arrow-parens": ["error", "as-needed"],
        "space-before-function-paren": ["error", { "anonymous": "always", "named": "never" }],
        "object-curly-spacing": ["error", "always"],
        "max-len": ["error", 100],
        "max-nested-callbacks": "off",
    },
};