// version-checker.js
// =================
const storage = require('node-persist');
const cheerio = require("cheerio");
const request = require("request");
var exec = require('child_process').exec;
var path = require('path');

const settings = require("../common/awacs-settings.json");


initStorage();

let stableVersionFromSite = null;
let openbetaVersionFromSite = null;
var latestVersionCallback = null;

module.exports = {
    GetLatestVersions: async function(callback) {

        latestVersionCallback = callback;

        request({
                uri: settings.dcsVersionEndpoint,
            },await requestCallback);
    }
};

async function initStorage() {
    var parentDir = path.resolve(process.cwd());
    await storage.init({
        dir: parentDir+"/persist/"
    });
}

async function requestCallback(error, response, body) {
    if (error === null && response.statusCode===200 && body!==null) {

        var site = cheerio.load(body);

        var stableFromSite = site("h2:contains('stable')");
        var openbetaFromSite = site("h2:contains('openbeta')");

        var stableFromSiteSplit = stableFromSite.html().split(' ').pop();
        var openbetaFromSiteSplit = openbetaFromSite.html().split(' ').pop();

//        console.log(stableFromSiteSplit);
//        console.log(openbetaFromSiteSplit);

        var lastStableFromStorage = await storage.getItem("lastStableVersion");
        var lastOpenbetaFromStorage = await storage.getItem("lastOpenbetaVersion");

        if (lastStableFromStorage === undefined || lastStableFromStorage !== stableFromSiteSplit) {

            await storage.setItem("lastStableVersion", stableFromSiteSplit);
            stableVersionFromSite = stableFromSiteSplit;
            console.log("New stable version: "+stableFromSiteSplit);
        }
        if (lastOpenbetaFromStorage === undefined || lastOpenbetaFromStorage !== openbetaFromSiteSplit) {

            await storage.setItem("lastOpenbetaVersion", openbetaFromSiteSplit);
            openbetaVersionFromSite = openbetaFromSiteSplit;
            console.log("New OpenBeta version: "+openbetaFromSiteSplit);
        }

        if (latestVersionCallback && typeof latestVersionCallback==='function') {

            latestVersionCallback(stableVersionFromSite, openbetaVersionFromSite);
        }
        
        stableVersionFromSite = null;
        openbetaVersionFromSite = null;
    }
}