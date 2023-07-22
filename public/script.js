//acquire sockets
const socket = io('/');
/*--------get all elements---------*/
const videoGrid = document.getElementById('video-grid');
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('chat_message')
// username from auth state change
const username= localStorage.getItem("usernames");
//console.log(username)
/*-------x---get all elements------x---*/
// define peer
var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '5501'
})
//store all  peers
const peers = {};
const myVideo = document.createElement('video');
myVideo.muted = true;
var myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  // if media is recieved set stream to videostream
  myVideoStream = stream;
  addVideoStream(myVideo, stream);
  //listen to event user connected and display the stream received
  socket.on('user-connected',(userId) => {
    connectToNewUser(userId,stream);
  })

})
peer.on('call', call => {
  // get media of peer
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
  call.answer(stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
})
});

socket.on('user-disconnected',userid => {
  // listen to event user disconnected and delete peer
  if(peer[userid])
    delete peer[userid]
  //console.log(userid)
   
})
peer.on('open',id=>{
  // emit an event when a peer join and pass the alloted room,unique id and dispalyname to server
  socket.emit('join-room',ROOM_ID,id,username);
})
const connectToNewUser=(userId,stream)=> {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  //add video of new peer
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    //remove video of user if disconnected
    video.remove()
    //console.log('close');
  })
  //map stream of user with their id
  peers[userId] = call
}

const addVideoStream=(video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    //add video stream to page
    videoGrid.append(video);
  }
  const muteUnmute = () => {
     // get audio track and if enabled disable it and vice versa
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    //console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    // get video track and if enabled disable it and vice versa
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    //toggle icon on click
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    //toggle icon on click
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    //toggle icon on click
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    //toggle icon on click
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  //----------------meeting info modal----------------//
// Get DOM Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

//-------------------x-------------meeting info modal-------------------------//

  //----------------leave meeting----------------//
  function Leavemeet() {
    window.location.assign("/");
  }
  //-------------------x------------leave meeting-------------------------//


 // input value
 let text = $("input");
 // when press enter send message

 $('html').keydown((e)=> {
   if (e.which == 13 && text.val().length !== 0) {
     //e.preventDefault();
     //whenever input is valid create a request to server
     //console.log(text.val());
     socket.emit('message', text.val());
     text.val('')
    
   }
  })

  socket.on("createMessage",data => {
    //append data to chat containers on listening to event
    //console.log(data.username)
    $("ul").append(`<li class="message"><b>${data.username} :</b><br/>${data.messages}</li>`);
    scrollToBottom()
  })

  const scrollToBottom = () => {
    //when chat overflowes scroll
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }