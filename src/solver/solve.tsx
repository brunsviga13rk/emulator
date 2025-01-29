function tokenize(text: string): Token[] {
    return text
        .split(/\s+|([+\-*/(),])/)
        .filter(Boolean)
        .map((text) => new Token(text))
}

export enum TokenKind {
    Number,
    Operator,
    Function,
}

export class Token {
    kind: TokenKind
    value: string | number

    constructor(text: string) {
        if (text.match(/[0-9]+/)) {
            this.kind = TokenKind.Number
            this.value = Number.parseInt(text)
        } else if (text.match(/[+\-*/(),]/)) {
            this.kind = TokenKind.Operator
            this.value = text
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

function infix2postfix(tokens: Token[]): Token[] {
    const output: Token[] = []
    const stack: Token[] = []

    tokens.forEach((token) => {
        if (token.isNumber()) {
            output.push(token)
        } else if (token.isFunction()) {
            stack.push(token)
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
        } else if (token.value == '(') {
            stack.push(token)
        } else if (token.value == ')') {
            while (stack.length && stack.at(-1)!.value != '(') {
                output.push(stack.pop()!)
            }

            stack.pop()

            const top = stack.at(-1)
            if (top) {
                if (top.isFunction()) {
                    output.push(stack.pop()!)
                }
            }
        } else if (token.isOperator()) {
            while (stack.length) {
                const top = stack.at(-1)!

                if (
                    top.isOperator() &&
                    top.value != '(' &&
                    top.getPrecedence() > token.getPrecedence()
                ) {
                    output.push(stack.pop()!)
                } else {
                    break
                }
            }

            stack.push(token)
        }
    })

    stack.reverse().forEach((token) => output.push(token))

    return output
}

export enum Opcode {
    Zero, // Clear output register.
    Add, // Add input register onto output register.
    Subtract, // Subtract input register onto output register.
    Load, // Load value into input register.
    Reset, // Reset all registers to zero.
}

export class Instruction {
    opcode: Opcode
    value: number | undefined = undefined

    public constructor(opcode: Opcode, value: number | undefined = undefined) {
        this.opcode = opcode
        this.value = value
    }

    public getDescription(): string {
        switch (this.opcode) {
            case Opcode.Zero:
                return 'Clear input register by pulling the handle on the left side.'
            case Opcode.Add:
                return 'Add by rotating the crank clockwise.'
            case Opcode.Subtract:
                return 'Subtract by rotating the crank counter-clockwise.'
            case Opcode.Load:
                return (
                    'Set input register to a value of: ' +
                    this.value?.toString()
                )
            case Opcode.Reset:
                return 'Reset all registers by pulling the central lever on the right side.'
        }

        return 'unknown opcode'
    }

    public getTitle(): string {
        switch (this.opcode) {
            case Opcode.Zero:
                return 'Clear input'
            case Opcode.Add:
                return 'Add'
            case Opcode.Subtract:
                return 'Subtract'
            case Opcode.Load:
                return 'Load ' + this.value?.toString()
            case Opcode.Reset:
                return 'Reset all'
        }

        return 'unknown opcode'
    }
}

function compile(tokens: Token[]): Instruction[] {
    const stack: number[] = []
    const prog: Instruction[] = []

    tokens.forEach((token) => {
        if (token.isNumber()) {
            stack.push(token.value as number)
        } else if (token.isOperator()) {
            const op1 = stack.pop()

            if (prog.length) {
                prog.push(new Instruction(Opcode.Load, op1))
            } else {
                // First instruction ever.
                // Take first two operands from stack.
                const op0 = stack.pop()

                // Do push.
                prog.push(new Instruction(Opcode.Reset))
                prog.push(new Instruction(Opcode.Load, op0))
                prog.push(new Instruction(Opcode.Add))
                prog.push(new Instruction(Opcode.Load, op1))
            }

            switch (token.value) {
                case '+':
                    prog.push(new Instruction(Opcode.Add))
                    break
                case '-':
                    prog.push(new Instruction(Opcode.Subtract))
                    break
            }
        }
    })

    return prog
}

export function solve(text: string): Instruction[] {
    return compile(infix2postfix(tokenize(text)))
}
