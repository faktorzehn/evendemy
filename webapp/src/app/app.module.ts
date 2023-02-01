import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AppComponent } from './app.component';
import { AttendeeCardComponent } from './components/attendee-card/attendee-card.component';
import { AttendeeTableComponent } from './components/attendee-table/attendee-table.component';
import { BreadcrumpComponent } from './components/breadcrump/breadcrump.component';
import { EvendemyCheckboxComponent } from './components/checkbox/checkbox.component';
import { CommentsComponent } from './components/comments/comments.component';
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
import { EventsOrCoursesComponent } from './pages/events-or-courses/events-or-courses.component';
import { LoginComponent } from './pages/login/login.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { UsersComponent } from './pages/users/users.component';
import { NamePipe } from './pipes/name.pipe';
import { meetingsReducer } from './reducers/meetings.reducer';
import { usersReducer } from './reducers/users.reducer';
import { AuthenticationService } from './services/authentication.service';
import { LoggedInGuardService } from './services/logged-in-guard.service';
import { MeetingService } from './services/meeting.service';
import { MeetingsService } from './services/meetings.service';
import { TagsService } from './services/tags.service';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';
import { MeetingAttendeeStatusComponent } from './components/attendee-status/meeting-attendee-status/meeting-attendee-status.component';
import { IdeaAttendeeStatusComponent } from './components/attendee-status/idea-attendee-status/idea-attendee-status.component';
import { ConfigService } from './services/config.service';
import { TagInputModule } from 'ngx-chips';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faBars } from '@fortawesome/free-solid-svg-icons';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'meetings', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'ideas', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'idea', component: MeetingComponent, canActivate: [LoggedInGuardService]},
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
    PageComponent,
    SummaryCoursesEventsComponent,
    AttendeeTableComponent,
    TagComponent,
    BreadcrumpComponent,
    MeetingAttendeeStatusComponent,
    IdeaAttendeeStatusComponent,
    SidebarComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({
      meetings: meetingsReducer,
      users: usersReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
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
    UsersService,
    AuthenticationService,
    TagsService,
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: (config: ConfigService<any>) => config.load(), deps: [ConfigService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faBars);
    library.addIcons(faAngleLeft);
  }
}
