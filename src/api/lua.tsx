import { LuaFactory } from 'wasmoon'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import luaAPI from './api.lua?raw'

const TS_API_NAME = `ts_api_get_${__APP_VERSION__}`.replace(/\./g, '_')

// Initialize a new lua environment factory
// You can pass the wasm location as the first argument, useful if you are using
// wasmoon on a web environment and want to host the file by yourself.
const factory = new LuaFactory()

// Mount accessible Brunsviga 13 RK Lua API as module.
factory.mountFile('./api.lua', luaAPI)

// Create a standalone lua environment from the factory.
const lua = await factory.createEngine({ injectObjects: true })

// Wrap singleton API of Brunsviga 13 RK to Lua
// ============================================================================
//

/**
 * Wrapper API for static Brunsviga Typescript API tied in with animaiton.
 * The purpose of this class is to hide all functions and accessors of the TS
 * API undesired in the Lua API. All API calls are asynchronous and must be
 * awaited in order to preserve the correct state of the machine.
 */
class Brunsviga13rkLuaAPI {
    private _instance = Brunsviga13rk.getInstance()

    public async load(value: number) {
        await this._instance.setInput(value)
    }

    public async add() {
        await this._instance.add()
    }

    public async subtract() {
        await this._instance.subtract()
    }

    public async reset() {
        await this._instance.clearRegisters()
    }

    public async zero_counter_register() {
        await this._instance.clearCounterRegister()
    }

    public async zero_input_register() {
        await this._instance.clearInputRegister()
    }

    public async zero_result_register() {
        await this._instance.clearOutputRegister()
    }

    public async shift_left() {
        await this._instance.shiftLeft()
    }

    public async shift_right() {
        await this._instance.shiftRight()
    }
}

lua.global.set(TS_API_NAME, () => new Brunsviga13rkLuaAPI())

export function execute(script: string) {
    new Promise(() => lua.doString(script))
}
