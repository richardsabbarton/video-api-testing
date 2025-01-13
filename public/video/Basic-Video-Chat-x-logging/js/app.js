
let apiKey
let sessionId
let token

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

OT.on("exception", e => {
  console.log("[OT] exception", e)
})


function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  const session = OT.initSession(apiKey, sessionId);
  session.on("archiveStarted", e => {
    console.log("[Session] archiveStarted", e)
  })
  session.on("archiveStopped", e => {
    console.log("[Session] archiveStopped", e)
  })
  session.on("connectionCreated", e => {
    console.log("[Session] connectionCreated", e)
  })
  session.on("connectionDestroyed", e => {
    console.log("[Session] connectionDestroyed", e)
  })
  session.on("cpuPerformanceChanged", e => {
    console.log("[Session] cpuPerformanceChanged", e)
  })
  session.on("muteForced", e => {
    console.log("[Session] muteForced", e)
  })
  session.on("sessionConnected", e => {
    console.log("[Session] sessionConnected", e)
  })
  session.on("sessionDisconnected", e => {
    console.log("[Session] sessionDisconnected", e)
  })
  session.on("sessionReconnected", e => {
    console.log("[Session] sessionReconnected", e)
  })
  session.on("sessionReconnecting", e => {
    console.log("[Session] sessionReconnecting", e)
  })
  session.on("signal", e => {
    console.log("[Session] signal", e)
  })
  session.on("streamCreated", e => {
    console.log("[Session] streamCreated", e)
  })
  session.on("streamDestroyed", e => {
    console.log("[Session] streamDestroyed", e)
  })
  session.on("streamPropertyChanged", e => {
    console.log("[Session] streamPropertyChanged", e)
  })

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    const subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    subscriber.on("audioBlocked", e => {
      console.log("[Subscriber] audioBlocked", e)
    })
    //subscriber.on("audioLevelUpdated", e => {
    //  console.log("[Subscriber] audioLevelUpdated", e)
    //})
    subscriber.on("audioUnblocked", e => {
      console.log("[Subscriber] audioUnblocked", e)
    })
    subscriber.on("captionReceived", e => {
      console.log("[Subscriber] captionReceived", e)
    })
    subscriber.on("connected", e => {
      console.log("[Subscriber] connected", e)
    })
    subscriber.on("destroyed", e => {
      console.log("[Subscriber] destroyed", e)
    })
    subscriber.on("disconnected", e => {
      console.log("[Subscriber] disconnected", e)
    })
    subscriber.on("encryptionSecretMatch", e => {
      console.log("[Subscriber] encryptionSecretMatch", e)
    })
    subscriber.on("encryptionSecretMismatch", e => {
      console.log("[Subscriber] encryptionSecretMismatch", e)
    })
    subscriber.on("mediaStreamAvailable", e => {
      console.log("[Subscriber] mediaStreamAvailable", e)
    })
    //subscriber.on("qualityScoreChanged", e => {
    //  console.log("[Subscriber] qualityScoreChanged", e)
    //})
    subscriber.on("videoDimensionsChanged", e => {
      console.log("[Subscriber] videoDimensionsChanged", e)
    })
    subscriber.on("videoDisabled", e => {
      console.log("[Subscriber] videoDisabled", e)
    })
    subscriber.on("videoDisableWarning", e => {
      console.log("[Subscriber] videoDisableWarning", e)
    })
    subscriber.on("videoDisableWarningLifted", e => {
      console.log("[Subscriber] videoDisableWarningLifted", e)
    })
    subscriber.on("videoElementCreated", e => {
      console.log("[Subscriber] videoElementCreated", e)
    })
    subscriber.on("videoEnabled", e => {
      console.log("[Subscriber] videoEnabled", e)
    })
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
  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);
  publisher.on("accessAllowed", e => {
    console.log("[Publisher] accessAllowed", e)
  })
  publisher.on("accessDenied", e => {
    console.log("[Publisher] accessDenied", e)
  })
  publisher.on("accessDialogClosed", e => {
    console.log("[Publisher] accessDialogClosed", e)
  })
  publisher.on("accessDialogOpened", e => {
    console.log("[Publisher] accessDialogOpened", e)
  })
  publisher.on("audioInputDeviceChanged", e => {
    console.log("[Publisher] audioInputDeviceChanged", e)
  })
  //publisher.on("audioLevelUpdated", e => {
  //  console.log("[Publisher] audioLevelUpdated", e)
  //})
  publisher.on("destroyed", e => {
    console.log("[Publisher] destroyed", e)
  })
  publisher.on("mediaStopped", e => {
    console.log("[Publisher] mediaStopped", e)
  })
  publisher.on("mediaStreamAvailable", e => {
    console.log("[Publisher] mediaStreamAvailable", e)
  })
  publisher.on("muteForced", e => {
    console.log("[Publisher] muteForced", e)
  })
  publisher.on("streamCreated", e => {
    console.log("[Publisher] streamCreated", e)
  })
  publisher.on("streamDestroyed", e => {
    console.log("[Publisher] streamDestroyed", e)
  })
  publisher.on("videoDimensionsChanged", e => {
    console.log("[Publisher] videoDimensionsChanged", e)
  })
  publisher.on("videoDisabled", e => {
    console.log("[Publisher] videoDisabled", e)
  })
  publisher.on("videoDisableWarning", e => {
    console.log("[Publisher] videoDisableWarning", e)
  })
  publisher.on("videoDisableWarningLifted", e => {
    console.log("[Publisher] videoDisableWarningLifted", e)
  })
  publisher.on("videoElementCreated", e => {
    console.log("[Publisher] videoElementCreated", e)
  })
  publisher.on("videoEnabled", e => {
    console.log("[Publisher] videoEnabled", e)
  })

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
    }
  });
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session')
  .then((response) => response.json())
  .then((json) => {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;
    // Initialize an OpenTok Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}