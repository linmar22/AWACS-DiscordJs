'use strict';

const _ = require('lodash');

const { Client,RichEmbed } = require('discord.js');
const client = new Client();

var settings = require("./common/awacs-settings.json");
var versions = require("./dataaccess/version-checker.js");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(processVersionsInternal,300*1000);
});

client.login(settings.token);

function processVersionsInternal() {

    var callback = function(stableVersion, openbetaVersion) {

        console.log("stable = "+stableVersion);
        console.log("openbeta = " + openbetaVersion);

        if (stableVersion !== null) {

            _.each(settings.notificationChannelIds,
                function(channelId) {
                    var channel = client.channels.get(channelId);
                    if (channel !== undefined) {
                        var embed = new RichEmbed()
                            .setTitle("DCS World Updated")
                            .setColor(0x0000FF)
                            .setURL("https://forums.eagle.ru/showthread.php?t=214251")
                            .setDescription("DCS World Stable branch updated to " + stableVersion);
                        channel.send(embed);
                    }
                });
            //stableVersion changed
            //send message to notification channel
        }
        if (openbetaVersion !== null) {
            _.each(settings.notificationChannelIds,
                function(channelId) {
                    var channel = client.channels.get(channelId);
                    if (channel !== undefined) {
                        var embed = new RichEmbed()
                            .setTitle("DCS World Updated")
                            .setColor(0xFFFF00)
                            .setURL("https://forums.eagle.ru/showthread.php?p=3834480")
                        .setDescription("DCS World OpenBeta branch updated to " + openbetaVersion);
                        channel.send(embed);
                    }
                });
            //openbetaVersion changed
            //send message to notification channel
        }
    };

    versions.GetLatestVersions(callback);
}
//wait 60s before exit
//setTimeout(function() { console.log("DONE"); }, 60000);