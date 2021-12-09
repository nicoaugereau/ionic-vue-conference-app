'use strict'

const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs-extra')
const jsonFile = require('jsonfile')
const open = require('open')
const path = require('path')
const moment = require('moment')
const collectJSONS = require('./collect-jsons')

const INDEX_HTML = 'index.html'
const FEATURES_OVERVIEW_INDEX_TEMPLATE = 'index.tmpl'
const CUSTOM_DATA_TEMPLATE = 'components/custom-data.tmpl'
const FEATURES_OVERVIEW_CHART_TEMPLATE = 'components/features-overview.chart.tmpl'

const RESULT_STATUS = {
    passed: 'passed',
    failed: 'failed',
    skipped: 'skipped',
    pending: 'pending',
    notDefined: 'undefined',
    ambiguous: 'ambiguous'
}
const DEFAULT_REPORT_NAME = 'Cucumber Reporter'

function generateReport(options) {
    if (!options) {
        throw new Error('Options need to be provided.')
    }

    if (!options.jsonDir) {
        throw new Error('A path which holds the JSON files should be provided.')
    }

    if (!options.reportPath) {
        throw new Error('An output path for the reports should be defined, no path was provided.')
    }

    const customMetadata = options.customMetadata || false
    const customData = options.customData || null
    const disableLog = options.disableLog
    const openReportInBrowser = options.openReportInBrowser
    const reportName = options.reportName || DEFAULT_REPORT_NAME
    const reportPath = path.resolve(process.cwd(), options.reportPath)
    const saveCollectedJSON = options.saveCollectedJSON
    const saveRunInfos = options.saveRunInfos
    const displayDuration = options.displayDuration || false
    const displayReportTime = options.displayReportTime || false
    const durationInMS = options.durationInMS || false
    const hideMetadata = options.hideMetadata || false
    const pageTitle = options.pageTitle || 'Cucumber Reporter'
    const pageFooter = options.pageFooter || false

    fs.ensureDirSync(reportPath)

    const allFeatures = collectJSONS(options)

    let suite = {
        app: 0,
        customMetadata: customMetadata,
        customData: customData,
        hideMetadata: hideMetadata,
        displayReportTime: displayReportTime,
        displayDuration: displayDuration,
        browser: 0,
        name: '',
        version: 'version',
        time: new Date(),
        features: allFeatures,
        featureCount: {
            ambiguous: 0,
            failed: 0,
            passed: 0,
            notDefined: 0,
            pending: 0,
            skipped: 0,
            total: 0,
            ambiguousPercentage: 0,
            failedPercentage: 0,
            notdefinedPercentage: 0,
            pendingPercentage: 0,
            skippedPercentage: 0,
            passedPercentage: 0
        },
        graph: '#2cd860 0, #2cd860 100',
        reportName: reportName,
        scenarios: {
            failed: 0,
            ambiguous: 0,
            notDefined: 0,
            pending: 0,
            skipped: 0,
            passed: 0,
            total: 0
        },
        steps: {
            failed: 0,
            ambiguous: 0,
            notDefined: 0,
            pending: 0,
            skipped: 0,
            passed: 0,
            total: 0
        },
        totalTime: 0
    }

    _parseFeatures(suite)

    // Percentages
    suite.featureCount.ambiguousPercentage = _calculatePercentage(suite.featureCount.ambiguous, suite.featureCount.total)
    suite.featureCount.failedPercentage = _calculatePercentage(suite.featureCount.failed, suite.featureCount.total)
    suite.featureCount.notdefinedPercentage = _calculatePercentage(suite.featureCount.notDefined, suite.featureCount.total)
    suite.featureCount.pendingPercentage = _calculatePercentage(suite.featureCount.pending, suite.featureCount.total)
    suite.featureCount.skippedPercentage = _calculatePercentage(suite.featureCount.skipped, suite.featureCount.total)
    suite.featureCount.passedPercentage = _calculatePercentage(suite.featureCount.passed, suite.featureCount.total)

    // Graph
    let graphPassed = Number(parseFloat(suite.featureCount.passedPercentage))
    let graphFailed = Number(parseFloat(suite.featureCount.passedPercentage)) + Number(parseFloat(suite.featureCount.failedPercentage))
    let graphPending =
        Number(parseFloat(suite.featureCount.passedPercentage)) + Number(parseFloat(suite.featureCount.failedPercentage)) + Number(parseFloat(suite.featureCount.pendingPercentage))
    let graphSkipped =
        Number(parseFloat(suite.featureCount.passedPercentage)) +
        Number(parseFloat(suite.featureCount.failedPercentage)) +
        Number(parseFloat(suite.featureCount.pendingPercentage)) +
        Number(parseFloat(suite.featureCount.skippedPercentage))
    let graphNotDefined =
        Number(parseFloat(suite.featureCount.passedPercentage)) +
        Number(parseFloat(suite.featureCount.failedPercentage)) +
        Number(parseFloat(suite.featureCount.pendingPercentage)) +
        Number(parseFloat(suite.featureCount.skippedPercentage)) +
        Number(parseFloat(suite.featureCount.notdefinedPercentage))
    suite.graph = `#26b526 0, #26b526 ${graphPassed}%,#fa0f36 0,#fa0f36 ${graphFailed}%,#666 0, #666 ${graphSkipped}%,#99ddff 0, #99ddff ${graphPending}%, #cc00cc 0, #cc00cc ${graphNotDefined}%`

    /**
     * Calculate and return the percentage
     * @param {number} amount
     * @param {number} total
     * @return {string} percentage
     * @private
     */
    function _calculatePercentage(amount, total) {
        return ((amount / total) * 100).toFixed(2)
    }

    /* istanbul ignore else */
    if (saveCollectedJSON) {
        jsonFile.writeFileSync(path.resolve(reportPath, 'enriched-output.json'), suite, { spaces: 2 })
    }
    if (saveRunInfos) {
        let runInfos = {
            app: suite.app,
            customMetadata: suite.customMetadata,
            customData: suite.customData,
            displayReportTime: suite.displayReportTime,
            displayDuration: suite.displayDuration,
            browser: suite.browser,
            time: suite.time,
            featureCount: suite.featureCount,
            reportName: suite.reportName,
            scenarios: suite.scenarios,
            steps: suite.steps,
            totalTime: suite.totalTime
        }
        jsonFile.writeFileSync(path.resolve(reportPath, 'report.json'), runInfos, { spaces: 2 })
    }

    _createFeaturesOverviewIndexPage(suite)

    /* istanbul ignore else */
    if (!disableLog) {
        console.log(
            chalk.blue(`\n
=====================================================================================
    Cucumber report generated in:

    ${path.join(reportPath, INDEX_HTML)}
=====================================================================================\n`)
        )
    }

    /* istanbul ignore if */
    if (openReportInBrowser) {
        open(path.join(reportPath, INDEX_HTML))
    }

    function _parseFeatures(suite) {
        suite.features.forEach(feature => {
            feature.scenarios = {
                passed: 0,
                failed: 0,
                notDefined: 0,
                skipped: 0,
                pending: 0,
                ambiguous: 0,
                passedPercentage: 0,
                failedPercentage: 0,
                notdefinedPercentage: 0,
                skippedPercentage: 0,
                pendingPercentage: 0,
                ambiguousPercentage: 0,
                total: 0
            }
            feature.duration = 0
            feature.time = '00:00:00.000'
            feature.isFailed = false
            feature.isAmbiguous = false
            feature.isSkipped = false
            feature.isNotdefined = false
            feature.isPending = false
            suite.featureCount.total++
            feature.app = 0
            feature.browser = 0

            if (!feature.elements) {
                return
            }

            feature = _parseScenarios(feature, suite)

            if (feature.isFailed) {
                suite.featureCount.failed++
                feature.failed++
            } else if (feature.isAmbiguous) {
                suite.featureCount.ambiguous++
                feature.ambiguous++
            } else if (feature.isNotdefined) {
                feature.notDefined++
                suite.featureCount.notDefined++
            } else if (feature.isPending) {
                feature.pending++
                suite.featureCount.pending++
            } else if (feature.isSkipped) {
                feature.skipped++
                suite.featureCount.skipped++
            } else {
                feature.passed++
                suite.featureCount.passed++
            }

            if (feature.duration) {
                feature.totalTime += feature.duration
                feature.time = formatDuration(feature.duration)
            }

            // Check if browser / app is used
            suite.app = feature.metadata.app ? suite.app + 1 : suite.app
            suite.browser = feature.metadata.browser ? suite.browser + 1 : suite.browser

            // Percentages
            feature.scenarios.ambiguousPercentage = _calculatePercentage(feature.scenarios.ambiguous, feature.scenarios.total) // arbitré
            feature.scenarios.failedPercentage = _calculatePercentage(feature.scenarios.failed, feature.scenarios.total)
            feature.scenarios.notdefinedPercentage = _calculatePercentage(feature.scenarios.notDefined, feature.scenarios.total) // exemple : step implementation missing
            feature.scenarios.passedPercentage = _calculatePercentage(feature.scenarios.passed, feature.scenarios.total)
            feature.scenarios.pendingPercentage = _calculatePercentage(feature.scenarios.pending, feature.scenarios.total) // ?
            feature.scenarios.skippedPercentage = _calculatePercentage(feature.scenarios.skipped, feature.scenarios.total) // à considérer comme pending
            suite.scenarios.ambiguousPercentage = _calculatePercentage(suite.scenarios.ambiguous, suite.scenarios.total)
            suite.scenarios.failedPercentage = _calculatePercentage(suite.scenarios.failed, suite.scenarios.total)
            suite.scenarios.notdefinedPercentage = _calculatePercentage(suite.scenarios.notDefined, suite.scenarios.total)
            suite.scenarios.passedPercentage = _calculatePercentage(suite.scenarios.passed, suite.scenarios.total)
            suite.scenarios.pendingPercentage = _calculatePercentage(suite.scenarios.pending, suite.scenarios.total)
            suite.scenarios.skippedPercentage = _calculatePercentage(suite.scenarios.skipped, suite.scenarios.total)
            // manque bloqué
        })
    }

    /**
     * Parse each scenario within a feature
     * @param {object} feature a feature with all the scenarios in it
     * @return {object} return the parsed feature
     * @private
     */
    function _parseScenarios(feature) {
        feature.elements.forEach(scenario => {
            scenario.passed = 0
            scenario.failed = 0
            scenario.notDefined = 0
            scenario.skipped = 0
            scenario.pending = 0
            scenario.ambiguous = 0
            scenario.duration = 0
            scenario.time = '00:00:00.000'

            scenario = _parseSteps(scenario)

            if (scenario.duration > 0) {
                feature.duration += scenario.duration
                scenario.time = formatDuration(scenario.duration)
            }

            if (scenario.hasOwnProperty('description') && scenario.description) {
                scenario.description = scenario.description.replace(new RegExp('\r?\n', 'g'), '<br />')
            }

            if (scenario.failed > 0) {
                suite.scenarios.total++
                suite.scenarios.failed++
                feature.scenarios.total++
                feature.isFailed = true
                return feature.scenarios.failed++
            }

            if (scenario.ambiguous > 0) {
                suite.scenarios.total++
                suite.scenarios.ambiguous++
                feature.scenarios.total++
                feature.isAmbiguous = true
                return feature.scenarios.ambiguous++
            }

            if (scenario.notDefined > 0) {
                suite.scenarios.total++
                suite.scenarios.notDefined++
                feature.scenarios.total++
                feature.isNotdefined = true
                return feature.scenarios.notDefined++
            }

            if (scenario.pending > 0) {
                suite.scenarios.total++
                suite.scenarios.pending++
                feature.scenarios.total++
                feature.isPending = true
                return feature.scenarios.pending++
            }

            if (scenario.skipped > 0) {
                suite.scenarios.total++
                suite.scenarios.skipped++
                feature.scenarios.total++
                return feature.scenarios.skipped++
            }

            /* istanbul ignore else */
            if (scenario.passed > 0) {
                suite.scenarios.total++
                suite.scenarios.passed++
                feature.scenarios.total++
                return feature.scenarios.passed++
            }
        })

        feature.isSkipped = feature.scenarios.total === feature.scenarios.skipped

        return feature
    }

    /**
     * Parse all the scenario steps and enrich them with the correct data
     * @param {object} scenario Preparsed scenario
     * @return {object} A parsed scenario
     * @private
     */
    function _parseSteps(scenario) {
        scenario.steps.forEach(step => {
            step.passed = 0
            step.failed = 0
            step.notDefined = 0
            step.skipped = 0
            step.pending = 0
            step.ambiguous = 0
            step.duration = 0
            step.time = '00:00:00.000'
            scenario.isFailed = false
            scenario.isAmbiguous = false
            scenario.isSkipped = false
            scenario.isNotdefined = false
            scenario.isPending = false
            if (step.embeddings !== undefined) {
                const Base64 = require('js-base64').Base64

                step.attachments = []
                step.embeddings.forEach((embedding, embeddingIndex) => {
                    /* istanbul ignore else */
                    if (embedding.mime_type === 'application/json' || (embedding.media && embedding.media.type === 'application/json')) {
                        step.json = (step.json ? step.json : []).concat([typeof embedding.data === 'string' ? JSON.parse(embedding.data) : embedding.data])
                    } else if (embedding.mime_type === 'text/html' || (embedding.media && embedding.media.type === 'text/html')) {
                        step.html = (step.html ? step.html : []).concat([_isBase64(embedding.data) ? Base64.decode(embedding.data) : embedding.data])
                    } else if (embedding.mime_type === 'text/plain' || (embedding.media && embedding.media.type === 'text/plain')) {
                        step.text = (step.text ? step.text : []).concat([_isBase64(embedding.data) ? _escapeHtml(Base64.decode(embedding.data)) : _escapeHtml(embedding.data)])
                    } else if (embedding.mime_type === 'image/png' || (embedding.media && embedding.media.type === 'image/png')) {
                        step.image = (step.image ? step.image : []).concat(['data:image/png;base64,' + embedding.data])
                        step.embeddings[embeddingIndex] = {}
                    } else {
                        let embeddingtype = 'text/plain'
                        if (embedding.mime_type) {
                            embeddingtype = embedding.mime_type
                        } else if (embedding.media && embedding.media.type) {
                            embeddingtype = embedding.media.type
                        }
                        step.attachments.push({
                            data: 'data:' + embeddingtype + ';base64,' + embedding.data,
                            type: embeddingtype
                        })
                        step.embeddings[embeddingIndex] = {}
                    }
                })
            }

            if (step.doc_string !== undefined) {
                step.restWireData = step.doc_string.value.split(/[>]/).join('').replace(new RegExp('\r?\n', 'g'), '<br />').split('response')
            }

            if (
                !step.result ||
                // Don't log steps that don't have a text/hidden/images/attachments unless they are failed.
                // This is for the hooks
                (step.hidden && !step.text && !step.image && _.size(step.attachments) === 0 && step.result.status !== RESULT_STATUS.failed)
            ) {
                return 0
            }

            if (step.result.duration) {
                scenario.duration += step.result.duration
                step.time = formatDuration(step.result.duration)
            }

            if (step.result.status === RESULT_STATUS.passed) {
                suite.steps.total++
                suite.steps.passed++
                return scenario.passed++
            }

            if (step.result.status === RESULT_STATUS.failed) {
                suite.steps.total++
                suite.steps.failed++
                scenario.isFailed = true
                return scenario.failed++
            }

            if (step.result.status === RESULT_STATUS.notDefined) {
                suite.steps.total++
                suite.steps.notDefined++
                scenario.isNotdefined = true
                return scenario.notDefined++
            }

            if (step.result.status === RESULT_STATUS.pending) {
                suite.steps.total++
                suite.steps.pending++
                scenario.isPending = true
                return scenario.pending++
            }

            if (step.result.status === RESULT_STATUS.ambiguous) {
                suite.steps.total++
                suite.steps.ambiguous++
                scenario.isAmbiguous = true
                return scenario.ambiguous++
            }

            if (step.result.status === RESULT_STATUS.skipped) {
                suite.steps.total++
                suite.steps.skipped++
                scenario.isSkipped = true
                return scenario.skipped++
            }

            //scenario.skipped++;
        })

        return scenario
    }

    /**
     * Read a template file and return it's content
     * @param {string} fileName
     * @return {*} Content of the file
     * @private
     */
    function _readTemplateFile(fileName) {
        if (fileName) {
            try {
                fs.accessSync(fileName, fs.constants.R_OK)
                return fs.readFileSync(fileName, 'utf-8')
            } catch (err) {
                return fs.readFileSync(path.join(__dirname, '..', 'templates', fileName), 'utf-8')
            }
        } else {
            return ''
        }
    }

    /**
     * Check if the string a base64 string
     * @param string
     * @return {boolean}
     * @private
     */
    function _isBase64(string) {
        const notBase64 = /[^A-Z0-9+\/=]/i
        const stringLength = string.length

        if (!stringLength || stringLength % 4 !== 0 || notBase64.test(string)) {
            return false
        }

        const firstPaddingChar = string.indexOf('=')

        return firstPaddingChar === -1 || firstPaddingChar === stringLength - 1 || (firstPaddingChar === stringLength - 2 && string[stringLength - 1] === '=')
    }

    /**
     * Escape html in string
     * @param string
     * @return {string}
     * @private
     */
    function _escapeHtml(string) {
        return typeof string === 'string' || string instanceof String ? string.replace(/</g, '&lt;').replace(/>/g, '&gt;') : string
    }

    /**
     * Generate the features overview
     * @param {object} suite JSON object with all the features and scenarios
     * @private
     */
    function _createFeaturesOverviewIndexPage(suite) {
        const featuresOverviewIndex = path.resolve(reportPath, INDEX_HTML)

        fs.writeFileSync(
            featuresOverviewIndex,
            _.template(_readTemplateFile(FEATURES_OVERVIEW_INDEX_TEMPLATE))({
                suite: suite,
                customDataOverview: _.template(_readTemplateFile(CUSTOM_DATA_TEMPLATE))({
                    suite: suite,
                    _: _
                }),
                featuresOverviewChart: _.template(_readTemplateFile(FEATURES_OVERVIEW_CHART_TEMPLATE))({
                    suite: suite,
                    _: _
                }),
                pageTitle: pageTitle,
                reportName: reportName,
                pageFooter: pageFooter
            })
        )
    }

    /**
     * Format the duration to HH:mm:ss.SSS
     *
     * @param {number} ns
     *
     * @return {string}
     */
    function formatDuration(ns) {
        // `moment.utc(#)` needs ms, we now use device by 1000000 to calculate ns to ms
        return moment.utc(durationInMS ? ns : ns / 1000000).format('HH:mm:ss.SSS')
    }
}

module.exports = {
    generate: generateReport
}
