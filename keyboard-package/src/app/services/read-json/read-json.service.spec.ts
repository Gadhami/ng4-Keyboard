import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA                         } from '@angular/core';

import { Http, Headers, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection                                  } from '@angular/http/testing';

import { ReadJsonService } from 'app/services/read-json/read-json.service';

// =========================================================================
describe('ReadJsonService', () =>
{
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas     : [NO_ERRORS_SCHEMA],
            providers   : [
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

    // beforeEach(() =>
    // {
    //     fixture   = TestBed.createComponent(FaqComponent);
    //     component = fixture.componentInstance;

    //     fixture.detectChanges();
    // });

    // =========================================================================
    it('should return sample data when calling json.load()', async(inject([ReadJsonService, MockBackend],
      (json: ReadJsonService, backend: MockBackend) =>
    {
        const jsonResponse = {
            id      : 1,
            question: 'Test FAQ Question',
            answer  : 'Test FAQ Answer',
        };
        const baseResponse = new Response(new ResponseOptions({
            status: 200,
            body: jsonResponse,
            headers: new Headers({ 'Content-Type' : 'application/json' }),
        }));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));

        json.load('assets/json/caccou-faq.json').then((res: any) =>
        {
            // console.log(res);

            expect(res.id).toBe(jsonResponse.id);
            expect(res.question).toBe('Test FAQ Question');
            expect(res.answer).toBe('Test FAQ Answer');
        });
    })));

    // =========================================================================
    it('should return sample data when subscribing to json.getData()', async(inject([ReadJsonService, MockBackend],
      (json: ReadJsonService, backend: MockBackend) =>
    {
        const jsonResponse = {
            id      : 1,
            question: 'Test FAQ Question',
            answer  : 'Test FAQ Answer',
        };
        const baseResponse = new Response(new ResponseOptions({
            status: 200,
            body: jsonResponse,
            headers: new Headers({ 'Content-Type' : 'application/json' }),
        }));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));

        json.getData('assets/json/caccou-faq.json').subscribe((res: any /*Reponse*/) =>
        {
            // console.log(res);
            // expect(res.text()).toBe('got response');

            expect(res.id).toBe(jsonResponse.id);
            expect(res.question).toBe('Test FAQ Question');
            expect(res.answer).toBe('Test FAQ Answer');
        });
    })));

    // =========================================================================
    it('should return FAQ questions when calling json.load()', async(inject([ReadJsonService, MockBackend],
      (json: ReadJsonService, backend: MockBackend) =>
    {
        const jsonResponse = {
            'generalFAQ'       : [{ 'id': 1, 'question': 'Caccou #1', 'answer': 'Bisou #1' }],
            'privacyFAQ'       : [{ 'id': 2, 'question': 'Caccou #2', 'answer': 'Bisou #2' }],
            'userManagementFAQ': [{ 'id': 3, 'question': 'Caccou #3', 'answer': 'Bisou #3' }],
        };

        const baseResponse = new Response(new ResponseOptions({
            status : 200,
            body   : jsonResponse,
            headers: new Headers({ 'Content-Type' : 'application/json' }),
        }));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));

        json.load('assets/json/caccou-faq.json').then((res: any) =>
        {
            expect(res.generalFAQ[0].id).toBe(1);
            expect(res.generalFAQ[0].question).toBe('Caccou #1');
            expect(res.generalFAQ[0].answer).toBe('Bisou #1');
        });
        // testService.getUsers().subscribe((res: Response) => {
        //     expect(res.text()).toBe('got response');
        // });
    })));
    // =========================================================================
});
