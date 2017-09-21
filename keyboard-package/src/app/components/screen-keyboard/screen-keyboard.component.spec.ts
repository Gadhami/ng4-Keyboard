import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA                         } from '@angular/core';
import { RouterTestingModule                      } from '@angular/router/testing';

import { Http, Headers, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection                                  } from '@angular/http/testing';

import { ScreenKeyboardComponent } from './screen-keyboard.component';
// import { NotificationService     } from 'app/services/notification.service';
// import { MockNotificationService } from 'app/mocks/notification-service.mock';
import { ReadJsonService         } from 'app/services/read-json/read-json.service';
// import { RepoService             } from 'app/services/repository/repository.service';
// import { MockAuthToken           } from 'app/mocks/token-service.mock';
// import { AuthToken               } from 'app/services/auth-service/token.service';
// import { SoundService            } from 'app/services/sound.service';
// import { MockSoundService        } from 'app/mocks/sound-service.mock';

// =========================================================================
describe('ScreenKeyboardComponent', () =>
{
    let component: ScreenKeyboardComponent;
    let fixture  : ComponentFixture<ScreenKeyboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports     : [RouterTestingModule],
            declarations: [ScreenKeyboardComponent],
            providers   : [
                // { provide: NotificationService, useClass: MockNotificationService },
                // { provide: AuthToken,           useClass: MockAuthToken           },
                // { provide: SoundService,        useClass: MockSoundService        },
                // RepoService,
                ReadJsonService,
                BaseRequestOptions,
                MockBackend,
                {
                    provide   : Http,
                    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps      : [MockBackend, BaseRequestOptions],
                },
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture   = TestBed.createComponent(ScreenKeyboardComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    // =========================================================================
    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    // =========================================================================
    // Make sure lesson text is shown correctly
    it('should render keyboard buttons', async(() =>
    {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelectorAll('span.btn').length).toBeGreaterThan(100);
    }));
    // =========================================================================
});
