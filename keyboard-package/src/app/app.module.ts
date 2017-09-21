import { BrowserModule } from '@angular/platform-browser';
import { NgModule      } from '@angular/core';
import { HttpModule    } from '@angular/http';

import { AppComponent            } from 'app/components/app/app.component';
import { ScreenKeyboardComponent } from 'app/components/screen-keyboard/screen-keyboard.component';

@NgModule({
    declarations: [
        AppComponent,
        ScreenKeyboardComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
