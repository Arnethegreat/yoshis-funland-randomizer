
org $01BEC2
    nop
    nop
    autoclean JSL restore_level

org $17B47F
    nop
    nop
    autoclean JSL set_new_level

;org $17E72C
;    autoclean JSL set_new_level

org $01C14B
    nop
    nop
    autoclean JSL fix_start_select


org $00B444
    autoclean JSL restore_world

freecode $FF

;=================================

print pc
; 8-bit A/X/Y
set_new_level:
    PHX

    LDA !do_custom_level_order
    BEQ .ret

    LDX $021A
    STX !original_level
    LDA $0218
    STA !original_world

    LDA custom_level_order,x
    STA $021A
    LDX #$00
    .loop
        CMP #$0C
        BCC .store_world_number
        INX
        INX
        SBC #$0C
        BRA .loop
.store_world_number
    STX $0218

.ret
    PLX
    STZ $03B8
    STZ $03B9
    RTL

;=================================

restore_level:
    LDA !do_custom_level_order
    BEQ .ret
    LDA !original_level
    STA $021A
.ret
    LDX $021A
    LDA $030C
    RTL

;=================================

fix_start_select:
    LDX $021A
    LDA !do_custom_level_order
    BEQ .ret
    LDX !original_level
.ret
    LDA $0222,x 
    RTL

;=================================

restore_world:
    LDA #$4C 
    STA $14
    LDA !do_custom_level_order
    BEQ .ret
    LDA !original_world
    STA $0218
.ret
    RTL
    