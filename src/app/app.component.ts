import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('myVideo') myVideo: any;
  @ViewChild('theirVideo') theirVideo: any;

  peer;
  anotherPeersId: any;
  myPeerId: any;
  localStream: any;
  constructor() {

  }

  ngOnInit() {
    const myVideo = this.myVideo.nativeElement;
    const theirVideo = this.theirVideo.nativeElement;
    this.peer = new Peer({ key: 'bi9pbxqnkamdkj4i' });
    setTimeout(() => {
      this.myPeerId = this.peer.id;
    }, 3000);

    // Handle event: upon opening our connection to the PeerJS server
    this.peer.on('connection', function (connection) {
      connection.on('data', function (data) {
        console.log(data);
      });
    });

    this.peer.on('error', function (err) {
      console.error('An error ocurred with peer: ' + err);
    });

    // Start Media, Camera, Audio
    const n = <any>navigator;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    n.getUserMedia({ audio: true, video: true }, function (stream) {
      myVideo.src = URL.createObjectURL(stream);
    }, function (err) {
      console.log('Failed to get local stream', err);
    });

    // Handle the on receive call event
    this.peer.on('call', function (incomingCall) {
      const acceptsCall = confirm('Videocall incoming, do you want to accept it ?');
      if (acceptsCall) {
        console.log('call', incomingCall);
        n.getUserMedia({ video: true, audio: true }, function (stream) {
          incomingCall.answer(stream);

          // Receive data
          incomingCall.on('stream', function (remotestream) {
            // Store a global reference of the other user stream

            // Display the stream of the other user in the peer-camera video element !
            theirVideo.src = URL.createObjectURL(remotestream);
            theirVideo.play();
          });

          // Handle when the call finishes
          incomingCall.on('close', function () {
            console.log('incoming call has finished');
          });

        }, function (err) {
          console.log('Failed to get stream', err);
        });
      } else {
        console.log('Call denied !');
      }
    });
  }

  requestLocalVideo(callbacks) {
    const n = <any>navigator;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
    // Request audio an video
    n.getUserMedia({ audio: true, video: true }, callbacks.success, callbacks.error);
  }

  onReceiveStream(stream, element_id) {

    // Access Stream in Html Video
    const video = this.myVideo.nativeElement;
    video.src = URL.createObjectURL(stream);
    video.play();

    // Store a global reference of the stream
    this.localStream = stream;
  }

  VideoCall() {
    const theirVideo = this.theirVideo.nativeElement;
    const localvar = this.peer;
    const fname = this.anotherPeersId;
    // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    const n = <any>navigator;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
    // Handle event: Make a call
    n.getUserMedia({ video: true, audio: true }, function (stream) {

      // this.localStream = stream;

      const outgoingCall = localvar.call(fname, stream);
      console.log('outgoingCall', outgoingCall);
      console.log(typeof outgoingCall);
      outgoingCall.on('stream', function (remotestream) {
        theirVideo.src = URL.createObjectURL(remotestream);
        theirVideo.play();
      });
    }, function (err) {
      console.log('Failed to get remote stream', err);
    });
  }

  EndVideoCall() {
    this.peer.on('destroy', () => {
    }, function (err) {
      console.log('Failed to get remote stream', err);
    });
  }

  MuteMe() {
    this.localStream.getAudioTracks()[0].enabled = false;
  }

  UnMuteMe() {
    this.localStream.getAudioTracks()[0].enabled = true;
  }
}
