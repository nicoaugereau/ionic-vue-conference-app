/**
 * https://github.com/TheBrainFamily/cypress-cucumber-preprocessor/issues/251
 */
//const report = require('multiple-cucumber-html-reporter')
const fs = require('fs-extra')
const path = require('path')

const cucumberJsonDir = path.resolve(process.cwd(), 'reports/cucumber/') //'./cypress/test-results/cucumber-json'
const cucumberReportFileMap = {}
const cucumberReportMap = {}
const jsonIndentLevel = 2
//const htmlReportDir = path.resolve(process.cwd(), 'reports/cucumberreports') //'./cypress/test-results/cucumber-json'./src/cyreport/html'
const screenshotsDir = path.resolve(process.cwd(), 'cypress/screenshots/')

// getCucumberReportMaps()
// addScreenshots(cibuildid, cibuildidLink)

function getCucumberReportMaps() {
    filenames = fs.readdirSync(cucumberJsonDir)
    const files = fs.readdirSync(cucumberJsonDir).filter(file => {
        return file.indexOf('.json') > -1
    })
    files.forEach(file => {
        const json = JSON.parse(fs.readFileSync(path.join(cucumberJsonDir, file)))
        if (!json[0]) {
            return
        }
        const [feature] = json[0].uri.split('/').reverse()
        cucumberReportFileMap[feature] = file
        cucumberReportMap[feature] = json
    })
}

module.exports = function addScreenshots(cibuildid, cibuildidLink) {
    getCucumberReportMaps()
    if (fs.existsSync(screenshotsDir)) {
        //only if screenshots exists
        const prependPathSegment = pathSegment => location => path.join(pathSegment, location)
        const readdirPreserveRelativePath = location => fs.readdirSync(location).map(prependPathSegment(location))
        const readdirRecursive = location =>
            readdirPreserveRelativePath(location).reduce(
                (result, currentValue) => (fs.statSync(currentValue).isDirectory() ? result.concat(readdirRecursive(currentValue)) : result.concat(currentValue)),
                []
            )
        const screenshots = readdirRecursive(path.resolve(screenshotsDir)).filter(file => {
            //return file.indexOf('(failed).png') > -1
            return file.match(/^((?!.*--)(.*\(failed\).*)).*/g)
        })
        //const featuresList = Array.from(new Set(screenshots.map(x => x.match(/[\w-_.]+.feature/g)[0])))
        const featuresList = Array.from(new Set(screenshots.map(x => x.match(/([^\/.*\\]+)\.feature/g)[0])))
        featuresList.forEach(feature => {
            /**
             * Modifications apportées au code original
             */
            //screenshots.forEach(screenshot => {
            /**
             * Method 1
             */
            //const regex = /(?<=--\ ).+?((?=\ \(example\ #\d+\))|(?=\ \(failed\))|(?=\.\w{3}))/g
            // const [scenarioName] = screenshot.match(regex)
            // const myScenarios = cucumberReportMap[feature][0].elements.filter(e => scenarioName.includes(e.name))
            /**
             * Method 2
             */
            // var filename = screenshot.replace(/^.*[\\\/]/, '')
            // const featureSelected = cucumberReportMap[feature][0]
            // let myScenarios = []
            // cucumberReportMap[feature][0].elements.forEach(item => {
            //     let fullFileName = featureSelected.name + ' -- ' + item.name
            //     if (filename.includes(fullFileName)) {
            //         myScenarios.push(item)
            //     }
            // })
            /**
             * Method 3
             */
            //const regex = 'failedTest'
            // match (failed) mais pas --
            // const regex = /^((?!.*--)(.*\(failed\).*)).*/g
            // //const regex = /([^\/]+)(?=\.\w+$)/g
            // const [scenarioName] = screenshot.match(regex)
            // const myScenarios = cucumberReportMap[feature][0].elements.filter(e => scenarioName)
            const myScenarios = cucumberReportMap[feature][0].elements

            // if (!myScenarios) {
            //     return
            // }
            let foundFailedStep = false
            myScenarios.forEach(myScenario => {
                if (foundFailedStep) {
                    return
                }
                let myStep
                myStep = myScenario.steps.find(step => step.result.status === 'failed')
                if (!myStep) {
                    return
                }

                screenshots.forEach(screenshot => {
                    if (screenshot.includes(feature)) {
                        if (cibuildid != null) {
                            if (!myStep.embeddings) {
                                myStep.embeddings = []
                                screenshot = screenshot.replace(/\\/g, '/')
                                myStep.embeddings.push({ data: '<img src="' + cibuildidLink + screenshot.split('/').slice(6).join('/') + '" >', mime_type: 'text/html' }) // Chemin vers l'image plutot que base64 (cause Jenkins security policy)
                                foundFailedStep = true
                            }
                        } else {
                            const cucumberData = fs.readFileSync(path.resolve(screenshot))
                            if (cucumberData) {
                                const base64Image = Buffer.from(cucumberData, 'binary').toString('base64')
                                if (!myStep.embeddings) {
                                    myStep.embeddings = []
                                    myStep.embeddings.push({ data: base64Image, mime_type: 'image/png' })
                                    foundFailedStep = true
                                }
                            }
                        }
                    }
                })
            })
            //Write JSON with screenshot back to report file.
            fs.writeFileSync(path.join(cucumberJsonDir, cucumberReportFileMap[feature]), JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel))
            //})
        })
    }
}
