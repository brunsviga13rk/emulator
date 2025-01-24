import { Object3D, Object3DEventMap } from 'three'

/**
 * Action the user can do, such as pressing buttons on a keyboard or mouse.
 * Each action is mapped to an icon to be displayed.
 * For available options see: https://phosphoricons.com
 */
export enum InputAction {
    LeftClick = 'ph-mouse-left-click',
    RightClick = 'ph-mouse-right-click',
}

/**
 * An input action alongside a telling description of what is does uppon interaction.
 */
export type UserAction = [action: InputAction, description: string]

export interface Selectable {
    /**
     * Every selected object recives on click events.
     *
     * @param event The mouse event triggered.
     * @param object The selected object.
     */
    onClick(event: MouseEvent, object: Object3D<Object3DEventMap>): void

    /**
     * @returns An array of all possible user actions.
     */
    getAvailableUserActions(): UserAction[]

    /**
     * @returns All 3D objects to select.
     */
    getObjects(): Object3D<Object3DEventMap>[]
}
