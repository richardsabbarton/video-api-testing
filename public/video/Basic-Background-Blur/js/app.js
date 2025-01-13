/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let publisher;
let btnToggleBlur;
let isBlurring;
let publisherStats;
let videofilter = {
  type: 'backgroundBlur',
  blurStrength: 'high'
}

function getSessionCredentials(room){
  console.log("Getting Session and Token for room: ", room)
  fetch('https://neru-68eeb4cf-video-server-live.euw1.runtime.vonage.cloud/session/47807831/' + room).then(function fetch(res) {
      return res.json()
  }).then(function fetchJson(json) {
      //json = JSON.parse(json)
      console.log(json)
      apiKey = json.apiKey
      sessionId = json.sessionId
      token = json.token
      initializeSession()
  }).catch(function catchErr(error) {
      console.log(error);
      console.log('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  })
}

let roomName = new URLSearchParams(window.location.search).get('roomName')

getSessionCredentials(roomName)




const handleError = (error) => {
  if (error) {
    console.error(error);
  }
};

const initializeSession = () => {
  btnToggleBlur = document.getElementById('toggleblur')
  publisherStats = document.getElementById('publisherstats')
  isBlurring = false
  const session = OT.initSession(apiKey, sessionId);

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

  // initialize the publisher
  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };

  // Check to see if the browser can apply the filter
  if (OT.hasMediaProcessorSupport()) {
    publisherOptions.videoFilter = videofilter
    btnToggleBlur.disabled = false
    isBlurring = true
  }

  publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  
  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError)
      setTimeout(()=>{
        updateStats()
        console.log("Starting 5 second delay before checking publisher stats")
      },5000)
    }
  })

  btnToggleBlur.addEventListener('click',(event)=>{
    if(!isBlurring){
      publisher.applyVideoFilter(videofilter)
      isBlurring = true
      btnToggleBlur.innerHTML = "Disable Blur"
    } else {
      publisher.clearVideoFilter()
      isBlurring = false
      btnToggleBlur.innerHTML = "Enable Blur"
    }
  })
}


function updateStats(){
    publisher.getStats((error, stats)=>{
      if(error){
        console.log(error)
      } else {
        console.log(stats)
        let fps = stats[0].stats.video.frameRate
        publisherStats.innerHTML = `Publisher Frame Rate: ${fps}fps`
        setTimeout(()=>{updateStats()},1000)
      }
    })
}