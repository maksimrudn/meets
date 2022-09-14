module.exports = function(grunt) {
    const sass = require('node-sass');

    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
                sourceMap: false,
                includePaths: ["node_modules/bootstrap-sass/assets/stylesheets"],
            },
            dist: {
                options: {
                outputStyle: "compressed",
                },
                files: [
                    {
                        "../../EventSystem/wwwroot/assets/css/eventsystem.style.min.css":             [ "scss/main.scss"],   
                        "../../EventSystem/ClientApp/src/assets/css/eventsystem.style.min.css":             [ "scss/main.scss"],   
                    },
                ],
            },
        },
        uglify: {
            my_target: {
                files: {
                    "dist/assets/bundles/libscripts.bundle.js": [ "node_modules/jquery/dist/jquery.js", "node_modules/bootstrap/dist/js/bootstrap.bundle.js"],
                    "dist/assets/bundles/apexcharts.bundle.js": [ "node_modules/apexcharts/dist/apexcharts.min.js"],
                    "dist/assets/bundles/sparkline.bundle.js":  [ "node_modules/jquery-sparkline/jquery.sparkline.min.js"],
                    "dist/assets/bundles/dataTables.bundle.js": [ "dist/assets/plugin/datatables/jquery.dataTables.min.js", "dist/assets/plugin/datatables/dataTables.bootstrap5.min.js","dist/assets/plugin/datatables/dataTables.responsive.min.js"],
                    "dist/assets/bundles/nestable.bundle.js": [ "dist/assets/plugin/nestable/jquery.nestable.js"],
                },
            },
        },
    });

    // пример регистрации команды grunt qwer
    // grunt.registerTask("qwer", function(){
    //     console.log('asdf');
    // });

    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask("buildcss", ["sass"]);	
    grunt.registerTask("buildjs", ["uglify"]);
};