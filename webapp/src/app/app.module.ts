import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TagInputModule } from 'ngx-chips';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { LoginComponent } from './pages/login/login.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import {LoggedInGuardService} from './services/logged-in-guard.service';
import { EditorComponent } from './components/editor/editor.component';
import { StoreModule } from '@ngrx/store';
import { meetingsReducer } from './reducers/meetings.reducer';
import { MeetingService } from './services/meeting.service';
import { selectMeetingReducer } from './reducers/selectMeeting.reducer';
import { ErrorComponent } from './pages/error/error.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EventsOrCoursesComponent } from './pages/events-or-courses/events-or-courses.component';
import { MeetingListComponent } from './components/meeting-list/meeting-list.component';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { ImageCropperModule } from 'ngx-img-cropper';
import { ConfigModule, ConfigLoader } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { UsersService } from './services/users.service';
import { usersReducer } from './reducers/users.reducer';
import { NamePipe } from './pipes/name.pipe';
import { EvendemyCheckboxComponent } from './components/checkbox/checkbox.component';
import { UserImageComponent } from './components/user-image/user-image.component';
import { UserService } from './services/user.service';
import { UsersComponent } from './pages/users/users.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { AttendeeCardComponent } from './components/attendee-card/attendee-card.component';
import { CommentsComponent } from './components/comments/comments.component';
import { PageComponent } from './components/page/page.component';
import { SummaryCoursesEventsComponent } from './components/summary-courses-events/summary-courses-events.component';
import { AttendeeTableComponent } from './components/attendee-table/attendee-table.component';
import { AuthenticationService } from './services/authentication.service';
import { MeetingsService } from './services/meetings.service';
import { TagsService } from './services/tags.service';
import { TagComponent } from './components/tag/tag.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'meetings', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'ideas', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/new/:type', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'user-info', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: 'user-info/:username', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [LoggedInGuardService]},
  { path: '', redirectTo: '/meeting-list/course', pathMatch: 'full' },
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
    TagComponent
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
