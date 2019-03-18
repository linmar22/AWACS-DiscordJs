# Intro
This bot scrapes https://updates.digitalcombatsimulator.com and notifies the channels listed in common/awacs-settings.json when there is a change. Made it in 4h so not as pretty as could be, but does the job. Intended to run as a 24/7 scheduled task on win.

# Requirements
* require('node-persist'); - for storing the last version
* require("cheerio"); - for traversing the update page with jQuery syntax
* require("request"); - for getting the html from the update page.
* require('child_process').exec; - for ease of navigation in the FS
* require('path'); - same as above
* require('discord.js'); - for discord integration
* require('lodash'); - for ease of development

# Sample awacs-settings.json
```json
{
    "token": "[token]",
    "clientSecret":"[clientSecret]",
    "permissionsInteger": 449536,
    "dcsVersionEndpoint": "https://updates.digitalcombatsimulator.com",
    "notificationChannelIds": ["a","list","of","channel","ids","to","nofity"]
}
```
