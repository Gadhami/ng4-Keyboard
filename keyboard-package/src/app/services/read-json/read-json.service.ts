import { Injectable     } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/Rx';

@Injectable()
export class ReadJsonService
{
    constructor(private _http: Http) { }

    // =========================================================================
    getData(FileName: string)
    {
        return this._http.get(FileName)
            .map((res: Response) => res.json());
    }

    // =========================================================================
    load(FileName: string)
    {
        return new Promise(resolve => {
            this._http.get(FileName).subscribe(response => {
                resolve(response.json());
            });
        });
    }
    // =========================================================================
}
