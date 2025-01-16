import { Object3D, Object3DEventMap } from 'three'

export interface Selectable {
    /**
     * Every selected object recives on click events.
     *
     * @param event The mouse event triggered.
     * @param object The selected object.
     */
    onClick(event: MouseEvent, object: Object3D<Object3DEventMap>): void

    /**
     * @returns All 3D objects to select.
     */
    getObjects(): Object3D<Object3DEventMap>[]
}
