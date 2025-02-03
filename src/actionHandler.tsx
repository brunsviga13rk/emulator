export interface ActionHandler {
    /**
     * Perform the next increment.
     *
     * @param delta Time difference to the previous iteration.
     * @returns boolean Whether or not an animation is active.
     */
    perform(delta: number): boolean
}
