var fetch = require('node-fetch');
var slackMessenger = require('../controllers/slackMessenger');
var accessToken = require('../config/authenticate');
require('dotenv').config()

/**
 * Gets the library ID of the library in the staging environment
 */
const getLibraryInformation = async() => {
	var token = await accessToken()
	var headers = {
		'Accept': 'application/vnd.api+json;revision=1',
		'Content-Type': 'application/vnd.api+json',
		// 'Authorization': `Bearer ${process.env.token}`,
		'Authorization': `Bearer ${token}`,
		'X-Api-Key': `${process.env.apiKey}`,
		'X-Gw-Ims-Org-Id': `${process.env.organizationID}`
	};

	var optionsLibraryID = {
		// retrieve data for environment - in this case, this is the staging environment
        // url: `https://reactor.adobe.io/environments/${process.env.telusGlobalStagingEmbedID}`,
        url: `https://reactor.adobe.io/environments/${process.env.telusDRBStagingEmbed}`,
		headers: headers
	};

	const getLibraryID = async () => {
		return await fetch(optionsLibraryID.url, {
			method: 'GET',
			headers: headers
        })
        .then((response) => {
			// console.log(response)
			return response.json()
		})
	}
	// get library attributes and send message to slack only after getLibraryID()
	// has run. Otherwise, libraryID will remain undefined
	getLibraryID().then(async (response) => {
        try {
            let libraryID = await response.data.relationships.library.data.id
            if (libraryID) {
                return await fetch(`https://reactor.adobe.io/libraries/${libraryID}`, {
				method: 'GET',
				headers: headers
			})
			.then(libraryAttributes => libraryAttributes.json())
			.then(libraryData => {
				// if library information has been previously sent to slack, 
				// do not send again
				// build logic for this
				slackMessenger(libraryData)
				// store library ID and update time someplace
				// check if both have changed, and send message on if there has been a change
			})
			}
			console.log('library ID in staging: ', libraryID) 
        } catch (e) {
			console.log('No library under review: ', e.message)
        }
	})
}

module.exports = getLibraryInformation