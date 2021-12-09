const mocha = require('mocha')
const marge = require('mochawesome')

const Mochawesome = marge.Mochawesome
const XUnit = mocha.reporters.XUnit

function MochaMultipleReporters(runner, options) {
    Base.call(this, runner, options)
    this._xunitReporter = new XUnit(runner, options )
    this._mochawsomeReporter = new Mochawesome(runner, options)
    return this
}

MochaMultipleReporters.prototype.__proto__ = Base.prototype

module.exports = MochaMultipleReporters
