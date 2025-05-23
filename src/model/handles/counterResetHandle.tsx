import { Group, Object3DEventMap } from 'three'
import { Handle, HandleEventType } from './handle'
import { Brunsviga13rk } from '../brunsviga13rk'
import { EventHandler } from '../events'

/**
 * Lever used to reset the counter register.
 */
export class CounterResetHandle extends Handle {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'count_deletion_lever', 0, 1.75)
    }

    public registerEventSubscribtions() {
        // Pull this one down in case the genral deletion lever is triggered.
        Brunsviga13rk.getInstance()
            .delete_handle.getEmitter()
            .subscribe(
                HandleEventType.PullDown,
                new EventHandler(() => this.pullDown())
            )
    }

    public pullDown() {
        if (Brunsviga13rk.getInstance().switch.isResetBoth()) {
            Brunsviga13rk.getInstance().input_sprocket.reset()
        }

        super.pullDown()
    }
}
