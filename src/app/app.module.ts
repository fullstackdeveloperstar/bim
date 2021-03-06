import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { WrapComponent } from './wrap/wrap.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectComponent } from './project/project.component';
import { LodComponent } from './lod/lod.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarrightComponent } from './sidebarright/sidebarright.component';
import { ProjectprofileComponent } from './projectprofile/projectprofile.component';
import { ProjectstageComponent } from './projectstage/projectstage.component';
import { ProjectbimComponent } from './projectbim/projectbim.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { UserComponent } from './user/user.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { LoadingComponent } from './loading/loading.component';
import { SaveTemplateDialog, ArchiveDialog } from './projectprofile/projectprofile.component';
import { ChatService } from './_services/chat.service';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ProjectconfComponent } from './projectconf/projectconf.component';
import { TeamComponent } from './project/team/team.component';
import { MeetingComponent } from './project/meeting/meeting.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ExpiredComponent } from './expired/expired.component';
import { UpgradeComponent } from './upgrade/upgrade.component'
import { Ng5SliderModule } from 'ng5-slider';
import { UpgradeService } from './_services/upgrade.service';
import { MatrixComponent } from './project/matrix/matrix.component';
import { QualityComponent } from './project/quality/quality.component';
import { AuthService } from './_services/auth.service';
import { AuthGuard } from './_guards/auth.guard';
import { MessageComponent } from './sidebarright/message/message.component';
import { AvatarComponent } from './avatar/avatar.component';
import { UseravatarComponent } from './project/quality/useravatar/useravatar.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationItemComponent } from './notification/notification-item/notification-item.component';
import { CellpickerComponent } from './project/matrix/cellpicker/cellpicker.component';
import { InviteComponent } from './project/team/invite/invite.component';
import { OrganizerComponent } from './project/meeting/organizer/organizer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SigninComponent,
    WrapComponent,
    SignupComponent,
    SettingsComponent,
    ProjectComponent,
    LodComponent,
    SidebarComponent,
    SidebarrightComponent,
    ProjectprofileComponent,
    ProjectstageComponent,
    ProjectbimComponent,
    UserComponent,
    ForgetpasswordComponent,
    LoadingComponent,
    SaveTemplateDialog,
    ArchiveDialog,
    ProjectconfComponent,
    TeamComponent,
    MeetingComponent,
    ExpiredComponent,
    UpgradeComponent,
    MatrixComponent,
    QualityComponent,
    MessageComponent,
    AvatarComponent,
    UseravatarComponent,
    NotificationComponent,
    NotificationItemComponent,
    CellpickerComponent,
    InviteComponent,
    OrganizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
    FormsModule,
    HttpClientModule,
    AngularFireStorageModule,
    PickerModule,
    Ng5SliderModule
  ],
  entryComponents: [SaveTemplateDialog, ArchiveDialog],
  providers: [
    ChatService,
    UpgradeService,
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
