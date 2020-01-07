const { Datastore } = require('@google-cloud/datastore');
require('dotenv').config();

/**
 * Grabs the name and update date of the library in staging and saves it in datastore
 * @param {object} libraryData 
 */
const saveLibraryDate = async (libraryData) => {
  try {
    // GCP project ID
  const projectId = process.env.GCPProjectID;

  // Datastore client
  const datastore = new Datastore({
    projectId: projectId,
  });

  // The kind for the new entity
  const kind = 'librarySaveDate';
  // The name/ID for the new entity
  const name = 'librarySaveDate';
  // The Cloud Datastore key for the new entity
  const dateKey = datastore.key([kind, name]);

  // Prepares the new entity
  const libraryDate = {
    key: dateKey,
    data: {
      libraryDate: libraryData.data.attributes.updated_at,
      libraryName: libraryData.data.attributes.name
    },
  };

  // Saves the entity
  await datastore.save(libraryDate);
  console.log(`Saved in Datastore: ${JSON.stringify(libraryDate.data)}`);
} catch (e) {
  console.log(e.message);
}
}
  
module.exports = saveLibraryDate;