


function getSessionCredentials(key, room){
    return new Promise((resolve, reject)=>{
        console.log("Getting Session and Token for room: ", room)
        console.log("Using API Key: ", key)
        fetch(`https://neru-68eeb4cf-video-server-live.euw1.runtime.vonage.cloud/session/${key}/${room}`)
        .then((res)=>{
            return res.json()
        }).then((json)=>{
            console.log(json)
            apiKey = json.apiKey
            sessionId = json.sessionId
            token = json.token
            resolve(json)
        }).catch(function catchErr(error) {
            console.log(error);
            console.log('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
            reject(error)
        })    
    })   
}


function postToSession(key, room, data){
    return new Promise((resolve, reject)=>{
        console.log("Using room: ", room)
        console.log("Using API Key: ", key)
        fetch(`https://neru-68eeb4cf-video-server-live.euw1.runtime.vonage.cloud/session/${key}/${room}`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data)
        })
        .then((res)=>{
            return res.json()
        }).then((json)=>{
            console.log(json)
            resolve(json)
        }).catch(function catchErr(error) {
            console.log(error);
            console.log('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
            reject(error)
        })    
    })   
}


