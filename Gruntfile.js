module.exports = function (grunt) {
    // 配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //合并css/js文件
        concat: {
            options: {
                separator: '\n'
            },
            basic: {
                files: {
                    'build/seed.js': ['src/seed/src/singer.js', 'src/seed/src/lang/*.js', 'src/seed/src/*.js', 'src/seed/src/loader/*.js']
                }
            }
        },
        //js压缩
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> version:<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
            },
            seed: {
                src: ['src/seed/src/singer.js', 'src/seed/src/lang/*.js', 'src/seed/src/*.js', 'src/seed/src/loader/*.js'],
                dest: 'build/seed.min.js'
            }
//            ,list: {
//                files: [
//                    {
//                        expand: true,
//                        cwd: 'plugs',
//                        src: '*.js',
//                        dest: 'build/plugs',
//                        ext: '.min.js'
//                    }
//                ]
//            }
        },
        //css压缩
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */'
            },
            combine: {
                files: [
                    {
                        expand: true,
                        cwd: 'demo/css',
                        src: '*.css',
                        dest: 'build/css',
                        ext: '.min.css'
                    }
                ]
            }
        },
        //文件监视 执行命令 grunt watch
        watch: {
            js: {
                files: ['plugs/*.js', 'src/seed/src/*.js'],
                tasks: ['concat', 'uglify']
            },
            css: {
                files: ['demo/css/*.css'],
                tasks: ['cssmin']
            }
        }
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // 注册任务
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
}; 