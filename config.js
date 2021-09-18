//Retrieve room and user details from url
const url = require('url');
const current_url = new URL (window.location.href);
// get access to URLSearchParams object
const search_params = current_url.searchParams;
// get url parameters
const urlroomid = search_params.get('urlroomid');
const servername = "matrix-testing.lpc.events";
var matchingroomid = '!XtgvTmGxsgQhgfEDuQ:matrix-testing.lpc.events';
var urluserid = search_params.get('urluserid');
var urlemail = search_params.get('urlemail');
var urlregcode = search_params.get('urlregcode');

// generate roomId from BBB from url parameter
if (urlroomid){
    matchingroomid ="!" + urlroomid + ":" + servername;
}
console.log("Attempting to join room: " + matchingroomid);

if (!urluserid){
    console.log("No displayname provided!");
    urluserid = "Unkown user";
}

if (urlemail){
    urlemail = "@" + urlemail.replace("@",".") + ":" + servername ;
    console.log("Attempting to login as: " + urlemail);
    console.log("Using reg code: " + urlregcode);
}
 
export let config = {
    baseUrl: 'https://' + servername + ':8448',
    roomId: matchingroomid,
    roomHeader: false,
    roomsList: false,
    msgComposer: true,
    theme: 'light',
    highlight: 'custom',
    displayName: urluserid,
    userId: urlemail,
    email: urlemail,
    regcode: urlregcode
};
