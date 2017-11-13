/**
 * simple config file
 */
var pkg = require('./package.json');

module.exports = {

    dist: 'dist',
    /**
     * Header de la distribution.
     */
    banner:
    '/*!\n' +
    ' * Betrue 2017 .\n' +
    ' * http://alizarion.github.io/betrued\n' +
    ' *\n' +
    ' * Betrue, v<%= pkg.version %>\n' +
    ' * Apache 2.0 license.*/\n' ,

    closureStart: '(function() { var debugMode = false; \n',
    closureEnd: '\n})();',
    /**
     * Liste des fichiers JS de l'application qui seront minifier pour la prod.
     */
    src : [
        'src/app/*.module.js',
        'src/app/*.js'
    ],
    /**
     * Liste des librairies minifié à utiliser en prod
     */
    jsDependencies: [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-aria/angular-aria.min.js',
        'node_modules/angular-spinkit/build/angular-spinkit.min.js',
        'node_modules/angular-messages/angular-messages.min.js',
        'node_modules/angular-material/angular-material.min.js',
        'node_modules/three/build/three.min.js',
        'ext/ColladaLoader.js',
        'ext/OgbitControls.js',
        'ext/Detector.js',
        'ext/modernizr.js',
        'ext/ar.js'





    ] ,
    cssDependencies: [
        'node_modules/angular-material/angular-material.min.css',
        'node_modules/angular-spinkit/build/angular-spinkit.min.css'

    ],
    fontDependencies :[

    ]
};