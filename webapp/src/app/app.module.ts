import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from 'ng2-config';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { LoginComponent } from './pages/login/login.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import {LoggedInGuardService} from './services/logged-in-guard.service';
import { Client } from './middleware/client';
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


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'meeting-list/:type', component: EventsOrCoursesComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/:mid', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'meeting/new/:type', component: MeetingComponent, canActivate: [LoggedInGuardService]},
  { path: 'user-info', component: UserInfoComponent, canActivate: [LoggedInGuardService] },
  { path: '', redirectTo: '/meeting-list/course', pathMatch: 'full' },
  { path: '**', component: ErrorComponent, canActivate: [LoggedInGuardService] }
];

export function configFactory() {
    return new ConfigStaticLoader('/config.json'); // PATH || API ENDPOINT
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
    MeetingListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory)
    }),
    StoreModule.forRoot({
      meetings: meetingsReducer,
      selectMeeting: selectMeetingReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  providers: [ LoggedInGuardService, Client, MeetingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
