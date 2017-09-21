// Creating the decorator DestroySubscribers
import { Subscriber } from 'rxjs/Subscriber';

export function DestroySubscribers()
{
    return function (target: any)
    {
        // Decorating the function ngOnDestroy
        target.prototype.ngOnDestroy = ngOnDestroyDecorator(target.prototype.ngOnDestroy);

        // Decorator function
        function ngOnDestroyDecorator(f)
        {
            return function ()
            {
                // Saving the result of ngOnDestroy performance to the variable superData
                const superData = f ? f.apply(this, arguments) : null;

                // Unsubscribing
                for (const subscriberKey of Object.keys(this.subscribers))  // in this.subscribers)
                {
                    const subscriber = this.subscribers[subscriberKey];
                    if (subscriber instanceof Subscriber)
                    {
                        subscriber.unsubscribe();
                    }
                }

                // returning the result of ngOnDestroy performance
                return superData;
            };
        }

        // returning the decorated class
        return target;
    };
}
