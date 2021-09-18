// Default settings
const servername = 'chat.lpc.events';
const realmname = 'lpc.events';
// Using #Helpdesk:lpc.events by default in case all else fails
var matchingroomid = '!gFXXSebbwZTfzaEinO:lpc.events';

// Retrieve room and user details from url
const current_url = new URL (window.location.href);
const search_params = current_url.searchParams;
const urlroomid = search_params.get('urlroomid');
var urluserid = search_params.get('urluserid');
var urlemail = search_params.get('urlemail');
const urlregcode = search_params.get('urlregcode');

// generate roomId from BBB from url parameter
if (urlroomid){
    matchingroomid ='!' + urlroomid + ':' + realmname;
    console.log('Attempting to join room: ' + matchingroomid);
}

if (!urluserid){
    console.log('No displayname provided!');
    urluserid = 'Unkown user';
}

if (urlemail){
    urlemail = '@' + urlemail.replace('@','.') + ':' + realmname ;
    console.log('Attempting to login as: ' + urlemail);
    console.log('Using reg code: ' + urlregcode);
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
