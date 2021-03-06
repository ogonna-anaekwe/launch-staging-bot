const Slack = require('slack-node');
require('dotenv').config();

/**
 * Send slack notification with the details of the library in staging
 * @param {object} libraryData 
 */
const slackMessenger = async (libraryData) => {
    slack = new Slack();
    slack.setWebhook(process.env.slackWebhookUri);
    const libraryName = await libraryData.data.attributes.name;
    const getLibraryOwner = (libraryName) => {
        // split library name by - or : and grab first element of array
        return libraryName.split(/[-:]/)[0].trim().toUpperCase()
    }
    const libraryOwner = await getLibraryOwner(libraryName) ;
    const libraryIDStaging = await libraryData.data.id;
    const libraryLink = `https://launch.adobe.com/companies/${process.env.companyID}/properties/${process.env.telusGlobalPropertyID}/publishing/${libraryIDStaging}`;
    slack.webhook({
        "attachments": [
            {
                "fallback": "NEW Library up for review",
                "color": "#3d3a40",
                "author_name": "Launch Publishing API",
                "pretext": `@here *${libraryOwner}'s* library is up for review. Please click the link below to review, and leave a comment on this update when completed.`,
                "title": libraryName,
                "title_link": libraryLink,
                "text": `\`${libraryLink}\``
            }
        ]
    }, (e, response) => {
        if (e) {
            console.log(`Message NOT sent to slack`, e.message);
        } else {
            console.log('Message sent to slack. Status: ', response.statusCode);
        }
    });
}

module.exports = slackMessenger;