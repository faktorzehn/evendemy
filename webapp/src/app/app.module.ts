import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AppComponent } from './app.component';
import { AttendeeCardComponent } from './components/attendee-card/attendee-card.component';
import { AttendeeTableComponent } from './components/attendee-table/attendee-table.component';
import { BreadcrumpComponent } from './components/breadcrump/breadcrump.component';
import { EvendemyCheckboxComponent } from './components/checkbox/checkbox.component';
import { CommentsComponent } from './components/comments/comments.component';
import { EditorComponent } from './components/editor/editor.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageUploadDialogContentComponent } from './components/image-upload-dialog-content/image-upload-dialog-content.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TagComponent } from './components/tag/tag.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserImageComponent } from './components/user-image/user-image.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { UsersComponent } from './pages/users/users.component';
import { NamePipe } from './pipes/name.pipe';
import { AuthenticationService } from './services/authentication.service';
import { LoggedInGuardService } from './services/logged-in-guard.service';
import { MeetingService } from './services/meeting.service';
import { MeetingsService } from './services/meetings.service';
import { TagsService } from './services/tags.service';
import { UserService } from './services/user.service';
import { MeetingAttendeeStatusComponent } from './components/attendee-status/meeting-attendee-status/meeting-attendee-status.component';
import { IdeaAttendeeStatusComponent } from './components/attendee-status/idea-attendee-status/idea-attendee-status.component';
import { ConfigService } from './services/config.service';
import { TagInputModule } from 'ngx-chips';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faBars, faCalendar, faClose, faEllipsis, faLocationDot, faTag, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { EditableTextComponent } from './components/editable-text/editable-text.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { MeetingListComponent } from './pages/meeting-list/meeting-list.component';
import { BaseComponent } from './components/base/base.component';
import { EditableInputComponent } from './components/editable-input/editable-input.component';
import interceptors from './core/http-interceptor';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MeetingCardComponent } from './components/meeting-card/meeting-card.component';
import { ConfirmDialogContentComponent } from './components/dialog/confirm-dialog-content/confirm-dialog-content.component';
import { TranslocoRootModule } from './transloco-root.module';
import { HammerModule } from '@angular/platform-browser';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'meetings', component: MeetingListComponent, canActivate: [LoggedInGuardService]},
  { path: 'ideas', component: MeetingListComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'user-info', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: 'user-info/:username', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [LoggedInGuardService]},
  { path: 'settings', component: SettingsComponent, canActivate: [LoggedInGuardService] },
  { path: '', redirectTo: '/meetings', pathMatch: 'full' },
  { path: '**', component: ErrorComponent, canActivate: [LoggedInGuardService] }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    MeetingComponent,
    EditorComponent,
    ErrorComponent,
    FooterComponent,
    MeetingListComponent,
    ImageUploadDialogContentComponent,
    NamePipe,
    EvendemyCheckboxComponent,
    UserImageComponent,
    UsersComponent,
    UserCardComponent,
    AttendeeCardComponent,
    CommentsComponent,
    AttendeeTableComponent,
    TagComponent,
    BreadcrumpComponent,
    MeetingAttendeeStatusComponent,
    IdeaAttendeeStatusComponent,
    SidebarComponent,
    EditableTextComponent,
    ContextMenuComponent,
    MeetingListComponent,
    SettingsComponent,
    MeetingCardComponent,
    BaseComponent,
    EditableInputComponent,
    UserInfoComponent,
    DialogComponent,
    ConfirmDialogContentComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HammerModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    // NgxDatatableModule,
    ImageCropperModule,
    TagInputModule,
    FontAwesomeModule,
    TranslocoRootModule
  ],
  providers: [
    LoggedInGuardService,
    MeetingService,
    MeetingsService,
    UserService,
    AuthenticationService,
    TagsService,
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: (config: ConfigService<any>) => config.load(), deps: [ConfigService], multi: true},
    [...interceptors]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBars);
    library.addIcons(faAngleLeft);
    library.addIcons(faCalendar);
    library.addIcons(faLocationDot);
    library.addIcons(faTag);
    library.addIcons(faEllipsis);
    library.addIcons(faClose);
    library.addIcons(faTriangleExclamation);
  }
}
