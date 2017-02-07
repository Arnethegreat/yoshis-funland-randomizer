
!do_poison_coins = #$0001
; collect a coin hijack
org $03A520
    nop
    nop
    autoclean JSL poison_coins

!do_poison_flowers = #$0001
; collect a flower hijack
org $0EB4BC
    nop
    nop
    autoclean JSL poison_flowers