# Swig Templates Webpack Plugin

> **Note:** forked from [swig-webpack-plugin](https://github.com/jaylinski/swig-webpack-plugin).

This is a [webpack](http://webpack.github.io/) plugin that simplifies creation of HTML files to serve your
webpack bundles. This is especially useful for webpack bundles that include
a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you or supply
your own template (using [swig](https://github.com/paularmstrong/swig)).

## Installation

Install the plugin with npm:
```shell
$ npm install swig-templates-webpack-plugin --save-dev
```


## Basic Usage

The plugin will generate an HTML file for you that includes all your webpack
bundles in the body using `script` tags. Just add the plugin to your webpack
config as follows:

```javascript
var SwigWebpackPlugin = require('swig-templates-webpack-plugin')
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  plugins: [new SwigWebpackPlugin()]
}
```

This will generate a file `index.html` from the default template.

If you have multiple webpack entry points, they will all be included with `script`
tags in the generated HTML.


## Configuration

You can pass a hash of configuration options to `HtmlWebpackPlugin`.
Allowed values are as follows:

- `beautify`: Beautify the HTML.
- `uglify`: Uglify the HTML.
- `filename`: The file to write the HTML to. Defaults to `index.html`.
   You can specify a subdirectory here too (eg: `src/admin.html`).
- `data`: Any data you want to pass to your swig templates. It will be available as {{data.myvariable}} in your templates.

Here's an example webpack config illustrating how to use these options:
```javascript
{
  plugins: [
    new SwigWebpackPlugin({
      filename: 'src/myfile.swig',
      template: 'myfile.html',
      beautify: true,
      data: {
      	myvariable: 'myvalue'
      }
    })
  ]
}
```

## Generating Multiple HTML Files

To generate more than one HTML file, declare the plugin more than
once in your plugins array:
```javascript
{
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  plugins: [    
    new SwigWebpackPlugin({  // Also generate a test.html
      filename: 'test.html',
      template: 'src/test.swig'
    }),
    new SwigWebpackPlugin({  // Also generate a test.html
      filename: 'another.html',
      template: 'src/another.swig'
    })
  ]
}
```

