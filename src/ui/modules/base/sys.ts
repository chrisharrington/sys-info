export default abstract class BaseModule<TInfo> {
    handler: ((info: TInfo) => void) | null;

    constructor(interval: number = 1000) {
        if (this.init)
            this.init();
            
        this.get().then(data => this.handler && this.handler(data));
        setInterval(async () => {
            this.handler && this.handler(await this.get());
        }, interval);
    }

    protected abstract async get() : Promise<TInfo>;
    protected init?() : void;

    on(handler: (info: TInfo) => void) {
        this.handler = handler;
    }
}