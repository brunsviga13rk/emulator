import { LuaFactory } from 'wasmoon'
import { Brunsviga13rk } from '../model/brunsviga13rk'

// Initialize a new lua environment factory
// You can pass the wasm location as the first argument, useful if you are using
// wasmoon on a web environment and want to host the file by yourself.
const factory = new LuaFactory()
// Create a standalone lua environment from the factory.
const lua = await factory.createEngine()

// Wrap singleton API of Brunsviga 13 RK to Lua
// ============================================================================
//

lua.global.set('set', (v: number) => Brunsviga13rk.getInstance().setInput(v))
lua.global.set('add', () => Brunsviga13rk.getInstance().add())
lua.global.set('sub', () => Brunsviga13rk.getInstance().subtract())
lua.global.set('shr', () => Brunsviga13rk.getInstance().shiftLeft())
lua.global.set('shl', () => Brunsviga13rk.getInstance().shiftRight())
lua.global.set('clr', () => Brunsviga13rk.getInstance().clearRegisters())

export function execute(script: string) {
    new Promise(() => lua.doString(script))
}
