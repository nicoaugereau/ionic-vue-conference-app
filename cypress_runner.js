/**
 * Cypress runner
 *
 * Command : node ./cypress_runner.js <env> <browser> <device> <orientation> <spec>
 *
 * Pour les tests cucumber, préférer l'utilisation suivante (exemple exécution tests non Electron) :
 * npx cypress-tags run -e TAGS='not @isNotElectron' -e configFile=r2
 *
 * https://medium.com/cypress-io-thailand/generate-a-beautiful-test-report-from-running-tests-on-cypress-io-371c00d7865a
 */

const cypress = require('cypress')
const yargs = require('yargs')
const shell = require('shelljs')
const argv = yargs
    .scriptName('cypress_runner')
    .usage('Usage: $0 -a [application] -e [env] -b [browser] -s [spec] [option: testname]')
    .example('node ./cypress_runner.js -e local -b chrome -s js 2-e2e/local/conference/network.spec')
    .options({
        app: {
            alias: 'a',
            describe: 'Application à tester',
            default: 'conference',
            choices: ['conference']
        },
        env: {
            alias: 'e',
            describe: 'Environment',
            default: 'local',
            choices: ['local', 'internet']
        },
        browser: {
            alias: 'b',
            describe: 'Browser',
            default: 'electron',
            choices: ['chrome', 'electron', 'firefox', 'edge']
        },
        spec: {
            alias: 's',
            describe: 'js tests or feature',
            default: 'feature',
            choices: ['js', 'feature']
        },
        type: {
            alias: 't',
            describe: 'Visual regression : base = create screenshots ; actual = comparison',
            default: 'actual',
            choices: ['base', 'actual']
        }
    })
    .help().argv

// delete all existing report files
shell.rm('-rf', `reports/**/*.json`)
shell.rm('-rf', `reports/*.xml`)

var specs = argv._ != '' ? `cypress/e2e/${argv.app}/${argv.env}/${argv._}.${argv.spec}` : `cypress/e2e/${argv.app}/${argv.env}/**/*.${argv.spec}`
var cibuildid = argv['ci-build-id'] != null ? 'ci-build-id=' + argv['ci-build-id'] : ''
var regression = argv['type'] == 'base' ? 'type=base' : 'type=actual'
var envConfig = [cibuildid, regression]

//warnHack()

cypress
    .run({
        env: envConfig.filter(val => val).join(','),
        browser: argv.browser,
        spec: specs
    })
    .then(infos => {
        let status = infos.status == 'failed' ? 'File(s) not found' : generateReport({ infos: infos, spec: argv.spec, app: argv.app })
        return status
    })
    .catch(error => {
        console.error('errors: ', error)
        process.exit(1)
    })

function generateReport(options) {
    let { projects } = require('./project-infos.json')
    if (options.spec == 'js') {
        /**
         * Rapport des tests js
         */
        // mochawesome-merge & marge
        //shell.exec('npx mochawesome-merge reports/mocha/*.json > reports/mochareports/report.json')
        //shell.exec('npx marge reports/mochareports/report.json -f report -o reports/mochareports')
        // mocha-reporter
        const { merge } = require('./cypress/reporter/mocha')
        const mochaReportDir = `reports/mochareports`
        shell.mkdir('-p', mochaReportDir)
        var reportOptions = {}
        reportOptions = {
            files: ['./reports/mocha/*.json'],
            reportDir: mochaReportDir,
            infos: 'failedOnly',
            metadata: {
                browser: {
                    name: options.infos.browserName,
                    version: options.infos.browserVersion
                },
                platform: {
                    name: options.infos.osName,
                    version: options.infos.osVersion
                }
            },
            customData: {
                data: [{ label: 'Project', value: projects[options.app].name }, { label: 'Version', value: projects[options.app].version }]
            }
        }
        merge(reportOptions)
        //shell.exec('npx mocha-custom-reporter -f reports/mocha/*.json -r reports/mochareports -i failedOnly')
    } else {
        /**
         * Rapport des tests cucumber (feature)
         */
        function toLocalDateTime(datetime) {
            var dt = new Date(datetime),
                cdate = dt.getDate(),
                cmonth = dt.getMonth() + 1,
                cyear = dt.getFullYear(),
                chrs = dt.getHours(),
                cmins = dt.getMinutes(),
                csecs = dt.getSeconds(),
                fulldatetime
            var tz_offset_min = dt.getTimezoneOffset(),
                offset_hrs = parseInt(Math.abs(tz_offset_min / 60)),
                offset_min = Math.abs(tz_offset_min % 60),
                tz_standard

            // Add 0 before date, month, hrs, mins or secs if they are less than 0
            cdate = cdate < 10 ? '0' + cdate : cdate
            cmonth = cmonth < 10 ? '0' + cmonth : cmonth
            chrs = chrs < 10 ? '0' + chrs : chrs
            cmins = cmins < 10 ? '0' + cmins : cmins
            csecs = csecs < 10 ? '0' + csecs : csecs

            if (offset_hrs < 10) offset_hrs = '0' + offset_hrs
            if (offset_min < 10) offset_min = '0' + offset_min
            // Add an opposite sign to the offset
            // If offset is 0, it means timezone is UTC
            if (tz_offset_min < 0) tz_standard = '+' + offset_hrs + ':' + offset_min
            else if (tz_offset_min > 0) tz_standard = '-' + offset_hrs + ':' + offset_min
            else if (tz_offset_min == 0) tz_standard = 'Z'

            fulldatetime = `${cdate}-${cmonth}-${cyear} ${chrs}:${cmins}:${csecs} (GMT${tz_standard})`
            return fulldatetime
        }
        const htmlReportDir = `reports/cucumberreports`
        //shell.mkdir('-p', htmlReportDir)
        //const report = require('multiple-cucumber-html-reporter')
        const report = require('./cypress/reporter/cucumber')
        // Ajout les captures écrans au rapport
        const addScreenshots = require('./cucumber-report')
        // Pour les screenshots Jenkins si blocage affichage images base64
        // let cibuildidLink
        // if (cibuildid != null) {
        //     // Base URL du rapport de tests (hors workspace). Screenshots archivés par build
        //     cibuildidLink = `https://localhost:8080/job/burger-store/job/burger-store/job/master/${argv['ci-build-id']}/artifact/`
        // }
        // addScreenshots(argv['ci-build-id'], cibuildidLink)
        // Sinon ajout des captures écrans en base64
        addScreenshots()
        // const cucumber = require('./cucumber-report')
        // cucumber.getCucumberReportMaps()
        // cucumber.addScreenshots()
        let deviceName = 'Desktop'
        report.generate({
            jsonDir: './reports/cucumber/',
            saveRunInfos: true,
            reportPath: htmlReportDir,
            displayDuration: true,
            useCDN: false,
            pageTitle: 'Automated tests',
            reportName: `Automated tests report`,
            metadata: {
                browser: {
                    name: options.infos.browserName,
                    version: options.infos.browserVersion
                },
                device: deviceName,
                app: {
                    name: 'Docker cypress/included',
                    version: '10.1.0'
                },
                platform: {
                    name: options.infos.osName,
                    version: options.infos.osVersion
                }
            },
            customData: {
                title: 'Run infos',
                data: [
                    { label: 'Start', value: toLocalDateTime(options.infos.startedTestsAt) },
                    { label: 'End', value: toLocalDateTime(options.infos.endedTestsAt) },
                    { label: 'Project', value: projects[options.app].name },
                    { label: 'Version', value: projects[options.app].version }
                ]
            }
        })
    }
}
