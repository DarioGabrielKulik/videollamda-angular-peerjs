import { Component, ElementRef, ViewChild } from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;

  private peer: Peer;
  private myStream?: MediaStream;

  constructor() {
    this.peer = new Peer();
  }

  ngOnInit() {
    this.setupPeerEvents();
  }

  setupPeerEvents() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.myStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            this.remoteVideo.nativeElement.srcObject = remoteStream;
          });
        });
    });
  }

  startCall(remotePeerId: string) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.myStream = stream;
        this.localVideo.nativeElement.srcObject = stream;
        const call = this.peer.call(remotePeerId, stream);
        call.on('stream', (remoteStream) => {
          this.remoteVideo.nativeElement.srcObject = remoteStream;
        });
      });
  }

  endCall() {
    if (this.myStream) {
      this.myStream.getTracks().forEach(track => track.stop());
    }
    this.localVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = null;
  }
}
