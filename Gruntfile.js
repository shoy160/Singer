module.exports = function(grunt) {
    // ����
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
		//�ϲ�css/js�ļ�
        concat : {
			options:{
				separator: ';'
			},
            basic : {
                files:{
					'gaga/tjkx.js':['js/slider.js', 'js/jquery.pin.js']
				}
            }
        },
		//jsѹ��
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
            },
			js:{
				files:{
					'gaga/slider.min.js':['js/slider.js'],
					'gaga/jquery.pin.min.js':['js/jquery.pin.js'],
					'gaga/base-v1.js':['js/base-v1.js'],
                    'gaga/common.js':['js/common.js'],
                    'gaga/page-corp.js':['js/page-corp.js'],
                    'gaga/page-list.js':['js/page-list.js'],
                    'gaga/page-product.js':['js/page-product.js'],
                    'gaga/cloudzoom.js':['js/cloudzoom.js'],
                    'gaga/page-prods.js':['js/page-prods.js']
				}
			}
        },
        //cssѹ��
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */'
            },
            combine: {
                files: {
                    'gaga/page-prods.css': ['css/page-prods.css']
                }
            }
        },
		//�ļ����� ִ������ grunt watch
		watch:{
			js:{
				files:['js/slider.js','js/jquery.pin.js'],
				tasks:['concat','uglify']
			}
		}
    });
    // ����concat��uglify������ֱ���ںϲ���ѹ��
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
    // ע������
    grunt.registerTask('default', ['concat','uglify','cssmin']);
}; 