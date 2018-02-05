!yoshi_x_speed = $60B4

;=================================

!drunk_mode_timer = $7FE8

drunk_mode:
    LDA $0118
    SEC
    SBC #$0F
    ORA $60AC
    BNE .no_drunk
    LDA #$01
    BRA .ret
.no_drunk
    LDA #$00
.ret
    STA !drunk_mode_timer
    RTS

;=================================

hard_mode:
    LDA $61B3 ; baby mario state
    CMP #$80
    BEQ .ret
    LDA $60AC
    BNE .ret
    LDA #$01
    STA $03B6
    STZ $03B7
.ret
    RTS

;=================================

death_star_counter:
    REP #$20
    LDA $03B6
    CMP #$0002 
    BCS .ret
    LDA $60AC
    BNE .ret
; carry out death if star counter = 0 or 1
    LDA #$0028 ; lava death
    JSL $04F6E2

.ret
    SEP #$20
    RTS

;=================================

extended_flutter:
    LDA $60AE
    BNE .ret
; only regular yoshi form
    LDA #$80
    STA $60D3
.ret
    RTS
;=================================

sticky_ground:
    LDA $60AC
    ORA $60AE
    BNE .ret
    REP #$20
    LDA $60C0
    BNE .ret
    LDA !yoshi_x_speed
    CMP #$0021
    BCC .ret
    CMP #$FFD0
    BCS .ret
    LDA #$0000
    STA !yoshi_x_speed
.ret
    SEP #$20
    RTS

;=================================
; add fire and ice melon support
!melon_type = #$02
filled_mouth:
    LDA !melon_type
    STA $616A
    LDA #$A0 ; arbitrary?
    STA $6162
    STA $6170
.ret
    RTS

;=================================

boost_mode:
    LDA $6070
    AND #$40 ;\
    BEQ .ret ;/ X-button
    REP #$30
    LDX $60C4 ; facing direction
    LDA $60A8 ; last frame speed
    BPL .pos
    CMP max_speed_table+2
    BCC .no_add
    BRA .add
.pos
    CMP max_speed_table
    BCS .no_add
.add
    CLC
    ADC boost_amount_table,x
.no_add
    STA !yoshi_x_speed
    SEP #$30

.ret
    RTS

;=================================

packmule_mode:
    LDX $7DF6 ; egg count
    BEQ .ret
    LDA $60AE
    BNE .ret
    TXY
    REP #$20
    LDA !yoshi_x_speed
    BPL .pos
.neg
    EOR #$FFFF
    INC A
    PHA
    TXA
    CLC
    ADC #$000C
    TAY
    PLA

.pos
    CMP packmule_speed_table,x
    BCC .ret
    TYX
    LDA packmule_speed_table,x
    ; SBC #$0016
    STA !yoshi_x_speed
.ret
    SEP #$30
    RTS

;=================================
; TODO: needs more testing
; more god behavior
; add fun effect to Yoshi 

god_mode:
    ; LDA $60AE
    ; BNE .ret
    ; LDA #$02
    ; STA $7E04
.ret
    RTS

;=================================

turbo_mode:
    REP #$20
    LDA $0035
    STA $0037
    LDA $093C
    STA $093E
.ret
    SEP #$20
    RTS

;=================================

reverse_control_mode:
    LDA $60AC
    BNE .ret
    LDA #$04
    STA $61EC
.ret
    RTS

;=================================

; ice physics how??
;
;ground_physics:
;    LDA #$03
;    STA $60FA
;.ret
;    RTS

;=================================

random_cursor:
    JSL $008408
    REP #$20
    LDA $7970
    XBA
    AND #$7FFF
    STA $60EE

.ret
    SEP #$20
    RTS

;=================================
; TODO: Might add higher bounce if groundpound

bouncy_castle:
    REP #$30
    LDA $60AC
    BNE .ret
    LDA $60FC
    AND #$0007
    ORA $61B4
    BEQ .ret
    STZ $61B4
    LDA #$0013    
    JSL $0085D2 ; play boing sound 
    STZ $60D4
    LDA #$FB00
    STA $60AA
    LDA #$0006
    STA $60C0
    LDA #$0001
    STA $60D2

    ; JSL $03B20B ; geboingboing

.ret
    SEP #$30
    RTS

;=================================
; TODO: add blacklist of sprites
; eggs, entrances

tongue_everything:
    LDX #$5C
.loop
    LDA $6F00,x
    BEQ .ret
    LDA $6FA0,x
    AND #%00111111
    ; ORA #%00000000
    STA $6FA0,x
    DEX
    DEX
    DEX
    DEX
    BNE .loop
.ret
    RTS

;=================================

no_flutter:
    STZ $60D2
.ret
    RTS

;=================================
; puffy cheeks 
; 

no_tongue:
    LDA #$80
    STZ $6150
    STZ $6151
    STA $6162
    STA $6163
    STZ $6168
    STZ $6169
.ret
    RTS

;=================================
!lava_time_amount = #$0000

floor_is_lava:
    REP #$30
    LDA $60AC
    BNE .ret
    LDA $60FC
    AND #$0007
    ORA $61B4
    BEQ .ret

    LDA !floor_timer
    BMI .damage

    DEC !floor_timer
    BRA .ret

.damage
    LDA $03B6
    BNE .decrease
    STZ $03B6
    BRA .reset_timer
.decrease
    DEC $03B6
.reset_timer
    LDA !lava_time_amount
    STA !floor_timer
.ret
    SEP #$30
    RTS