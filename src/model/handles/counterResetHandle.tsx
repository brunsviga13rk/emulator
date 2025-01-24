import { Group, Object3DEventMap } from 'three'
import { Handle, HandleEventType } from './handle'
import { Brunsviga13rk } from '../brunsviga13rk'
import { EventHandler } from '../events'

export class CounterResetHandle extends Handle {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'count_deletion_lever', -0.5, -2)
    }

    public registerEventSubscribtions() {
        Brunsviga13rk.getInstance()
            .delete_handle.getEmitter()
            .subscribe(
                HandleEventType.PullDown,
                new EventHandler(() => this.pullDown())
            )
    }
}
