import luaAPI from './api.lua?raw'
import { LuaEngine, LuaEventMasks, LuaFactory, LuaState } from 'wasmoon'

const TS_API_NAME = `ts_api_get_0_0_2`

// Initialize a new lua environment factory
// You can pass the wasm location as the first argument, useful if you are using
// wasmoon on a web environment and want to host the file by yourself.
const factory = new LuaFactory()

// Mount accessible Brunsviga 13 RK Lua API as module.
factory.mountFile('./api.lua', luaAPI)

// Create a standalone lua environment from the factory.
factory.createEngine({ injectObjects: true }).then((engine) => setup(engine))

function setup(luaEngine: LuaEngine) {
    luaEngine.global.set(TS_API_NAME, () => new Brunsviga13rkLuaAPI())

    luaEngine.global.set(
        'sleep',
        (length: number) =>
            new Promise((resolve) => setTimeout(resolve, length))
    )

    const debugHookFunction = luaEngine.global.lua.module.addFunction(
        debugHook,
        'vii'
    )

    // Register debug hook function to trigger on every line.
    luaEngine.global.lua.lua_sethook(
        luaEngine.global.address,
        debugHookFunction,
        LuaEventMasks.Line,
        0
    )

    // Wrap singleton API of Brunsviga 13 RK to Lua
    // ============================================================================
    //

    /**
     * Return control to the scheduler allowing other tasks to run.
     * Required in order not to block other tasks when waiting in a polling spin lock.
     *
     * @returns
     */
    const yieldAsync = async () =>
        await new Promise((resolve) => setTimeout(resolve, 0))

    const waitLockMap = new Map<string, boolean>()

    /**
     * Wait until a lock with a specific name has been disengaged.
     * Waiting works by polling the current value and yielding exectuion time
     * to the scheduler in case the lock holds.
     *
     * @param name of the lock.
     */
    async function engangeWaitLock(name: string) {
        waitLockMap.set(name, true)

        while (waitLockMap.get(name)) await yieldAsync()
    }

    /**
     * Wrapper API for static Brunsviga Typescript API tied in with animaiton.
     * The purpose of this class is to hide all functions and accessors of the TS
     * API undesired in the Lua API. All API calls are asynchronous and must be
     * awaited in order to preserve the correct state of the machine.
     */
    class Brunsviga13rkLuaAPI {
        engangeWaitLockAPI = async () => await engangeWaitLock('apilock')

        public async load(value: number) {
            postMessage({ instruction: { opcode: 3, value: value } })

            await this.engangeWaitLockAPI()
        }

        public async add() {
            postMessage({ instruction: { opcode: 1, value: undefined } })

            await this.engangeWaitLockAPI()
        }

        public async subtract() {
            postMessage({ instruction: { opcode: 2, value: undefined } })

            await this.engangeWaitLockAPI()
        }

        public async reset() {
            postMessage({ instruction: { opcode: 4, value: undefined } })

            await this.engangeWaitLockAPI()
        }

        public async zero_counter_register() {}

        public async zero_input_register() {}

        public async zero_result_register() {
            postMessage({ instruction: { opcode: 0, value: undefined } })

            await this.engangeWaitLockAPI()
        }

        public async shift_left() {
            postMessage({ instruction: { opcode: 5, value: undefined } })

            await this.engangeWaitLockAPI()
        }

        public async shift_right() {
            postMessage({ instruction: { opcode: 6, value: undefined } })

            await this.engangeWaitLockAPI()
        }

        public get_counter(): number {
            return 0
        }

        public get_input(): number {
            return 0
        }

        public get_result(): number {
            return 0
        }
    }

    /**
     * Append a single unsigned byte to the array.
     * This function does not work inplace. The array with the new byte
     * appended is returned.
     *
     * @param original
     * @param number
     * @returns new array with the byte appended.
     */
    function appendNumberToUint8Array(
        original: Uint8Array,
        number: number
    ): Uint8Array {
        // Check if number is a valid unsigned integer.
        if (number < 0 || number > 255 || !Number.isInteger(number)) {
            throw new Error('Number must be an integer between 0 and 255')
        }

        const newArray = new Uint8Array(original.length + 1)
        newArray.set(original, 0)
        newArray[original.length] = number
        return newArray
    }

    /**
     * Read all bytes of a null terminated C-string at the position denoted by pointer
     * from the byte indexed heap. It is assumed that the string is null terminated.
     * The string is assumed to be encoded in UTF-8.
     * Reading of what is assumed to be the string's bytes is capped at a maximum of
     * 256 bytes or the end of the heap.
     *
     * @param pointer
     * @param heap
     */
    function loadCString(
        pointer: number,
        heap: Uint8Array<ArrayBufferLike>
    ): string | undefined {
        /**
         * Maximum length of C string used to prevent reading the entire heap.
         */
        const C_STRING_MAX_LENGTH = 256
        /**
         * Encoding of C string. Set to be the gold web standard.
         * Long live Unicode!
         */
        const C_STRING_ENCODING = 'utf-8'

        // Buffer individual bytes read.
        let nameBuffer = new Uint8Array([])
        for (let i = 0; i < C_STRING_MAX_LENGTH; i++) {
            // In case of reaching the buffer end return undefined.
            if (pointer + i >= heap.length) return undefined

            const character = heap[pointer + i]

            // Null byte encountered, end of string reached.
            if (character == 0) {
                break
            }

            nameBuffer = appendNumberToUint8Array(nameBuffer, character)
        }

        return new TextDecoder(C_STRING_ENCODING).decode(nameBuffer)
    }

    function debugHook(address: LuaState, debugPointer: number) {
        if (!luaEngine) return

        // Get information about current line.
        luaEngine.global.lua.lua_getinfo(address, 'nSltu', debugPointer)

        // Memory layout of the Debug "C" struct.
        // See: https://www.lua.org/manual/5.3/manual.html#4.9
        // Declaration of the struct used below as reference of memory
        // layout:
        //
        // typedef struct lua_Debug {      /* flag | offset */
        //     int event;                  /*      | 0      */
        //     const char *name;           /* (n)  | 4      */
        //     const char *namewhat;       /* (n)  | 8      */
        //     const char *what;           /* (S)  | 12     */
        //     const char *source;         /* (S)  | 16     */
        //     int currentline;            /* (l)  | 20     */
        //     int linedefined;            /* (S)  | 24     */
        //     int lastlinedefined;        /* (S)  | 28     */
        //     unsigned char nups;         /* (u)  | 32     */
        //     unsigned char nparams;      /* (u)  | 31     */
        //     char isvararg;              /* (u)  | 32     */
        //     char istailcall;            /* (t)  | 33     */
        //     char short_src[LUA_IDSIZE]; /* (S)  | 34     */
        //     /* private part */
        //     other fields
        // } lua_Debug;
        //
        // INFO: For all the below decoding I assume the `int` data type to
        // have a length of 4 bytes.

        // NOTE: the top level script has a name of "emsc"
        // a short form of the Emscripten C compiler used by wasmoon
        // to compile the Lua VM from C to Web Assembly.
        const functionName = loadCString(
            luaEngine.global.lua.module.HEAPU32[(debugPointer >> 2) + 1],
            luaEngine.global.lua.module.HEAPU8
        )

        const source = loadCString(
            luaEngine.global.lua.module.HEAPU32[(debugPointer >> 2) + 4],
            luaEngine.global.lua.module.HEAPU8
        )

        const currentLine =
            luaEngine.global.lua.module.HEAPU32[(debugPointer >> 2) + 6]

        // Only block in top most function.
        if (functionName == 'emsc' && source != '@./api.lua') {
            // Call debug block function through Lua.
            // luaEngine.global.lua.lua_getglobal(address, 'PauseExecution')
            // luaEngine.global.lua.lua_callk(address, 0, 0, 0, null)
            // const startTime = new Date().getTime()
            // while (new Date().getTime() - startTime < 2000);
        }
    }

    addEventListener('message', async (e: MessageEvent) => {
        console.log('message: ' + e.data.kind)

        switch (e.data.kind) {
            case 'Run Script':
                luaEngine.doString(e.data.script)
                break
            case 'API Call Returned':
                waitLockMap.set('apilock', false)
                break
        }
    })
}
