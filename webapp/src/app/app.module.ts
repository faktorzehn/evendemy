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
import { MeetingComponent } from './pages/meeting/meeting.component';
import { UsersComponent } from './pages/users/users.component';
import { NamePipe } from './pipes/name.pipe';
import { AuthenticationService } from './services/authentication.service';
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
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MeetingCardComponent } from './components/meeting-card/meeting-card.component';
import { ConfirmDialogContentComponent } from './components/dialog/confirm-dialog-content/confirm-dialog-content.component';
import { TranslocoRootModule } from './transloco-root.module';
import { HammerModule } from '@angular/platform-browser';
import { ProtectedImagePipe } from './pipes/protected-image.pipe';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  { path: 'meetings', component: MeetingListComponent, canActivate: [AuthGuard]},
  { path: 'ideas', component: MeetingListComponent, canActivate: [AuthGuard]},
  { path: 'meeting/:mid', component: MeetingComponent, canActivate: [AuthGuard]},
  { path: 'meeting', component: MeetingComponent, canActivate: [AuthGuard]},
  { path: 'idea/:mid', component: MeetingComponent, canActivate: [AuthGuard]},
  { path: 'idea', component: MeetingComponent, canActivate: [AuthGuard]},
  { path: 'user-info', component: UserInfoComponent, canActivate: [AuthGuard] },
  { path: 'user-info/:username', component: UserInfoComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/meetings', pathMatch: 'full' },
  { path: '**', component: ErrorComponent, canActivate: [AuthGuard] }
];

function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init({
      config: {
        url: 'http://localhost:8090/',
        realm: 'evendemy',
        clientId: 'evendemy'
      },
      initOptions: {
        onLoad: 'login-required',
        redirectUri: 'http://localhost:4200/'//window.location.origin,
      },
      bearerExcludedUrls: [],
      // shouldUpdateToken(request) {
      //   return !request.headers.get('token-update') === false;
      // }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
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
    ConfirmDialogContentComponent,
    ProtectedImagePipe,
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
    TranslocoRootModule,
    KeycloakAngularModule
  ],
  providers: [
    AuthGuard,
    MeetingService,
    MeetingsService,
    UserService,
    AuthenticationService,
    TagsService,
    ConfigService,
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        return new Promise<void>(resolve => {
          resolve();
        });
      },
      deps: [ ConfigService<any> ],
      multi: true,
    }
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
