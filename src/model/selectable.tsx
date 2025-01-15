import { Object3D, Object3DEventMap } from 'three'

export interface Selectable {
    /**
     * @returns The 3D object to select.
     */
    getObject(): Object3D<Object3DEventMap>
}
