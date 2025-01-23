import { Group, Object3DEventMap } from 'three'
import { Handle } from './handle'

export class ResultResetHandle extends Handle {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'result_deletionn_lever', -1, 0.5)
    }

    public registerEventSubscribtions() {}
}
