import { Video } from "./modules/video.js"
import { Room } from "./modules/ballroom.js"

class App {
  constructor(){
    console.log("App Created!")
    this.video = false
    this.roomName = new URLSearchParams(window.location.search).get('roomName')
    this.getVideoSessionCredentials(this.roomName)
    let roomConfig = {
      clearColor: 'black'
    }
    this.room = new Room(roomConfig)

  }

  getVideoSessionCredentials(room){
    console.log("Getting Session and Token for room: ", room)
    fetch('https://neru-68eeb4cf-video-server-live.euw1.runtime.vonage.cloud/session/47807831/' + room).then(function fetch(res) {
        return res.json()
    }).then((json)=>{
        this.apiKey = json.apiKey
        this.sessionId = json.sessionId
        this.token = json.token
        if(!this.video){

          let videoConfig = {
            roomName: this.roomName,
            videoContainerElement: document.getElementById('ballroom')
          }

          this.video = new Video(this.apiKey, this.sessionId, this.token, videoConfig)
          this.video.onSubscribe = (subscriber)=>{
            console.log('calling addBall(subscriber)')
            this.room.addBall(subscriber)
          }
          this.video.connect()
          .then(()=>{
            this.video.publish()
            .then(publisher=>{
              this.publisher = publisher
              this.room.addBall(publisher)
              this.room.startRendering()
              
            })
          })
          .catch(error=>{this.handleError(error)})
        }    
    }).catch((error)=>{
        console.log(error);
        console.log('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    })
  }

  handleError(error) {
    if (error) {
      console.error(error);
    }
  }
}

const app = new App()
globalThis.app = app
