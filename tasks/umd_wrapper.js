/*
 * grunt-umd-wrapper
 * https://github.com/bstefanescu/grunt-umd-wrapper
 *
 * Copyright (c) 2014 Bogdan Stefanescu
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

    function Module() {
        this.name = null;
        this.exports = null;
        this.imports = [];
        this.source = null;

        this.build = function(tpl, options) {
            var root = options.rootName;
            var rootPrefix = root+'.';
            var amd_req = [];
            var args = [];
            var cjs_args = [];
            var browser_args = [];
            var cjs_req = [];
            for (var i=0,len=this.imports.length; i<len; i++) {
                var imp = this.imports[i];
                if (imp.val) {
                    args.push(imp.val);
                    cjs_args.push("require('"+imp.key+"')");
                    browser_args.push(rootPrefix+imp.val);
                } else {
                    cjs_req.push("require('"+imp.key+"');");
                }
                amd_req.push("'"+imp.key+"'");          
            }

            var src = this.source;
            var map = {
                ARGS: args.join(', '),
                CJS_ARGS: cjs_args.join(', '),
                BROWSER_ARGS: browser_args.join(', '),
                AMD_REQUIRES: amd_req.join(', '),
                CJS_REQUIRES: cjs_req.join('\n'),
                EXPORT_NAME: this.exports,
                ROOT: root,
                SRC: src
            };

            return tpl.replace(/%([^%]+)%/g, function(m0, m1) {
                var v = map[m1];
                return v != null ? v : m0;
            });
        };
    }

    function ModuleProcessor() {

        function readFile(baseDir, filepath) {
            return grunt.file.read(path.join(baseDir, filepath));
        }

        this.loadModule = function(file) {
            var baseDir = path.dirname(file);
            var txt = grunt.file.read(file);
            var rx = /^[ \t]*@([a-z]+)\s+([^\r\n]+)$/mg;
            var req = [];
            var module = new Module();
            var out = txt.replace(rx, function(m0, m1, m2) {
                var token = m1;
                var value = m2.trim();
                if (token === 'import') {
                    var ar = value.split(/\s+as\s+/);
                    if (ar.length === 2) {
                        req.push({'key':ar[0], 'val':ar[1]});
                    } else {
                        req.push({'key':value, 'val':null});
                    }
                    return '';
                } else if (token === 'include') {
                    return readFile(baseDir, value);
                } else if (token === 'export') {
                    module.exports = value;
                    return '';
                } else if (token === 'module') {
                    module.name = value;
                    return '';
                } else { // ignore - log warn?
                    return m0;
                }
            });
            out = '\n'+out.trim()+'\n';
            
            module.source = out;
            module.imports = req;
            return module;
        };
        this.process = function(moduleFile, templateTxt, options) {
            return this.loadModule(moduleFile).build(templateTxt, options);
        };
    }


  grunt.registerMultiTask('umd_wrapper', 'Wrap your module using UMD based on jsdoc @requires annotations', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      template: 'umd',
      rootName: 'root'
    });

    var hasErrors = false;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
        // try first the builtin template
        var templatePath = options['template'];
        if (!grunt.file.isFile(templatePath)) {
            templatePath = path.join(__dirname, templatePath+'.template');
            if (!grunt.file.isFile(templatePath)) {
                grunt.fail("Could not find wrapper template: "+options['template']+".", 3);
            }            
        }
        var template = grunt.file.read(templatePath);
        var out = new ModuleProcessor(options).process(f.src, template, options);
        grunt.file.write(f.dest, out);  
        grunt.log.writeln('File "' + f.dest + '" created.');

    });

  });

  
};
