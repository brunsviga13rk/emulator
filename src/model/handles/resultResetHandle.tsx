import { Group, Object3DEventMap } from 'three'
import { Handle } from './handle'
import { Brunsviga13rk } from '../brunsviga13rk'
import {
    AnimationScalarStateCondition,
    AnimationScalarStateEventType,
} from '../animation'
import { EventHandler } from '../events'

export class ResultResetHandle extends Handle {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'result_deletionn_lever', -1, 0.5)
    }

    public registerEventSubscribtions() {
        Brunsviga13rk.getInstance()
            .delete_handle.animationState.getEmitter()
            .subscribe(
                AnimationScalarStateEventType.StatePassed,
                new EventHandler(
                    () => this.pullDown(),
                    new AnimationScalarStateCondition(1)
                )
            )
    }
}
