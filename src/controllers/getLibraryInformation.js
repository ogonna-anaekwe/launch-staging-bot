const fetch = require('node-fetch');
const { Datastore } = require('@google-cloud/datastore');
require('dotenv').config();
const slackMessenger = require('./slackMessenger');
const saveLibraryDate = require('./saveLibraryDate');
const accessToken = require('../config/authenticate');

// Creates a datastore client
const datastore = new Datastore({
	projectId: process.env.GCPProjectID
});

// Get a single entity
const key = datastore.key(['librarySaveDate', 'librarySaveDate']);
/**
 * Gets the library ID of the library in the staging environment
 */
const getLibraryInformation = async() => {
	var token = await accessToken()
	var headers = {
		'Accept': 'application/vnd.api+json;revision=1',
		'Content-Type': 'application/vnd.api+json',
		'Authorization': `Bearer ${token}`,
		'X-Api-Key': `${process.env.apiKey}`,
		'X-Gw-Ims-Org-Id': `${process.env.organizationID}`
	};

	var optionsLibraryID = {
		// retrieve data for environment - in this case, this is the staging environment
        url: `https://reactor.adobe.io/environments/${process.env.telusGlobalStagingEmbedID}`,
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
	// promise needed here to get libraryID else it will be undefined
	getLibraryID().then(async (response) => {
        try {
			let libraryID = await response.data.relationships.library.data.id
			console.log('Library ID in staging: ', libraryID) 
            if (libraryID) {
                return await fetch(`https://reactor.adobe.io/libraries/${libraryID}`, {
				method: 'GET',
				headers: headers
			})
			.then(libraryAttributes => libraryAttributes.json())
			.then(libraryData => {
				// get last update date of library from Datastore
				// using nested promises here! TODO: refactor
				datastore.get(key)
				.then(async (results) => {
					console.log('Successfully retrieved library update date from datastore');
					const lastUpdateDatastore = new Date(results[0].libraryDate);
					const lastUpdateLaunch = new Date(libraryData.data.attributes.updated_at);
					// send slack message if library has been recently updated
					// after sending slack message, update datastore with new updated library date
					if (lastUpdateLaunch > lastUpdateDatastore) {
						slackMessenger(libraryData)
						saveLibraryDate(libraryData)
						console.log('new library update sent to slack and stored in datastore');
					} else {
						console.log('No slack message sent and no update to datastore as library hasn\'t changed');
					}
				})
				.catch((e) => {
					console.log('ERROR fetching library update date:', e.message);
				})
			})
			}
        } catch (e) {
			console.log('No library under review: ', e.message);
        }
	})
}

module.exports = getLibraryInformation;