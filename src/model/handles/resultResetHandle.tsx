import { Group, Object3DEventMap } from 'three'
import { Handle, HandleEventType } from './handle'
import { Brunsviga13rk } from '../brunsviga13rk'
import {
    AnimationScalarConditon,
    AnimationScalarStateEventType,
    AnimationScalarStatePassedCondition,
} from '../animation'
import { EventHandler } from '../events'
import { DetailPanel } from '../../render/Details'

export class ResultResetHandle extends Handle {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'result_deletionn_lever', 0, 1.4)
    }

    getDetailPanel(): DetailPanel {
        return new DetailPanel('Clear Result', 'Set result register to zero.')
    }

    public registerEventSubscribtions() {
        const delte_handle_animation =
            Brunsviga13rk.getInstance().delete_handle.animationState

        delte_handle_animation.getEmitter().subscribe(
            AnimationScalarStateEventType.StatePassed,
            new EventHandler(
                () => {
                    if (super.animationState.isHalted()) {
                        super.animationState.desync(
                            Brunsviga13rk.getInstance().delete_handle
                                .animationState
                        )
                        this.pushUp()
                    } else {
                        super.animationState.sync(
                            Brunsviga13rk.getInstance().delete_handle
                                .animationState
                        )
                    }
                },
                new AnimationScalarStatePassedCondition(
                    0.7
                ) as AnimationScalarConditon
            )
        )

        Brunsviga13rk.getInstance()
            .delete_handle.getEmitter()
            .subscribe(
                HandleEventType.PushUpDone,
                new EventHandler(() => {
                    // this.pushUp()
                })
            )
    }
}
