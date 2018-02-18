
; collect a coin hijack
org $03A520
    nop
    nop
    autoclean JSL poison_coins

; collect a flower hijack
org $0EB4BC
    nop
    nop
    autoclean JSL poison_flowers

; goal ring check if mario bab is valid
org $02A91B
    autoclean JML goal_ring_check
    
; boss explosion, check if u got da score
org $02DF61
    autoclean JSL boss_splosion_check
    NOP #2