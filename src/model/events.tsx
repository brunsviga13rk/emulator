/**
 * Publish- ('emit') Subcribe-Model for conditional event based processing.
 *
 * ```
 * ┌─────────────┐
 * │ Handler     │
 * │┌───────────┐│
 * ││Conditional││
 * │└───────────┘│
 * └─────┬───────┘    ┌──────────┐
 *       │            │ Emitter  │
 *       └───────────►│          │
 *       subscribe    │          │
 *                    └────┬─────┘
 *                         │ retrieve handler
 *                         │                      perform event handler
 * ┌─────────────┐         └──────►┌──────────┐     ┌─────────────┐
 * │ Event       ├────────────────►│Conditonal├────►│ Handler     │
 * │┌───────────┐│      trigger    └──────────┘true └─────────────┘
 * ││Conditional││
 * │└───────────┘│
 * └─────────────┘
 * ```
 */

/**
 * Handler for events may only perform when a certain condition is met.
 * Therefore a conditional compares a desired state against the state provided
 * by the event. A comparison determines whether or the event actually triggers
 * the handler.
 */
export interface Conditional {
    compare(this: Conditional, other: Conditional): boolean
}

/**
 * Default implementation for event conditonals. Events subscribed with a
 * tautology conditional will always be triggered by the subscribed event.
 */
export class Tautology implements Conditional {
    compare(): boolean {
        return true
    }
}

/**
 * Broker are classes that implement or wrap event emitter that can
 * be subscribed to.
 *
 * Explanation of the generics:
 * ```
 *  ┌─────────────┬───────────────────────────────────┐
 *  │Generic      │Description                        │
 *  ├─────────────┼───────────────────────────────────┤
 *  │K (key)      │Type of events that can be emitted │
 *  ├─────────────┼───────────────────────────────────┤
 *  │E (event)    │Event content                      │
 *  ├─────────────┼───────────────────────────────────┤
 *  │T (type)     │Object that emitted the event      │
 *  ├─────────────┼───────────────────────────────────┤
 *  │C (condition)│Condition types for each event     │
 *  └─────────────┴───────────────────────────────────┘
 *  ```
 */
export interface EventBroker<K, E, T, C extends Conditional = Tautology> {
    getEmitter(): EventEmitter<K, E, T, C>
}

/**
 * Used to trigger events on registered handlers.
 * Event handlers can subscribe to any of the events specified in event types.
 * Any event types can have unlimited amounts of handlers associated.
 */
export class EventEmitter<K, E, T, C extends Conditional = Tautology> {
    private actor!: T
    private eventHandler: { [key: number]: EventHandler<E, T, C>[] }

    public constructor() {
        this.eventHandler = []
    }

    /**
     * Set the object emitting objects used to be referenced by events.
     * @param actor
     */
    public setActor(actor: T) {
        this.actor = actor
    }

    /**
     * Emit event to all registered handlers.
     *
     * @param event The type of event to emit.
     * @param data Event data to transfer.
     * @param condition Condition the event is emitted on.
     */
    public emit(event: K, data: E, condition: C | undefined = undefined) {
        this.eventHandler[event as number]?.forEach((handler) =>
            handler.handle(data, condition, this.actor)
        )
    }

    /**
     * Subscribe event handler to a specific type of event.
     *
     * @param event The event to trigger handler on.
     * @param handler
     */
    public subscribe(event: K, handler: EventHandler<E, T, C>) {
        if (!this.eventHandler[event as number])
            this.eventHandler[event as number] = []

        this.eventHandler[event as number].push(handler)
    }

    /**
     * Stop an event handler from recieving events.
     *
     * @param event Type of event the handler is registered at.
     * @param handler
     */
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

/**
 * Action being performed by an event handler when triggered.
 */
export type EventAction<E, T, C extends Conditional = Tautology> = (
    event: E,
    actor: T,
    condition: C | undefined
) => void

/**
 * Binds an actions to a specific event type.
 * Uppon being triggerd throug `handle()` the provided contional
 * determines whether or not the action should be performed on the event.
 */
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
        // If no conditon is provided the action is always executed.
        if (this.condition != undefined) {
            // Events must have a defined condition.
            if (condition == undefined)
                throw new Error('condition shall not be undefined')

            // In case the conditon is not met, return without executing action.
            if (!this.condition.compare(condition)) return
        }

        // Run event action asynchronously.
        new Promise(() => this.action(event, actor, condition))
    }
}
