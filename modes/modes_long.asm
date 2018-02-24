freecode $FF

;=================================
;=========Long Routines===========
;=================================

poison_coins:
    LDA !do_poison_coins
    BEQ .ret

    LDA !poison_coins_amount
    CLC
    ADC $03B6
    BMI .neg
    BRA .pos
.neg
    LDA #$0000
.pos
    STA $03B6
    LDA #$0010
    STA $0B7F

.ret
    INC $037B
    LDA $037B
    RTL

;=================================

poison_flowers:
    LDA !do_poison_flowers
    BEQ .ret

    LDA !poison_flowers_amount
    CLC
    ADC $03B6
    BMI .neg
    BRA .pos
.neg
    LDA #$0000
.pos
    STA $03B6
    LDA #$0010
    STA $0B7F

.ret
    INC $03B8
    LDY $03B8
    RTL

;=================================

boss_splosion_check:
    PHX
    PHY
    JSR calculate_score
    PLY
    PLX

    PHA

    LDA !required_score_type
    CMP #$8000
    BEQ .min
    CMP #$0080
    BEQ .max
    CMP #$0008
    BEQ .eq

.min
    PLA
    CMP !required_score
    BCC .failed_req
    BRA .ret
.max
    PLA
; DEC so max score is allowed
    DEC A
    CMP !required_score
    BCS .failed_req
    BRA .ret
.eq
    PLA
    CMP !required_score
    BNE .failed_req
    BRA .ret



.failed_req
; die die die die
    LDA #$0001
    STA !bossdeath_triggered_flag
    LDA #$0028 ; lava death
    STA !s_player_state
    JSL $04F6E2
    STZ !s_player_disable_flag
    STZ !s_sprite_disable_flag

.ret
    LDA #$0800                                ; $02DF61 |
    STA !s_spr_gsu_morph_2_lo,x               ; $02DF64 |
    RTL

;=================================

goal_ring_check:
    PHX
    PHY
    JSR calculate_score
    PLY
    PLX

    PHA

    LDA !required_score_type
    CMP #$8000
    BEQ .min
    CMP #$0080
    BEQ .max
    CMP #$0008
    BEQ .eq

.min
    PLA
    CMP !required_score
    BCC .failed_req
    BRA .ret
.max
    PLA
; DEC so max score is allowed
    DEC A
    CMP !required_score
    BCS .failed_req
    BRA .ret
.eq
    PLA
    CMP !required_score
    BNE .failed_req
    BRA .ret



.failed_req
; Incorrect sound
    LDA #$0090
    JSL $0085D2
; call damage player routine
    JSL $03A853

; Go back to RTS as fail 
    JML $02A915

; required score met
.ret
    LDA !s_player_y                           ; $02A91B |
    SEC                                       ; $02A91E |
    JML $02A91F

;=================================

calculate_score:
    LDA !r_stars_amount
    CMP #$012D
    BCC +
    LDA #$012C
+
; divided by 10
    STA $4204
    LDX #$0A
    STX $4206
    NOP #8
    LDA #$0000
    CLC
    ADC $4214
    STA !temp_01

    LDA !r_flowers_amount
    CMP #$0006
    BCC +
    LDA #$0005
    STA !r_flowers_amount
+
; times 10...
    ASL A
    ASL A
    ASL A
    CLC
    ADC !r_flowers_amount
    CLC
    ADC !r_flowers_amount

    CLC
    ADC !temp_01
    STA !temp_01

    CLC
    ADC !r_red_coins_amount
    STA !temp_01

.ret
    RTS

;=================================
;=================================
;=================================

froggy_fix:
    LDA !bossdeath_triggered_flag
    BEQ .ret

    LDA #$0028
    STA !s_player_state
    RTL

.ret
    LDA #$001A                                ; $02D9CA 
    STA !s_player_state
    RTL