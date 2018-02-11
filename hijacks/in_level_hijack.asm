org $01C18B
    autoclean JSL in_level_hijack

freecode $FF

in_level_hijack:

    PHB
    PHP
; set new data bank
    PHK
    PLB

    SEP #$30
    ; LDA !original_level
    ; ASL A
    ; ASL A
    ; ASL A
    ; STA $D0
    ; TAX
    ; SEP #$20
    ; LDA custom_mode_settings,x
print pc
.execute_modes
    LDX !active_modes_amount
.loop
    BEQ .ret
    PHX
    JSR (!active_modes_pointers-2,x)
    PLX
    DEX
    DEX
    BRA .loop


.ret
    SEP #$10
    PLP 
    PLB
    JSL $008259 ; init oam we replaced with hijack
    RTL
