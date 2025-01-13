


class Video {
    constructor(apiKey, sessionId, token, videoConfig){
        this.shadow = document.createElement('div')
        this.shadow.style.display = "none"
        document.body.appendChild(this.shadow)
        this.videoSession = false
        console.log("video created")
        this.apiKey = apiKey
        this.sessionId = sessionId
        this.token = token
        this.subscribers = new Array()
        this.publishers = new Array()

        this.onSubscribe = false

        this.initializeSession()
    }

    initializeSession() {

        this.videoSession = OT.initSession(this.apiKey, this.sessionId);
      
        // Subscribe to a newly created stream
        this.videoSession.on('streamCreated', (event) => {
          if(typeof(this.onSubscribe)=='function'){
            this.subscribe(event.stream)
            .then(subscriber=>{
                console.log('callng onSubscribe(subscriber)')
                this.onSubscribe(subscriber)
            })
            .catch((error)=>{
                console.log(error)
            })
          }
        });
      
        this.videoSession.on('sessionDisconnected', (event) => {
          console.log('You were disconnected from the session.', event.reason);
        });
        
        this.videoSession.on("streamDestroyed", (event)=>{
          if (event.reason === "clientDisconnected") {
          console.log("Call disconnected by the user");
          }  
        });
      
        this.videoSession.on("connectionCreated", (event)=>{ console.log(event.type, event.connection.id)})
        this.videoSession.on("connectionDestroyed", (event)=>{ console.log(event.type, event.connection.id)})
        
    }


    connect(){
        return new Promise((resolve, reject)=>{
            this.videoSession.connect(this.token, (e)=>{
                if(e){
                    reject(e)
                } else {
                    resolve()
                }
            })
        })        
    }
      

    publish(){
        return new Promise((resolve, reject)=>{
            const publisherOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                resolution: '1280x720'
            };
            let container = document.createElement('div')
            this.shadow.appendChild(container)
            const publisher = OT.initPublisher(container, publisherOptions, (e)=>{
                if(e){
                    reject(e)
                } else {
                    this.publishers.push(publisher)
                    this.videoSession.publish(publisher)
                    resolve(publisher)
                }
            })
        })
    }

    subscribe(stream){
        return new Promise((resolve, reject)=>{
            const subscriberOptions = {
                insertMode: 'replace',
                width: '100%',
                height: '100%',
                preferredResolution: 'auto',
                fitMode: 'cover'
            }
            console.log(subscriberOptions)
            let subscriberElement = document.createElement('div')
            subscriberElement.id = stream.id
            let subscriber = this.videoSession.subscribe(stream, subscriberElement, subscriberOptions, (error)=>{
                if(error){
                    reject(error)
                } else {
                    resolve(subscriber)
                }
            })
        })
    }
}






export {Video}