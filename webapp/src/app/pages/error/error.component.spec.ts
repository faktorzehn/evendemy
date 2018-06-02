import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../middleware/client';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule, ConfigService } from '@ngx-config/core';
import { StoreModule } from '@ngrx/store';
import { ConfigLoader } from '@ngx-config/core';
import { ConfigStaticLoader } from '@ngx-config/core';


export function configFactory(): ConfigLoader {
  return new ConfigStaticLoader({
    backend_url: ''
  });
}

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    const configStub = {
      getSettings: function() {
        return { backend_url: ''}
      }
    };

    TestBed.configureTestingModule({
      declarations: [ ErrorComponent, MenuComponent ],
      imports: [RouterTestingModule.withRoutes([]), StoreModule.forRoot({ }),  HttpClientModule],
      providers: [Client, {provide: ConfigService, useValue: configStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
