
let publisher
let subscriber
let apiKey
let sessionId
let token
let divAdmin
let broadcastOptionsTextarea


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

  hAdmin = document.getElementById('admininfo')
  hBroadcastOptions = document.getElementById('broadcastOptions')

  hAdmin.innerHTML = `
  API Key: ${apiKey}<br>
  Session Id: ${sessionId}<br>
  <br>
  <br>
  `

  hBroadcastOptions.innerHTML = 
`{
  "layout": {
    "type": "pip"
  },
  "maxBitrate": 1000000,
  "maxDuration": 5400,
  "outputs": {
    "hls": {
      "dvr": false,
      "lowLatency": false
    },
    "rtmp": []
  },
  "hasAudio": true,
  "hasVideo": true,
  "resolution": "1280x720",
  "streamMode" : "auto"
}`


  document.getElementById('startBroadcast').onclick = (event)=>{
    let broadcastOptions = JSON.parse(hBroadcastOptions.value)
    let launchDelay = document.getElementById('launchDelay').value
    let postData = {
      component: "broadcast",
      broadcastOptions: broadcastOptions
    }

    console.log(postData)

    postToSession(apiKey, roomName, postData)
    .then(response=>{
      let broadcastUrl = response.broadcast.broadcastUrls.hls
      document.getElementById('broadcastInfo').innerHTML = JSON.stringify(response)
      setTimeout(()=>{
        window.open(broadcastUrl, '_blank')
      },launchDelay)
      
    })

  }
  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    console.log('Stream Created', event)
    // subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
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
  
  const publisherOptions = {
    insertMode: 'append',
    width: '320',
    height: '180',
    resolution: '1280x720'
  };
  publisher = OT.initPublisher('divPublisher', publisherOptions, handleError);


  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher)
      console.log('connected')
    }
  })
}