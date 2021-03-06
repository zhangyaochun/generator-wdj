'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var WdjAppGenerator = module.exports = function WdjAppGenerator (args, options, config) {
    
    this.projectName = args[0];

    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({
            skipInstall: options['skip-install'],
            skipMessage: options['skip-install-message']
        });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WdjAppGenerator, yeoman.generators.Base);

WdjAppGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    if (!this.options['skip-welcome-message']) {
        console.log(this.yeoman);
    }

    var prompts = [{
        type : 'list',
        name : 'projectType',
        message : 'Which kind of project are u scaffolding?',
        choices : [{
            name : 'Typical Front-end project that running in browsers. ',
            value : 'browser'
        }, {
            name : 'Node.js project. ',
            value : 'node'
        }, {
            name : 'Sails project. ',
            value : 'sails'
        }, {
            name : 'Chrome Extension. ',
            value : 'crx'
        }, {
            name : 'Polymer project. ',
            value: 'polymer'
        }]
    }];

    this.prompt(prompts, function (props) {
        this.projectType = props.projectType;

        cb();
    }.bind(this));
};

WdjAppGenerator.prototype.app = function app() {
    switch (this.projectType) {
    case 'browser':
    case 'crx':
    case 'polymer':
        this.mkdir('app');

        // Make bower components dir
        this.mkdir('app/components');

        // Make images dir
        this.mkdir('app/images');

        // Make JavaScript dir
        this.mkdir('app/javascripts');

        // Make compass dir
        this.mkdir('app/compass');
        this.mkdir('app/compass/sass');
        this.mkdir('app/compass/images');

        this.mkdir('test/specs');

        this.copy('bowerrc', '.bowerrc');
        this.copy('_bower.json', 'bower.json');
        this.copy('_main.scss', 'app/compass/sass/main.scss');
        this.copy('_main.js', 'app/javascripts/main.js');
        this.copy('_karma.conf.js', 'test/karma.conf.js');
        this.copy('_test-main.js', 'test/test-main.js');

        if (this.projectType === 'browser') {
            this.copy('browser/_package.json', 'package.json');
            this.copy('browser/_Gruntfile.js', 'Gruntfile.js');
            this.copy('browser/_index.html', 'app/index.html');
            this.directory('browser/grunt', 'grunt');
        } else if (this.projectType === 'crx') {
            this.copy('_package_crx.json', 'package.json');
            this.copy('_Gruntfile_crx.js', 'Gruntfile.js');
            this.copy('_background.html', 'app/background.html');
            this.copy('_manifest.json', 'app/manifest.json');
            this.mkdir('app/dev');
            this.copy('_reload.js', 'app/dev/reload.js');
        } else if (this.projectType === 'polymer') {
            this.copy('polymer/_package_polymer.json', 'package.json');
            this.copy('polymer/_bower_polymer.json', 'bower.json');
            this.copy('polymer/_index_polymer.html', 'app/index.html');
            this.copy('browser/_Gruntfile.js', 'Gruntfile.js');
            this.directory('polymer/elements', 'app/elements');
            this.directory('browser/grunt', 'grunt');
            this.directory('polymer/grunt', 'grunt');
        }
        break;
    case 'node':
        this.copy('_package_node.json', 'package.json');
        this.copy('_Gruntfile_node.js', 'Gruntfile.js');
        break;
    case 'sails':
        this.copy('_bower.json', 'bower.json');
        this.directory('sails', './');
        break;
    }
};

WdjAppGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('_README.md', 'README.md');
    this.copy('gitignore', '.gitignore');
    this.copy('_travis.yml', '.travis.yml');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
