import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('myvideo') myVideo: any;

  peer;
  anotherid;
  mypeerid;

  constructor() {

  }

  ngOnInit() {
    const video = this.myVideo.nativeElement;
    this.peer = new Peer({ key: 'bi9pbxqnkamdkj4i' });
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    }, 3000);

    this.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
      });
    });

    const n = <any>navigator;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    this.peer.on('call', function (call) {
      n.getUserMedia({ video: true, audio: true }, function (stream) {
        call.answer(stream);
        call.on('stream', function (remotestream) {
          video.src = URL.createObjectURL(remotestream);
          video.play();
        });
      }, function (err) {
        console.log('Failed to get stream', err);
      });
    });
  }

  connect() {
    const conn = this.peer.connect(this.anotherid);
    conn.on('open', function () {
      conn.send('Message from that id');
    });
  }

  videoconnect() {
    const video = this.myVideo.nativeElement;
    const localvar = this.peer;
    const fname = this.anotherid;

    // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    const n = <any>navigator;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    n.getUserMedia({ video: true, audio: true }, function (stream) {
      const call = localvar.call(fname, stream);
      call.on('stream', function (remotestream) {
        video.src = URL.createObjectURL(remotestream);
        video.play();
      });
    }, function (err) {
      console.log('Failed to get stream', err);
    });
  }
}
