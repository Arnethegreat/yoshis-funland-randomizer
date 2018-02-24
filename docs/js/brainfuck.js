
var labelCounter = 0
var labelStack = []

function getOps() {
    var curLabelCounter = String(labelStack.slice(-1)[0])
    var bfToAsmTable = {
        ">": "\n  INC !datapointer",
        "<": "\n  DEC !datapointer",
        "+": "\n  INC (!datapointer)",
        "-": "\n  DEC (!datapointer)",
        ".": "\n  NOP # todo",
        ",": "\n  NOP # todo",
        "[": "\n  LDA (!datapointer)" + "\n  BNE label_a" + curLabelCounter + "\n  JMP label_b" + curLabelCounter + "\nlabel_a" + curLabelCounter + ":",
        "]": "\n  LDA (!datapointer)" + "\n  BEQ label_b" + curLabelCounter + "\n  JMP label_a" + curLabelCounter + "\nlabel_b" + curLabelCounter + ":"
    }
    return bfToAsmTable
}



function translateBrainfuck() {
    var BrainfuckInput = document.getElementById("bfInput").value
    var BrainfuckOutput = "!datapointer = $0000"
    labelCounter = 0
    labelStack = []
    for (var i = 0; i < BrainfuckInput.length; i++) {
        character = BrainfuckInput[i]
        if (character == "[") {
            labelCounter += 1
            labelStack.push(labelCounter)
        }
        var lookup = getOps()
        var opcode = lookup[character]

        if (typeof opcode === "undefined") { continue }

        BrainfuckOutput += opcode;
        if (character == "]") {
            labelStack.pop()
        }
    }
    // console.log(BrainfuckOutput)

    document.getElementById("bfOutput").value = BrainfuckOutput
}