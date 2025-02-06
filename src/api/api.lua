
--- Get Typescript API abstraction.
---@type any
---@diagnostic disable-next-line: undefined-global
local ts_api = ts_api_get_1_3_0()

local M = {}

--- Reset all registers of the machine to a zero value.
--- Execution time depends on the animation time of task.
function M.reset()
    ts_api.reset():await()
end

--- Set the counter register to zero.
--- Execution time depends on the animation time of task.
function M.reset_counter(value)
    ts_api.zero_counter_register():await()
end

--- Set the input register to zero.
--- Execution time depends on the animation time of task.
function M.reset_input(value)
    ts_api.zero_input_register():await()
end

--- Set the result register to zero.
--- Execution time depends on the animation time of task.
function M.reset_result(value)
    ts_api.zero_result_register():await()
end

--- Add the value of the input register onto the result register.
--- Execution time depends on the animation time of task.
function M.add()
    ts_api.add():await()
end

--- Subtract the value of the input register onto the result register.
--- Execution time depends on the animation time of task.
function M.subtract()
    ts_api.subtract():await()
end

--- Set the given value to the input register.
--- Execution time depends on the animation time of task.
---@param value integer
function M.load(value)
    ts_api.load(value):await()
end

--- Shift the result register by one digit to the left.
--- Execution time depends on the animation time of task.
function M.shift_left(value)
    ts_api.shift_left():await()
end

--- Shift the result register by one digit to the right.
--- Execution time depends on the animation time of task.
function M.shift_right(value)
    ts_api.shift_right():await()
end

--- Returns the current value of the counter register.
---@return integer
function M.get_counter()
    return ts_api.get_counter()
end

--- Returns the current value of the input register.
---@return integer
function M.get_input()
    return ts_api.get_input()
end

--- Returns the current value of the resul register.
---@return integer
function M.get_result()
    return ts_api.get_result()
end

return M
