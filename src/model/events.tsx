export interface EventBroker<K, E, T> {
    getEmitter(): EventEmitter<K, E, T>
}

export class EventEmitter<K, E, T> {
    private actor!: T
    private eventHandler: { [key: number]: EventHandler<E, T>[] }

    public constructor() {
        this.eventHandler = []
    }

    public setActor(actor: T) {
        this.actor = actor
    }

    public emit(event: K, data: E) {
        this.eventHandler[event as number]?.forEach((handler) =>
            handler.handle(data, this.actor)
        )
    }

    public subscribe(event: K, handler: EventHandler<E, T>) {
        if (!this.eventHandler[event as number])
            this.eventHandler[event as number] = []

        this.eventHandler[event as number].push(handler)
    }
}

export class EventHandler<E, T> {
    protected action: (event: E, actor: T) => void

    public constructor(action: (event: E, actor: T) => void) {
        this.action = action
    }

    public handle(event: E, actor: T) {
        this.action(event, actor)
    }
}
