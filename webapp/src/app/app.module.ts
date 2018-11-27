import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigLoader, ConfigModule } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-img-cropper';

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
import { MenuComponent } from './components/menu/menu.component';
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
import { selectMeetingReducer } from './reducers/selectMeeting.reducer';
import { usersReducer } from './reducers/users.reducer';
import { AuthenticationService } from './services/authentication.service';
import { LoggedInGuardService } from './services/logged-in-guard.service';
import { MeetingService } from './services/meeting.service';
import { MeetingsService } from './services/meetings.service';
import { TagsService } from './services/tags.service';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';
import { AttendeeStatusComponent } from './components/attendee-status/attendee-status.component';

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

export function configFactory(http: HttpClient): ConfigLoader {
  return new ConfigHttpLoader(http, './config.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
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
    AttendeeStatusComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({
      meetings: meetingsReducer,
      selectMeeting: selectMeetingReducer,
      users: usersReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory),
      deps: [HttpClient]
    }),
    NgxDatatableModule,
    ImageCropperModule,
    TagInputModule
  ],
  providers: [
    LoggedInGuardService,
    MeetingService,
    MeetingsService,
    UserService,
    UsersService,
    AuthenticationService,
    TagsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
