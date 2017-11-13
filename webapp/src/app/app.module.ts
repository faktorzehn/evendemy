import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from 'ng2-config';

import { AppComponent } from './app.component';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { MenuComponent } from './menu/menu.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { MeetingComponent } from './meeting/meeting.component';
import {LoggedInGuardService} from './services/logged-in-guard.service';
import { Client } from './middleware/client';
import { EditorComponent } from './editor/editor.component';
import { StoreModule } from '@ngrx/store';
import { meetingsReducer } from './reducers/meetings.reducer';
import { MeetingService } from './services/meeting.service';
import { selectMeetingReducer } from './reducers/selectMeeting.reducer';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'meeting-list/:type', component: MeetingListComponent, canActivate: [LoggedInGuardService]},
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
    MeetingListComponent,
    MenuComponent,
    UserInfoComponent,
    LoginComponent,
    MeetingComponent,
    EditorComponent,
    ErrorComponent,
    FooterComponent
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
