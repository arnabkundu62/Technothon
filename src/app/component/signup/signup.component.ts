import { Component, OnInit } from '@angular/core';
import {  ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements AfterViewInit,OnInit {
 

  WIDTH = 150;
  HEIGHT = 150;

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured!: boolean;
  check=true;
  signUpForm!:FormGroup;
  selectedFileNames: string[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  selectedFiles?: FileList;

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  ngOnInit(): void {
    console.log(document.getElementById("canvas"))
    this.signUpForm=new FormGroup({
      name:new FormControl('', Validators.required),
      email:new FormControl('', [Validators.required, Validators.email]),
      aadharno:new FormControl('', Validators.required),
      dob:new FormControl('', Validators.required),
      address:new FormControl('', Validators.required),
      pannumber:new FormControl('', Validators.required),
      avatar:new FormControl('', Validators.required),
      selfie:new FormControl('', Validators.required)
    })


    
   
  }

  get aadharno() {
    return this.signUpForm.get('aadharno');
  }
  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get dob() {
    return this.signUpForm.get('dob');
  }

  get address() {
    return this.signUpForm.get('address');
  }

  get pannumber() {
    return this.signUpForm.get('pannumber');
  }

  get avatar() {
    return this.signUpForm.get('avatar');
  }


  onSubmit(){
    if (!this.signUpForm.valid) {
      return;
    }
    else{
      console.log(this.signUpForm.value);
    }
  }

  




  async setupDevices() {
    this.check=true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
        
        
      } catch (e) {
        this.error = e;
      }
    }
  }

  stoped(){
    this.video.nativeElement.stop()
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    let img=this.canvas.nativeElement.toDataURL("image/png");
    console.log(img)
    this.signUpForm.controls['selfie'].setValue(img);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;
    this.check=false;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }


  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.signUpForm.controls['avatar'].setValue(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }



}
