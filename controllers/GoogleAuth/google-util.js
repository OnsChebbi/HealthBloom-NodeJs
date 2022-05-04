import { google } from 'googleapis';

const googleConfig = {
    clientId: '410085321469-ndnv3jtljc9fksblkbtdv9lvu6gnv614.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: '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', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'http://127.0.0.1:3002/auth/google' // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: defaultScope
    });
}

/**
 * Create the google url to be sent to the client.
 */
function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
}