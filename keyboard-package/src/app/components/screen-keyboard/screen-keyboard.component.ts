import {
    Component, OnInit, OnDestroy, Input, Renderer2, ViewChild, ElementRef
} from '@angular/core';

// Read Keyboard Layout
import { ReadJsonService     } from 'app/services/read-json/read-json.service';

// Beep!
// import { SoundService         } from 'app/services/sound.service';

// Notification service used to alert other components of changes & act upon it
// import { NotificationService } from 'app/services/notification.service';

// Interfaces
// import { IOptions            } from 'app/interfaces/options';

// Component Decorators
import { DestroySubscribers  } from 'app/decorators/destroy-subscribers';

// import * as consts    from 'app/consts';              // Import global constants
import * as keyConsts from 'app/consts/key-codes';    // Import Key Code constants

@Component({
    selector   : 'app-screen-keyboard',
    templateUrl: './screen-keyboard.component.html',
    styleUrls  : ['./screen-keyboard.component.css'],
    providers  : [ReadJsonService]
})
@DestroySubscribers()
export class ScreenKeyboardComponent implements OnInit, OnDestroy
{
    public subscribers: any = {};

    keys        : any;
    enterKeyCSS = '';

    @Input() keyboardLayoutUrl = 'assets/json/keyboard/';  // 'https://website.com/assets/json/keyboard/';
    @Input() keyboardLayout    = 'qwerty';

    @Input() errorColor        = '#ffaaaa';
    @Input() okColor           = '#07ad07';


    // ====================
    // Keyboard Options (with default values)
    // ====================
    // options          : IOptions = consts.defOptions;


    // ====================
    // Event listeners
    // ====================
    keyDownListener  : any;
    keyUpListener    : any;
    clickListener    : any;
    operaBlueListener: any;

    keyboardIsActive  = true;
    keyboardIsVisible = true;


    // ====================
    // Keyboard UI Elements
    // ====================
    @ViewChild('keyboardInput') keyboardInput: ElementRef;

    lastKey         = -1;

    // =========================================================================
    constructor(  // private notif: NotificationService,
                private json: ReadJsonService,
                private renderer: Renderer2
    )
    { }

    // =========================================================================
    ngOnInit()
    {
        // Setup required subscriptions:
        this.manageSubscriptions();

        // Load Keyboard Layout
        this.loadKeyboardLayout();

        // Initialize event listening & enable keyboard
        this.enableKeyboard();
    }

    // =========================================================================
    loadKeyboardLayout()
    {
        this.json.load(this.keyboardLayoutUrl + this.keyboardLayout + '.json')
                .then((data: any) =>
                {
                    this.keys = data.keys;

                    switch (true)
                    {
                        case this.keys.Pound !== '':
                            this.enterKeyCSS = 'german';
                            break;

                        case !this.keys.pipe:
                            this.enterKeyCSS = 'polygone';
                            break;

                        default:
                            this.enterKeyCSS = '';
                            break;
                    }
                })
                .catch(() => {
                    console.log('Error while loading keyboard layout!');
                    // this.keys = qwerty_kb;
                });
    }

    // =========================================================================
    private enableKeyboard()
    {
        this.keyboardIsActive = true;

        // re-enable event listeners
        if (this.keyDownListener)
        {
            // First make sure you don't add listeners twice!
            this.removeEventListeners();
        }
        this.initializeEventListeners();

        // Focus Keyboard <input>
        this.keyboardInput.nativeElement.focus();
    }

    // =========================================================================
    private disableKeyboard()
    {
        this.keyboardIsActive = false;

        // Remove event listeners
        this.removeEventListeners();
    }

    // =========================================================================
    private removeEventListeners()
    {
        // Remove listeners
        this.keyDownListener();
        this.keyUpListener();
        this.clickListener();
        this.operaBlueListener();
    }

    // =========================================================================
    private initializeEventListeners()
    {
        // Workaround for Opera which doesn't allow cancelling Tab, IE/Apps
        this.operaBlueListener = this.renderer.listen(this.keyboardInput.nativeElement, 'blur', (evt) =>
        {
            // evt.queryKeyCap()  gives the key according to active keyboard layout
            if (this.lastKey === 0x09 || this.lastKey === 0x5D) {
                // this.kbInputFocus.focusElement();  // keyboardInput.focus();
                this.keyboardInput.nativeElement.focus();
            }
            this.lastKey     = -1;
        });

        this.keyDownListener = this.renderer.listen(this.keyboardInput.nativeElement, 'keydown', (evt) => {
            this.onKeyDown(evt);
        });

        this.keyUpListener   = this.renderer.listen(this.keyboardInput.nativeElement, 'keyup', (evt) => {
            this.onKeyUp(evt);
        });

        this.clickListener   = this.renderer.listen('document', 'click', () =>
        {
            // this.kbInputFocus.focusElement();  // keyboardInput.focus();
            this.keyboardInput.nativeElement.focus();
        });
    }

    // =========================================================================
    onKeyDown(evt)
    {
        // Make sure key is relevent (ie. not Escapce, Win., F5, etc...)
        if (keyConsts.silentKeys.indexOf(evt.keyCode) !== -1) {
            return;
        }

        this.lastKey        = evt.keyCode;
        // const correctLetter = this.activeLetter;

        // Wrap in a try-catch as Ctrl+V may cause issues
        try
        {
            const elem = this.select(evt).values().next().value;
            // this.select(evt).forEach(
            //     (elem) =>
            //     {
                    let pressedLetter = evt.key.toLowerCase();
                    if (elem && pressedLetter === 'process')
                    {
                        pressedLetter = elem.getAttribute('data-key');
                    }

                    this.newKeystroke(pressedLetter);

                    // Green if key is OK, red otherwise
                    // if (pressedLetter === correctLetter) {            // if (evt.key === correctLetter) {
                    //     this.renderer.setStyle(elem, 'background', this.okColor);
                    // }
                    // else
                    // {
                    //     this.renderer.setStyle(elem, 'background', this.errorColor);
                    // }
            //     }
            // );
        } catch (error) {
            //
        }
    }

    // =========================================================================
    onKeyUp(evt)
    {
        // Make sure key is relevent (ie. not Escapce, Win., F5, etc...)
        if (keyConsts.silentKeys.indexOf(evt.keyCode) !== -1) {
            return;
        }

        if (this.lastKey === evt.keyCode) { this.lastKey = -1; }

        // Wrap in a try-catch as Ctrl+V may cause issues
        try
        {
            const that = this;
            this.select(evt).forEach(
                (elem) =>
                {
                    setTimeout(function() {
                        that.renderer.removeStyle(elem, 'background');
                    }, 50);
                }
            );
        } catch (error) {
            //
        }
    }

    // =========================================================================
    select(event)
    {
        let key      = event.key.toUpperCase();
        if (key === 'dead') { key = '^'; }
        let elements = document.querySelectorAll('span[data-key="' + key + '"]');
        if (!elements || elements.length === 0)
        {
            key      = event.code;
            elements = document.querySelectorAll('.' + key);
        }

        if (elements !== null) {
            return [].map.call(elements, function(x) { return x; });
        }
        else {
            return;
        }

        // Can't override |location| on KeyboardEvent in some browsers, so it
        // may be wrong, e.g. NumLock in moz-mac
    }

    // =========================================================================
    newKeystroke(NewLetter)
    {
        // How to detect keystrokes http://stackoverflow.com/a/23377822/1165880

        // Validate typed character, record typing speed & update stats

        // if (this.options.enableSound)
        // {
        //     this.sound.playKeystoke();
        // }
    }

    // =========================================================================
    manageSubscriptions()
    {
        // Show stats / modal dialogs, if/when asked to:

        const that = this;

        // ========================
        // 1. Manage *Requests*
        // ========================

        // this.subscribers.statsRequested    = this.notif.statsRequested$.subscribe(()   =>
        // {
        //     // Debug is calling to simulate stats:
        //     this.disableKeyboard();
        // });

        // this.subscribers.optionsRequested  = this.notif.optionsRequested$.subscribe(() =>
        // {
        //     this.disableKeyboard();
        // });


        // ========================
        // Manage *Updates*
        // ========================

        // this.subscribers.keyboardActivated = this.notif.keyboardActivated$.subscribe(() =>
        // {
        //     // re-initialize event listening & enable keyboard
        //     this.enableKeyboard();
        // });

        // Move to the next lesson, if/when asked to:
        // this.subscribers.lessonChanged     = this.notif.lessonChanged$.subscribe(
        //     (goToNextLesson: boolean) =>
        //     {
        //         this.enableKeyboard();
        //         this.newLesson(goToNextLesson);
        //     });

        // Update options local variables, if/when asked to:
        // this.subscribers.optionsUpdated    = this.notif.optionsUpdated$.subscribe(
        //     (newOptions: IOptions) =>
        //     {
        //         const reloadKeyboard = (that.options.keyboardLayout !== newOptions.keyboardLayout);
        //         that.options         = newOptions;

        //         if (reloadKeyboard)
        //         {
        //             // Keyboard layout changed, update on-screen keyboard layout
        //             this.loadKeyboardLayout();
        //         }
        //     }
        // );
    }

    // =========================================================================
    showKeyboard(lessonText: string)
    {
        // Show / activate keyboard again

        this.lastKey         = -1;
        this.keyboardIsVisible = true;
    }

    // =========================================================================
    ngOnDestroy()
    {
        // Remove listeners
        this.disableKeyboard();
    }
    // =========================================================================
}
