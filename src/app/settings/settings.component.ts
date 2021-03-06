import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../_services/auth.service';
import { UserProfile } from '../user/profile';
import { map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Router } from '@angular/router';
import { DatabaseService } from '../_services/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  activeTab = 'Profile';
  authUser: firebase.User;
  uid;
  userProfile = new UserProfile();
  @ViewChild('images_for_profile') images_for_profile: ElementRef;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  passwordUpdateInfo = {
    old: '',
    confirm: '',
    new: ''
  }

  templates;
  

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private auth: AngularFireAuth ,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private router: Router,
    private databaseService: DatabaseService
  ) {
    this.authUser = auth.auth.currentUser;
    console.log(this.authUser);
    
    this.userProfile.email = this.authUser.email;
    // this.userProfile.phone = this.authUser.phoneNumber;
    this.userProfile.avatar = this.authUser.photoURL;
    this.userProfile.uid = this.authUser.uid
    this.uid = this.authUser.uid;

    this.authService.getUserById(this.uid).valueChanges().subscribe(data => {
      this.userProfile.name = data['name'];
      this.userProfile.company_name = data['company_name'];
      this.userProfile.phone = data['phone'] ? data['phone']: '';
    });

    this.databaseService.getLists('/savedtemplates/' + auth.auth.currentUser.uid).valueChanges().subscribe(data => {
      this.templates = data;
      if(this.templates.length > 0) {
        this.templates.map(template => {
          var date = new Date(template.created_at);
          template.created_at = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        })
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  updateProfile() {
    this.authUser.updateEmail(this.userProfile.email).then(function() {
      console.log('success');
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });

    this.authUser.updateProfile({
      displayName: this.userProfile.name,
      photoURL: this.userProfile.avatar
    }).then(function() {
      // Update successful.
      console.log('avartar change success');
      
    }).catch(function(error) {
      // An error happened.
      console.log('avartar change error');
    });

    this.authService.updateUserById(this.userProfile.uid, this.userProfile);
  }

  popupforImage() {
    this.images_for_profile.nativeElement.click();
  }

  deleteProfileImage() {
    this.userProfile.avatar = '';
  }

  handleFileInput(files) {
    if (files.length == 0) {
      return;
    }
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('profile/' + this.userProfile.uid+'/'+ '/'+id);
    this.task = this.ref.put(files[0]);
    var me = this;
    this.task.then(function (data) {
      
      var a = data.ref.getDownloadURL();
      a.then(function (data) {
       me.userProfile.avatar = data;
       console.log(data);
       
      });
    });   
  }

  updatePassword() {
    var me  = this;
    if(this.passwordUpdateInfo.new == this.passwordUpdateInfo.confirm && this.passwordUpdateInfo.new != "" && this.passwordUpdateInfo.confirm != ""){
      this.authUser.updatePassword(this.passwordUpdateInfo.new).then(function() {
        // Update successful.
        me.authService.doSignout().then(res => {
          me.dialogRef.close();
          me.router.navigate(['/signin'])
        }, err => {
          console.log(err);
        });
      }).catch(function(error) {
       console.log(error);
      });
    }
    
  }

  deleteTemplate(key) {
    this.databaseService.deleteRow('/savedtemplates/' + this.auth.auth.currentUser.uid, key);
  }

}
