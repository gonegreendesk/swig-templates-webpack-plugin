const fs = require('fs')
const glob = require('glob')
const beautify = require('js-beautify').html
const uglify = require('html-minifier')
const swig = require('swig-templates')
let swigOptions = {
  cache: false,
}

function SwigWebpackPlugin(options) {
  this.options = options || {}
  this.options.sds = 's'
}

SwigWebpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.emit.tap('SwigPlugin', (compiler, callback) => {
    const webpackStatsJson = compiler.getStats().toJson()
    let templateParams = {}
    templateParams.webpack = webpackStatsJson
    templateParams.swigWebpackPlugin = {}
    templateParams.swigWebpackPlugin.assets = this.swigWebpackPluginAssets(
      compiler,
      webpackStatsJson
    )
    templateParams.swigWebpackPlugin.options = this.options
    templateParams.locals = this.options.data || null

    const outputFilename = this.options.filename
    const context = this.context

    const templateFile = this.options.template
    const templateContext = context

    const files = glob.sync(templateFile, {
      root: templateContext,
      realpath: true,
    })
    if (files.length > 0) {
      files.forEach((template) => {
        const data = fs.readFileSync(template, 'utf8')
        if (data) {
          this.emitHtml(compiler, template, templateParams, outputFilename)
        } else {
          compiler.errors.push(
            new Error(
              'SwigWebpackPlugin: Unable to read HTML template "' +
                template +
                '"'
            )
          )
        }
      })
    } else {
      compiler.errors.push(new Error('SwigWebpackPlugin: Unable to read files'))
    }
    return true
    //callback()
  })
}

SwigWebpackPlugin.prototype.emitHtml = function (
  compiler,
  htmlTemplateFile,
  templateParams,
  outputFilename
) {
  swig.setDefaults(swigOptions)

  const template = swig.compileFile(htmlTemplateFile, templateParams)

  let html = template(templateParams)
  html = this.htmlFormatter(templateParams.swigWebpackPlugin.options, html)
  compiler.assets[outputFilename] = {
    source: () => {
      return html
    },
    size: () => {
      return html.length
    },
  }
}

SwigWebpackPlugin.prototype.htmlFormatter = function (options, html) {
  if (options.beautify) {
    return beautify(html, {
      indentSize: 2,
    })
  } else if (options.uglify) {
    return uglify.minify(String(html), {
      collapseWhitespace: true,
    })
  } else {
    return html
  }
}

SwigWebpackPlugin.prototype.swigWebpackPluginAssets = function (
  compiler,
  webpackStatsJson
) {
  let assets = {
    extensions: {},
  }

  for (const chunk in webpackStatsJson.assetsByChunkName) {
    let chunkFiles = []
      .concat(webpackStatsJson.assetsByChunkName[chunk])
      .map((fileName) => {
        if (compiler.options.output.publicPath) {
          return compiler.options.output.publicPath + fileName
        }

        return fileName
      })

    assets[chunk] = chunkFiles[0]

    chunkFiles.forEach((chunkFile) => {
      const ext = chunkFile.split('.').pop()

      assets.extensions[ext] = assets.extensions[ext] || []
      assets.extensions[ext].push(chunkFile)
    })
  }

  return assets
}

module.exports = SwigWebpackPlugin
