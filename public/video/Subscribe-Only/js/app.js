
let publisher
let subscriber
let apiKey
let sessionId
let token


let roomName = new URLSearchParams(window.location.search).get('roomName')
let urlApiKey = new URLSearchParams(window.location.search).get('apiKey')
if(!urlApiKey) urlApiKey = '47807831'
console.log('Using Room: ' + roomName)
console.log('Using apiKey: ' + urlApiKey)
getSessionCredentials(urlApiKey, roomName)
.then(json=>{
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

  console.log('init session')
  const session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    console.log('subscribing')
    subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
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
  
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      console.log('connected')
    }
  })
}