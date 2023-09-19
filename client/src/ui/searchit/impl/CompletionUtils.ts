import {Completion} from "../SearchitBar";

export function completionsEqual(completionA: Completion, completionB: Completion): boolean {
    if (completionA === undefined) throw new Error("completionA is unexpectedly undefined")
    if (completionB === undefined) throw new Error("completionB is unexpectedly undefined")
    return completionA.label === completionB.label && completionA.newText === completionB.newText
}