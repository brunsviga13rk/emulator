import { Group, Object3DEventMap } from 'three'
import { Handle } from './handle'
import { DetailPanel } from '../../render/Details'

export class InputResetHandle extends Handle {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'total_deletion_lever', 0, 1.75)
    }

    getDetailPanel(): DetailPanel {
        return new DetailPanel('Clear All', 'Set all registers to zero.')
    }
}
