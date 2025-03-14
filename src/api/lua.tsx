import { Instruction } from '../instruction'
import Worker from './luaWorker.tsx?worker'

const worker = new Worker()

worker.onmessage = async (e: MessageEvent) => {
    new Instruction(e.data.instruction.opcode, e.data.instruction.value)
        .execute()
        .then(() => worker.postMessage({ kind: 'API Call Returned' }))
}

export function execute(script: string) {
    worker.postMessage({ kind: 'Run Script', script: script })
}
