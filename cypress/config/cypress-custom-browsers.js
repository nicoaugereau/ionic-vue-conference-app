/// <reference types="cypress" />

/**
 * Cypress customize browsers
 * https://docs.cypress.io/guides/guides/launching-browsers#Customize-available-browsers
 *
 * Browsers à déposer dans le répertoire racine du projet sesame-tests : ./browsers
 *
 */
const execa = require('execa')
const path = require('path')
const fs = require('fs')
const { platform } = require('os'),
    osType = platform()
let browserPath, newBrowser, fullVersion, majorVersion
let browsersList = (customList = winList = macList = linuxList = [])

/**
 * Find config file in the ./browsers folder
 */
const findConfigFile = () => {
    browserPath = path.join(__dirname, '../..', 'browsers', 'config.json')

    if (fs.existsSync(browserPath)) {
        customList = require(browserPath)
        return customList
    } else {
        return false
    }
}
/**
 * Find Windows browsers in the ./browsers folder
 * Add <fullVersion>.manifest file or empty folder with fullVersion in each browser folcer
 */
const winBrowsers = () => {
    browserPath = path.join(__dirname, '../..', 'browsers')

    const directoriesInDirectory = fs
        .readdirSync(browserPath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name)

    for (const element of directoriesInDirectory) {
        let dirCont = fs.readFileSync(`${browserPath}/${element}`)
        let files = dirCont.filter(function(elm) {
            //return elm.match(/.*\.manifest/gi)
            return elm.match(/(\d+\.\d+\.\d+\.\d+\.)/gi)
        })
        if (files.length > 0) {
            ;[, fullVersion] = /(\d+\.\d+\.\d+\.\d+\.)/.exec(files)
            majorVersion = parseInt(fullVersion.split('.'[0]))
        } else {
            fullVersion = '74.0.0.0'
            majorVersion = 74
        }

        exeName = element.toLowerCase() == 'chromium' ? 'chrome' : element
        newBrowser = {
            name: element,
            channel: 'stabble',
            family: 'chromium',
            displayName: element,
            version: fullVersion,
            path: `${browserPath}\\${element}\\${exeName}.exe`,
            majorVersion: majorVersion
        }
        winList = winList.concat(newBrowser)
    }
    return winList
}

/**
 * Find MacOS browsers in the /Applications folder
 */
const macBrowsers = () => {
    // the path is hard-coded for simplicity
    //const browserPath = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
    macList = ['Brave Browser', 'Opera'] // Browsers not in the Cypress default list

    for (const element of macList) {
        browserPath = `/Applications/${element}.app/Contents/MacOS/${element}`
        execa(browserPath, ['--version']).then(result => {
            // STDOUT will be like "Brave Browser 77.0.69.135"
            ;[, fullVersion] = /.*(\d+\.\d+\.\d+\.\d+)/.exec(result.stdout)
            majorVersion = parseInt(fullVersion.split('.')[0])

            newBrowser = {
                name: element,
                channel: 'stabble',
                family: 'chromium',
                displayName: element,
                version: fullVersion,
                path: browserPath,
                majorVersion: majorVersion
            }
            macList = macList.concat(newBrowser)
        })
        //browsersList = browsersList.concat(newBrowser)
    }
    return macList
}

/**
 * Find Linux browsers in the /usr.bin ?? folder
 */
const linuxBrowsers = () => {
    linuxList = ['brave-browser', 'opera'] // Browsers not in the Cypress default list

    const directoriesInDirectory = fs
        .readdirSync(browserPath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name)

    for (const element of linuxList) {
        browserPath = `/usr/bin/${element}`
        execa(browserPath, ['--version']).then(result => {
            // STDOUT will be like "Brave Browser 77.0.69.135"
            ;[, fullVersion] = /.*(\d+\.\d+\.\d+\.\d+)/.exec(result.stdout)
            majorVersion = parseInt(fullVersion.split('.')[0])

            newBrowser = {
                name: element,
                channel: 'stabble',
                family: 'chromium',
                displayName: element,
                version: fullVersion,
                path: browserPath,
                majorVersion: majorVersion
            }
            linuxList = linuxList.concat(newBrowser)
        })
    }
    return linuxList
}

function findBrowsers() {
    browserPath = path.join(__dirname, '../..', 'browsers')

    // browsers folder exists ?
    if (fs.existsSync(browserPath)) {
        // config.json exists ?
        findConfigFile()
        // which OS ?
        if (osType == 'win32') return (config.browsers = config.browsers.concat(customList, winBrowsers()))
        if (osType == 'darwin') {
            //return macBrowsers()
        }
        if (osType == 'linux') {
            //return linuxBrowsers()}
        }
    } else {
        return false
    }
}
console.log(findBrowsers())
// function addCustomBrowsers(config) {
//     findBrowser(config)
// }

// module.exports = addCustomBrowsers
