module.exports = function (grunt) {
    grunt.config.set('htmlmin', {
        options: {
            collapseWhitespace: true
        },
        dist: {
            files: [{
                expand: true,
                cwd: '<%= paths.dist %>',
                src: ['*.html', 'elements/*.html'],
                dest: '<%= paths.dist %>'
            }]
        }
    });
};
