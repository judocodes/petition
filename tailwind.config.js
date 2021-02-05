module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    purge: {
        enabled: true,
        content: [
            // './views/*.handlebars',
            './static/*.js',
            './views/**/*.handlebars',
        ],
    },
    theme: {
        fontFamily: 'Helvica, sans-serif',
        extend: {},
    },
    variants: {},
    plugins: [],
};
