//Retrieve room and user details from url
const url = require('url');
const current_url = new URL (window.location.href);
// get access to URLSearchParams object
const search_params = current_url.searchParams;
// get url parameters
const urlroomid = search_params.get('urlroomid');
var matchingroomid = '!gFXXSebbwZTfzaEinO:lpc.events';
const urluserid = search_params.get('urluserid');

// generate roomId from BBB from url parameter
if (urlroomid){
    matchingroomid ="!" + urlroomid + ":lpc.events";
}
console.log(matchingroomid);

export let config = {
    baseUrl: 'https://chat.lpc.events:8448',
    roomId: matchingroomid,
    roomHeader: false,
    roomsList: false,
    msgComposer: true,
    theme: 'light',
    highlight: 'custom',
    displayName: urluserid
};
