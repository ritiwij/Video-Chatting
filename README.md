![Screenshot (237)](https://user-images.githubusercontent.com/61948559/125345553-4fd5f480-e376-11eb-9730-6d26581f866a.png)
# Video call and chat website using WebRTC,Socket.io,Express and Firebase

##  Tech stacks used

#### Frontend

- HTML,CSS
- Javascript
- Embedded Javascript

#### Backend

- Express
- Node.js
- Peer.js
- Socket.io

#### Authentication

- Firebase

## Features Available
- Authentication of users using emailId and password.
- Catch errors in login like empty field,network error,password invalid etc,email used by another user.
- Users can set their display name for the video and chat meet.
- Persistence of login state till 5 days using session cookies.
- A chat room having a uniqueId using uuid.
- Ability to connect and get video and audio of all the people in the chat room(works fine till 3 or 4 participants).
- Ability to chat real time in meeting.
- Ability to Mute and Turn video-off in meeting.
- Unlimited duration calls

## Getting started

### Guide for local deployment -
1. Clone the repository.
```
git clone https://github.com/divya-ilona/videochat1.git
```
2.Change the working directory
```
cd videochat1
```
3.Install dependencies
```
npm install
```
4. Change peer port on script.js to local host.(ex-3000)
5. Change node to nodemon in package.json.
```
6. npm start
```
you should see the files running on localhost.

### Guide for using Website
1. Create and account by clicking signup.
![Screenshot (238)](https://user-images.githubusercontent.com/61948559/125345675-7431d100-e376-11eb-9dcb-65be7bfcfba4.png)
2. Relogin information.
![Screenshot (239)](https://user-images.githubusercontent.com/61948559/125345841-a8a58d00-e376-11eb-99f6-7f3c3454a947.png)
3. Click on Go to Meeting.
![Screenshot (237)](https://user-images.githubusercontent.com/61948559/125345750-8d3a8200-e376-11eb-91f3-234b8d32fcdf.png)
4. The chat room will open, you can type message in the send container at bottom.
![Screenshot (236)](https://user-images.githubusercontent.com/61948559/125345213-e2c25f00-e375-11eb-8b33-465ca9a10549.png)












  
