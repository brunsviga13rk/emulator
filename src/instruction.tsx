import { Brunsviga13rk } from './model/brunsviga13rk'

/**
 * Valid operations the Brunsviga can execute.
 */
export enum Opcode {
    Zero, // Clear output register.
    Add, // Add input register onto output register.
    Subtract, // Subtract input register onto output register.
    Load, // Load value into input register.
    Reset, // Reset all registers to zero.
    ShiftLeft, // Shift sled to the left
    ShiftRight, // Shift sled to the right
}

export class Instruction {
    opcode: Opcode
    value: number | undefined = undefined

    public constructor(opcode: Opcode, value: number | undefined = undefined) {
        this.opcode = opcode
        this.value = value
    }

    public async execute(): Promise<boolean> {
        const brunsviga = Brunsviga13rk.getInstance()
        let promise = undefined

        switch (this.opcode) {
            case Opcode.Reset:
                promise = brunsviga.clearRegisters()
                break
            case Opcode.Zero:
                promise = brunsviga.clearOutputRegister()
                break
            case Opcode.Add:
                promise = brunsviga.repeatedAdd(this.value)
                break
            case Opcode.Subtract:
                promise = brunsviga.repeatedSubtract(this.value)
                break
            case Opcode.ShiftLeft:
                promise = brunsviga.repeatedShiftLeft(this.value)
                break
            case Opcode.ShiftRight:
                promise = brunsviga.repeatedShiftRight(this.value)
                break
            case Opcode.Load:
                promise = brunsviga.setInput(this.value!)
                break
            default:
                throw Error('unknown instruction opcode')
        }

        return promise
    }

    public getDescription(): string {
        switch (this.opcode) {
            case Opcode.Zero:
                return 'Clear input register by pulling the handle on the left side.'
            case Opcode.Add:
                return `Add by rotating the crank clockwise ${this.value ? this.value + ' times' : 'once'}.`
            case Opcode.Subtract:
                return `Subtract by rotating the crank clockwise ${this.value ? this.value + ' times' : 'once'}.`
            case Opcode.Load:
                return `Set input register to a value of ${this.value}`
            case Opcode.Reset:
                return 'Reset all registers by pulling the central lever on the right side.'
            case Opcode.ShiftLeft:
                return `Shift sled to the left by ${this.value} steps.`
            case Opcode.ShiftRight:
                return `Shift sled to the right by ${this.value} steps.`
        }

        return 'unknown opcode'
    }

    public getTitle(): string {
        switch (this.opcode) {
            case Opcode.Zero:
                return 'Clear input'
            case Opcode.Add:
                return `Add ${this.value ? this.value + ' times' : 'once'}`
            case Opcode.Subtract:
                return `Subtract ${this.value ? this.value + ' times' : 'once'}`
            case Opcode.Load:
                return `Load ${this.value}`
            case Opcode.Reset:
                return 'Reset all'
            case Opcode.ShiftLeft:
                return `Shift left ${this.value} steps`
            case Opcode.ShiftRight:
                return `Shift right ${this.value} steps`
        }

        return 'unknown opcode'
    }
}
