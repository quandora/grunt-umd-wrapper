# grunt-umd-wrapper

> Package your javascript modules into a UMD wrapper through preprocessing directives. 

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-umd-wrapper --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-umd-wrapper');
```

## The "umd_wrapper" task

### Overview
In your project's Gruntfile, add a section named `umd_wrapper` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  umd_wrapper: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.template
Type: `String`
Default value: `umd`

The template to use to generate the wrapper.

Here is the content of the default `umd` template:

```js
(function (%ROOT%, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([%AMD_REQUIRES%], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        %CJS_REQUIRES%
        module.exports = factory(%CJS_ARGS%);
    } else {
        // Browser globals (root is window)
        %ROOT%.%EXPORT_NAME% = factory(%BROWSER_ARGS%);
    }
}(this, function(%ARGS%) {
%SRC%
}));
```

#### options.rootName
Type: `String`
Default value: `root`

The name of the 'root' variable passed to the wrapper factory function as the first argument. 

You can find more information about this at https://github.com/umdjs/umd/blob/master/returnExports.js 


### Module definition file
A module is defined in a javascript file which contains some preprocessing tags that describes the module dependencies. 
The module file may return a variable to be exported.

Here is the list of available preprocessign tags:

* **@import**  - Define a requirement. If you need to use required module in your module source code you must specify the variable name that will be used to access the module using the `as` keyword. 
Example: `@import jquery as $`

* **@export**  - Define the name of the global variable which will be inserted into the `window` browser object (in the case of a browser global module definition).

* **@include** - Include the content of a javascript file in the main module file. File paths are relative to the module file. 

* **@html**    - assign html or css content to a variable specified using `as` keyword. The new lines, leading and trailing spaces fromt he html content will be removed. This can be usefull to insert HTML fragments into your javascript variables. File paths are relative to the module file. 
Example: `@html path/to/html/file as myHtml` will produce `var myHtml = "... html content ...";` 

* **@module**  - Define the name of the module. This is not used by the default wrapper template. 
You may need this directive if you change the template and you need the name of your module.


**Notes** 

1. Preprocessing directives must be used only in the main module file **and not** in included files.

2. If you doesn't specify an `@export` directive the module file name will be used (by removing tany `-module.js` or `.js` suffix)

3. You may not need to use any preprocessing directives if your module doesn't have dependencies. In this case an UMD wrapper with no dependencies will be generated.

4. Each directive must be written on its own line. You cannot write multiple directives on the same line. Also you cannpt mix directives and javascript code on the same line.

#### Example
```
@import jquery as $
@import jquery.ui
@export myModule

var myModuleApi = {};

@html fragment.html as html
@include part1.js
@include part2.js

return myModuleApi;
```

### Usage Examples

#### Default Options
In this example we build 2 modules using the default template. The modules are defined in the files src/my-module1.js and src/my-module2.js
which must use the preprocessing tags described above for specifying dependencies, included files etc,

```js
grunt.initConfig({
  umd_wrapper: {
    options: {},
    files: {
      'dest/my-module1.js': 'src/my-module1.js',
      'dest/my-module2.js': 'src/my-module2.js'
    }
  }
});
```

#### Custom Options
In this example, we build 1 module using a custom template. The custom template must be located in a file inside the current project.

```js
grunt.initConfig({
  umd_wrapper: {
    options: {
      template: 'path/to/template',
      rootName: 'this',
    }
    files: {
      'dest/my-module.js': 'src/my-module.js'
    }
  }
});
```

### Example
You can look at the example provided in the sources.
The module file is located in `test/fixtures/module.js`. 
Launch grunt to perform the test. 

The generated javascript file (in UMD format) will be put in `tmp` directory.  

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
