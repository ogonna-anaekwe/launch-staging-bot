const auth = require('@adobe/jwt-auth'); 

const config = {
    apiKey: process.env.apiKey,
    companyID: process.env.companyID,
    telusGlobalPropertyID: process.env.telusGlobalPropertyID,
    telusGlobalStagingEmbedID: process.env.telusGlobalStagingEmbedID,
    telusDRBStagingEmbed: process.env.telusDRBStagingEmbed,
    telusDRBPropertyID: process.env.telusDRBPropertyID,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    technicalAccountId: process.env.technicalAccountId,
    orgId: process.env.organizationID,
    metaScopes: ['ent_reactor_sdk'],
    privateKey: JSON.parse(`"${process.env.privateKey}"`)
};

/**
 * This programmatically generates the accessToken needed to authenticate with Adobe IO
 */
const accessToken = async () => {
    try {
        let { access_token } = await auth(config);
        // console.log(access_token)
        return access_token
    } catch (e) {
        console.log(e)
    }
}

module.exports = accessToken