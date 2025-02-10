import { Brunsviga13rk } from '../model/brunsviga13rk'

/**
 * Convert a string containing a calculation to an array of tokens.
 * Whitespace will be discarded.
 *
 * @param text
 * @returns An array of tokens.
 */
function tokenize(text: string): Token[] {
    return text
        .split(/\s+|([+\-*/(),])/)
        .filter(Boolean)
        .map((text) => new Token(text))
}

/**
 * A token may either be a number of the format `[0-9]+`
 * or an operator of the following symbols: +,-,*,/.
 */
export enum TokenKind {
    Number,
    Operator,
    Function,
}

/**
 * Token representing a logical atomic brick of a calculation.
 * A token is composed of a kind and an optional value.
 * This value maybe a string or a number.
 */
export class Token {
    kind: TokenKind
    value: string | number

    constructor(text: string) {
        // Check if text is a number.
        if (text.match(/[0-9]+/)) {
            this.kind = TokenKind.Number
            this.value = Number.parseInt(text)

            // If we do not have a number the token may be an operator.
        } else if (text.match(/[+\-*/(),]/)) {
            this.kind = TokenKind.Operator
            this.value = text

            // In case neither a number nor a operator are supplied
            // this token must be a function.
        } else {
            this.kind = TokenKind.Function
            this.value = text
        }
    }

    isNumber(): boolean {
        return this.kind == TokenKind.Number
    }

    isOperator(): boolean {
        return this.kind == TokenKind.Operator
    }

    isFunction(): boolean {
        return this.kind == TokenKind.Function
    }

    /**
     * Operators with higher precedence will bind operators to them before
     * operators with lower precedences.
     *
     * @returns The precedence of the operator.
     */
    getPrecedence(): number {
        switch (this.value as string) {
            case '+':
            case '-':
                return 1
            case '*':
            case '/':
                return 2
            case '(':
            case ')':
                return 3
        }

        return 0
    }

    toString(): string {
        if (this.kind == TokenKind.Number) {
            return this.value.toString()
        }

        return this.value as string
    }
}

/**
 * Convert an array of tokens in infix notation to postfix notation.
 * Infix notation is the "natural" sequence we express calculations by
 * sourrounding the operator by its operands. By postfix notation the operator
 * follows the operands. This implementation makes use the textbook version
 * of the shunting yard algorithm for conversion.
 *
 * Example:
 * ```
 * infix: 2 + 4 * 89
 * postfix: 2 4 89 * +
 * ```
 *
 * @throws Error
 * @param tokens
 * @returns
 */
function infix2postfix(tokens: Token[]): Token[] {
    // Stores the postfix output.
    const output: Token[] = []
    // Temporary stack storing tokens not yet pushed to the output.
    const stack: Token[] = []

    tokens.forEach((token) => {
        // Push numbers, functions and '(' directly to the output.
        if (token.isNumber()) {
            output.push(token)
        } else if (token.isFunction() || token.value == '(') {
            stack.push(token)

            // TODO: implment functions.
            if (token.isFunction())
                throw new Error(`Function not supported: ${token.value}`)
        } else if (token.value == ',') {
            while (stack.length) {
                const top = stack.pop()!

                if (top.value != '(') {
                    output.push(top)
                } else {
                    stack.push(top)
                    break
                }
            }
        } else if (token.value == ')') {
            // Pop all non-left parenthesis from the stack.
            while (stack.length && stack.at(-1)!.value != '(') {
                output.push(stack.pop()!)
            }

            // There must be a left parenthesis ontop of the stack.
            if (!stack.pop()) {
                throw new Error('Mismatched parenthesis in calculation')
            }

            if (stack.at(-1)?.isFunction()) {
                output.push(stack.pop()!)
            }
        } else if (token.isOperator()) {
            // Move all operators with higher precedence from the stack onto
            // the output.
            while (stack.length) {
                const top = stack.at(-1)!

                if (
                    top.isOperator() &&
                    top.value != '(' &&
                    top.getPrecedence() >= token.getPrecedence()
                ) {
                    output.push(stack.pop()!)
                } else {
                    break
                }
            }

            stack.push(token)
        }
    })

    // Put all tokens remaing on the stack onto the output.
    stack.reverse().forEach((token) => output.push(token))

    return output
}

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

    public async execute(): Promise<void> {
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

/**
 * Compile an array of Tokens in postfix notation to instructions for the 3
 * register machine.
 *
 * @throws Error
 * @param tokens
 * @returns
 */
function compile(tokens: Token[]): Instruction[] {
    const stack: number[] = []
    const prog: Instruction[] = []

    // Keep track of the state of both the input and result register.
    let inputRegisterValue = 0
    let resultRegisterValue = 0

    for (const token of tokens) {
        // Check for missmatched parenthesis
        if (
            typeof token.value === 'string' &&
            ['(', ')'].includes(token.value)
        ) {
            throw new Error('Mismatched parenthesis in calculation')
        }

        // Operation loading a value into the result sprocket accounting for the
        // sign of the value.
        const load = (value: number) => {
            prog.push(new Instruction(Opcode.Zero))
            prog.push(new Instruction(Opcode.Load, value))

            // Positive values are added onto the result sprocket
            // negative values are subtracted since a sprocket cannot
            // represent actual negative values.
            prog.push(new Instruction(value > 0 ? Opcode.Add : Opcode.Subtract))

            // Update intermediate states of sprockets.
            resultRegisterValue = value
            inputRegisterValue = value
        }

        if (token.isNumber()) {
            stack.push(token.value as number)
        } else if (token.isOperator()) {
            // Reset entire machine at the start of the calculation.
            if (!prog.length) {
                prog.push(new Instruction(Opcode.Reset))
            }

            // Get operands from stack.
            const op0 = stack.pop()
            const op1 = stack.pop()

            if (!op0) throw new Error('Missimg another operator')

            if (!op1) throw new Error('Missimg another operator')

            let result = 0

            if (token.value == '*') {
                // Long multiplication

                let m0 = op0 // Larger of the two op0 and op1
                let m1 = op1 // Smaller of the two op0 and op1

                result = op0 * op1

                if (op0 < op1) {
                    m0 = op1
                    m1 = op0
                }

                let shifts = Math.floor(Math.log10(m1))

                prog.push(new Instruction(Opcode.Zero))
                prog.push(new Instruction(Opcode.Load, m0))
                // Update intermediate states of sprockets.
                resultRegisterValue = m0
                inputRegisterValue = m0

                if (shifts > 0) {
                    prog.push(new Instruction(Opcode.ShiftRight, shifts))

                    const decimalDigits = []
                    for (; m1 > 0; m1 /= 10) {
                        decimalDigits.push(Math.abs(Math.floor(m1 % 10)))
                    }

                    for (; shifts >= 0; shifts--) {
                        prog.push(
                            new Instruction(Opcode.Add, decimalDigits[shifts])
                        )
                        if (shifts > 0) {
                            prog.push(new Instruction(Opcode.ShiftLeft, 1))
                        }
                    }
                } else {
                    prog.push(new Instruction(Opcode.Add, m1))
                }
            } else {
                if (token.value == '+') {
                    let m0 = op0 // value to load to result.
                    let m1 = op1 // value to add to reult (non-zero).
                    let clear = true // wheter to clear input register.

                    // No need to clear and overwrite result register when
                    // one of the operands is already present.
                    if (resultRegisterValue == op0) {
                        clear = false
                    } else if (resultRegisterValue == op1) {
                        clear = false
                        m0 = op1
                        m1 = op0
                    }

                    // Overwrite result register.
                    if (clear) {
                        load(m0)
                    }

                    if (inputRegisterValue != m1) {
                        prog.push(new Instruction(Opcode.Load, m1))
                        inputRegisterValue = m1
                    }

                    prog.push(new Instruction(Opcode.Add))
                    resultRegisterValue += m1
                    result = op0 + op1
                } else if (token.value == '-') {
                    // Overwrite result register.
                    if (resultRegisterValue != op1) {
                        load(op1)
                    }

                    if (inputRegisterValue != op0) {
                        prog.push(new Instruction(Opcode.Load, op0))
                        inputRegisterValue = op0
                    }

                    prog.push(new Instruction(Opcode.Subtract))
                    resultRegisterValue -= op0
                    result = op1 - op0
                }
            }

            stack.push(result)
        }
    }

    return prog
}

const squashOperation = (program: Instruction[], opcode: Opcode) =>
    program.reduce((acc: Instruction[], curr: Instruction) => {
        if (
            curr.opcode === opcode &&
            acc[acc.length - 1] &&
            acc[acc.length - 1].opcode === opcode
        ) {
            acc[acc.length - 1] = new Instruction(
                opcode,
                (curr.value || 1) + (acc[acc.length - 1].value || 1)
            )
        } else {
            acc.push(curr)
        }
        return acc
    }, [])

const squashResets = (program: Instruction[]) =>
    program.reduce((acc: Instruction[], curr: Instruction) => {
        const squashable = (element: Opcode) =>
            [Opcode.Reset, Opcode.Zero].includes(element)
        if (
            squashable(curr.opcode) &&
            acc[acc.length - 1] &&
            squashable(acc[acc.length - 1].opcode)
        ) {
            acc[acc.length - 1] = new Instruction(Opcode.Reset)
        } else {
            acc.push(curr)
        }
        return acc
    }, [])

function squash(program: Instruction[]): Instruction[] {
    let squashed: Instruction[] = []

    // Squash all repeating operators into single instances.
    squashed = squashOperation(program, Opcode.Add)
    squashed = squashOperation(squashed, Opcode.Subtract)
    squashed = squashResets(squashed)

    return squashed
}

export function solve(text: string): Instruction[] {
    return squash(compile(infix2postfix(tokenize(text))))
}
