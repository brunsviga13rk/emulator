export interface Conditional {
    compare(this: Conditional, other: Conditional): boolean
}

export class Tautology implements Conditional {
    compare(): boolean {
        return true
    }
}

export interface EventBroker<K, E, T, C extends Conditional = Tautology> {
    getEmitter(): EventEmitter<K, E, T, C>
}

export class EventEmitter<K, E, T, C extends Conditional = Tautology> {
    private actor!: T
    private eventHandler: { [key: number]: EventHandler<E, T, C>[] }

    public constructor() {
        this.eventHandler = []
    }

    public setActor(actor: T) {
        this.actor = actor
    }

    public emit(event: K, data: E, condition: C | undefined = undefined) {
        this.eventHandler[event as number]?.forEach((handler) =>
            handler.handle(data, condition, this.actor)
        )
    }

    public subscribe(event: K, handler: EventHandler<E, T, C>) {
        if (!this.eventHandler[event as number])
            this.eventHandler[event as number] = []

        this.eventHandler[event as number].push(handler)
    }

    public unsubscribe(event: K, handler: EventHandler<E, T, C>) {
        this.eventHandler[event as number] = this.eventHandler[
            event as number
        ].filter((h) => h != handler)
    }

    public getEventsByHandler(event: K): EventHandler<E, T, C>[] {
        if (this.eventHandler[event as number] == undefined) return []

        return this.eventHandler[event as number]
    }
}

export type EventAction<E, T, C extends Conditional = Tautology> = (
    event: E,
    actor: T,
    condition: C | undefined
) => void

export class EventHandler<E, T, C extends Conditional = Tautology> {
    protected condition: C | undefined
    protected action: EventAction<E, T, C>

    public constructor(
        action: EventAction<E, T, C>,
        condition: C | undefined = undefined
    ) {
        this.action = action
        this.condition = condition
    }

    public handle(event: E, condition: C | undefined, actor: T) {
        if (this.condition != undefined) {
            if (condition == undefined)
                throw new Error('condition shall not be undefined')

            if (!this.condition.compare(condition)) return
        }

        this.action(event, actor, condition)
    }
}
