/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */
let session, publisher, subscriber

let apiKey;
let sessionId;
let token;

let roomName = new URLSearchParams(window.location.search).get('roomName')
let urlApiKey = new URLSearchParams(window.location.search).get('apiKey')
if(!urlApiKey || urlApiKey == null) urlApiKey = '47807831'
console.log('Using Room: ' + roomName)
console.log('Using apiKey: ' + urlApiKey)
getSessionCredentials(urlApiKey, roomName)
.then(json=>{
  apiKey = json.apiKey
  sessionId = json.sessionId
  token = json.token
  initializeSession()
})


const videoEl = document.getElementById('video')
const btnConnect = document.getElementById('connect')
const btnPublish = document.getElementById('publish')

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  
  btnConnect.onclick = (event)=>{connect(event)}
  btnPublish.onclick = (event)=>{publish(event)}
  btnPublish.setAttribute('enabled', false)


}

function connect(btnEvent){
  console.log('Entering: connect(btnEvent)')
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  console.log('connecting to session with token: ' + token)
  session.connect(token, (error) => {
    if (error) {
      console.log('Entered connection error state')
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      console.log('Sesson connected...')
      btnPublish.setAttribute('enabled', true)
    }
  })
  
}


function publish(btnEvent){
    
  console.log('Entering: publish(btnEvent)')

  const stream = videoEl.captureStream()

  const videoTracks = stream.getVideoTracks();
  const audioTracks = stream.getAudioTracks();


  if(videoTracks.length == 0) return console.log('No Video Tracks available')

  
  const publisherOptions = {
    videoSource: videoTracks[0],
    audioSource: null,
    publishAudio: false,
    fitMode: 'contain',
    width: 320,
    height: 240,
    resolution: "1920x1080"
  }

  console.log(publisherOptions)



  // initialize the publisher
  publisher = OT.initPublisher('publisher', publisherOptions, (err) => {
    if (err) {
      console.log('error state')
      //videoEl.pause();
      handleError(err)
    } 
  })
  
  console.log('Calling session.publish()')
  session.publish(publisher, (error)=>{
    console.log(error)
  })

}

(function localFileVideoPlayer() {
	'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.getElementById('video')
    var canPlay = videoNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'Can play type "' + type + '": ' + canPlay
    var isError = canPlay === 'no'
    displayMessage(message, isError)

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
})()