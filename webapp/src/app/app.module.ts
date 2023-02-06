import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AppComponent } from './app.component';
import { AttendeeCardComponent } from './components/attendee-card/attendee-card.component';
import { AttendeeTableComponent } from './components/attendee-table/attendee-table.component';
import { BreadcrumpComponent } from './components/breadcrump/breadcrump.component';
import { EvendemyCheckboxComponent } from './components/checkbox/checkbox.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentsNewComponent } from './components/comments-new/comments-new.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EditorComponent } from './components/editor/editor.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { MeetingListComponent } from './components/meeting-list/meeting-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageComponent } from './components/page/page.component';
import { SummaryCoursesEventsComponent } from './components/summary-courses-events/summary-courses-events.component';
import { TagComponent } from './components/tag/tag.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserImageComponent } from './components/user-image/user-image.component';
import { ErrorComponent } from './pages/error/error.component';
import { EventsOrCoursesComponent } from './pages/deprecated/events-or-courses/events-or-courses.component';
import { LoginComponent } from './pages/login/login.component';
import { MeetingNewComponent } from './pages/meeting-new/meeting-new.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
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
import { faAngleLeft, faBars, faCalendar, faEllipsis, faLocationDot, faTag } from '@fortawesome/free-solid-svg-icons';
import { EditableTextComponent } from './components/editable-text/editable-text.component';
import { MeetingComponent } from './pages/deprecated/meeting/meeting.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { MeetingListNewComponent } from './pages/meeting-list-new/meeting-list-new.component';
import { BaseComponent } from './components/base/base.component';
import { EditableInputComponent } from './components/editable-input/editable-input.component';
import interceptors from './core/http-interceptor';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  
  // deprecated -> replace with new components
  { path: 'meetings', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'ideas', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting', component: MeetingComponent, canActivate: [LoggedInGuardService]},

  { path: 'meetings2', component: MeetingListNewComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting2/:mid', component: MeetingNewComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting2', component: MeetingNewComponent, canActivate: [LoggedInGuardService]},
  { path: 'ideas2', component: MeetingListNewComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea2/:mid', component: MeetingNewComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea2', component: MeetingNewComponent, canActivate: [LoggedInGuardService]},
  
  // deprecated -> replace with new components
  { path: 'idea/:mid', component: MeetingNewComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea', component: MeetingNewComponent, canActivate: [LoggedInGuardService]},

  { path: 'user-info', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: 'user-info/:username', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [LoggedInGuardService]},
  { path: '', redirectTo: '/meetings', pathMatch: 'full' },
  { path: '**', component: ErrorComponent, canActivate: [LoggedInGuardService] }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserInfoComponent,
    LoginComponent,
    MeetingComponent,
    MeetingNewComponent,
    EditorComponent,
    ErrorComponent,
    FooterComponent,
    ConfirmDialogComponent,
    EventsOrCoursesComponent,
    MeetingListComponent,
    ImageUploadDialogComponent,
    NamePipe,
    EvendemyCheckboxComponent,
    UserImageComponent,
    UsersComponent,
    UserCardComponent,
    AttendeeCardComponent,
    CommentsComponent,
    CommentsNewComponent,
    PageComponent,
    SummaryCoursesEventsComponent,
    AttendeeTableComponent,
    TagComponent,
    BreadcrumpComponent,
    MeetingAttendeeStatusComponent,
    IdeaAttendeeStatusComponent,
    SidebarComponent,
    EditableTextComponent,
    ContextMenuComponent,
    MeetingListNewComponent,
    BaseComponent,
    EditableInputComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    // NgxDatatableModule,
    ImageCropperModule,
    TagInputModule,
    FontAwesomeModule
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
  }
}
