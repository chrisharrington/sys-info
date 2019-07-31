export default abstract class BaseModule<TInfo> {
    handler: ((info: TInfo) => void) | null;

    constructor(interval: number = 1000) {
        setInterval(async () => {
            this.handler && this.handler(await this.get());
        }, interval);
    }

    protected abstract async get() : Promise<TInfo>;

    on(handler: (info: TInfo) => void) {
        this.handler = handler;
    }
}