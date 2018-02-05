
org $01BEC2
    nop
    nop
    autoclean JSL restore_level

org $17B47F
    nop
    nop
    autoclean JSL prepare_level_settings

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
prepare_level_settings:
    PHX
    PHA
    PHY
    PHP

    JSR get_level_settings
    

set_new_level:

    LDA !do_custom_level_order
    BEQ .ret

    SEP #$30
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
    SEP #$30
    PLP
    PLY
    PLA
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

;=================================

; walk through level modes and count end markers ($FF)
; until matching with current level number

get_level_settings:
    REP #$10        ; 16-bit index registers
    LDX #$0000      ; Settings Index
    LDY #$0000      ; Level Counter
.find_index
    CPY $021A
    BEQ .unpack      ; if found matching level
    LDA custom_mode_settings,x
    CMP #$FF
    BNE +           ; if not end marker, just go to next item
    INY             ; Last level setting item
+
    INX

.unpack
    