
var labelCounter = 0
var labelStack = []

function getOps() {
    var bfToAsmTable = {
        ">": "\nINC !datapointer",
        "<": "\nDEC !datapointer",
        "+": "\nINC (!datapointer)",
        "-": "\nDEC (!datapointer)",
        ".": "\nNOP # todo",
        ",": "\nNOP # todo",
        "[": "\nLDA (!datapointer)" + "\nBEQ label_b" + String(labelStack.slice(-1)[0]) + "\nlabel_a" + String(labelStack.slice(-1)[0]) + ":",
        "]": "\nLDA (!datapointer)" + "\nBNE label_a" + String(labelStack.slice(-1)[0]) + "\nlabel_b" + String(labelStack.slice(-1)[0]) + ":"
    }
    return bfToAsmTable
}



function translateBrainfuck() {
    var BrainfuckInput = document.getElementById("bfInput").value
    var BrainfuckOutput = ""
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
        BrainfuckOutput += opcode;
        if (character == "]") {
            labelStack.pop()
        }
    }
    // console.log(BrainfuckOutput)

    document.getElementById("bfOutput").value = BrainfuckOutput
}