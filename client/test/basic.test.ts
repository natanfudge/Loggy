import {assert, expect, test} from 'vitest'
import {LogEvent} from "../src/core/Logs";
import {Day} from "../src/core/Day";

// Edit an assertion and save to see HMR in action

test('Math.sqrt()', () => {
    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(144)).toBe(12)
    expect(Math.sqrt(2)).toBe(Math.SQRT2)
})


test('JSON', () => {
    const day = new Day({day: 1, month: 2, year: 1970})
    console.log(JSON.stringify(day))
    const back: Day = JSON.parse(JSON.stringify(day))

    const dayInstanceof = day instanceof Day
    const backInstanceof = back instanceof Day

    const dateDay = day.dateString()
    const backDay = back.dateString()

    const x = 2;
    // const input = {
    //     foo: 'hello',
    //     bar: 'world',
    // }
    //
    // const output = JSON.stringify(input)
    //
    // expect(output).eq('{"foo":"hello","bar":"world"}')
    // assert.deepEqual(JSON.parse(output), input, 'matches original')
})


const json = `{
    "name": "scheduleTasks",
    "startTime": 1674209722013,
    "endTime": 1674209722018,
    "logs": [
        {
            "type": "DetailLog",
            "key": "Schedule Time",
            "value": "2023-01-20T10:15:22.013751300Z"
        },
        {
            "type": "MessageLog",
            "message": "Evicting crashes from days: []",
            "time": 1674209722016,
            "severity": "Info"
        }
    ]
}
`
