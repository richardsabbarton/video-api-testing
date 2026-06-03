
let publisher

let apiKey
let sessionId
let token

let timestamps = {}
timestamps.load = performance.now()

let roomName = new URLSearchParams(window.location.search).get('roomName')
let urlApiKey = new URLSearchParams(window.location.search).get('apiKey')
if(!urlApiKey) urlApiKey = '47812461'
console.log('Using Room: ' + roomName)
console.log('Using apiKey: ' + urlApiKey)
timestamps.getSessionCredentials = performance.now()
getSessionCredentials(urlApiKey, roomName)
.then(json=>{
  timestamps.getSessionCredentialsTook = performance.now() - timestamps.getSessionCredentials
  apiKey = json.apiKey
  sessionId = json.sessionId
  token = json.token
  initializeSession()
})

function handleError(error) {
  if (error) {
    console.error(error);
  }
}




function initializeSession() {

  timestamps.init = performance.now()

  const sessionOptions = {
    encryptionSecret: apiKey,  // All participants MUST use the same secret
    singlePeerConnection: true        // Enable Single Peer Connection
}

  const session = OT.initSession(apiKey, sessionId, sessionOptions);

  const shareScreenButton = document.getElementById('sharescreen')
  shareScreenButton.onclick = (event)=>{
    const screenPublisherOptions = {
      videoSource: 'screen',
      insertMode: 'append',
      publishAudio: false
    };
    console.log('publishing screen')
    console.log(screenPublisherOptions)
    const screenPublisher = OT.initPublisher('publisher', screenPublisherOptions, handleError);
    session.publish(screenPublisher, handleError)
  }

  timestamps.initSessionTook = performance.now() - timestamps.init
  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    console.log('Stream Created:')
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      publishVideo: false,
      publishAudio: false
    };
    timestamps.subscribe = performance.now()
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });
  
  session.on("streamDestroyed", (event)=>{
    if (event.reason === "clientDisconnected") {
    console.log("Call disconnected by the user");
    }  
  });

  session.on("connectionCreated", (event)=>{ console.log(event.type, event.connection.id)})
  session.on("connectionDestroyed", (event)=>{ console.log(event.type, event.connection.id)})
  
  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    resolution: '1280x720'
  };
  timestamps.createPublisher = performance.now()
  publisher = OT.initPublisher('publisher', publisherOptions, handleError);
  timestamps.createPublisherTook = performance.now() - timestamps.createPublisher

  // Connect to the session
  timestamps.sessionConnect = performance.now()
  session.connect(token, (error) => {
    timestamps.sessionConnectTook = performance.now() - timestamps.sessionConnect
    timestamps.sessionConnected = performance.now()
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      timestamps.publish = performance.now()
      session.publish(publisher, handleError);
    }
  });
}


