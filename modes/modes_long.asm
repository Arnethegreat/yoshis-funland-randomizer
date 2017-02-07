freecode $FF

;=================================
;=========Long Routines===========
;=================================

!coin_poison_amount = #$FFF0

poison_coins:
    LDA !do_poison_coins
    BEQ .ret

    LDA !coin_poison_amount
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


!flower_poison_amount = #$FFF0

poison_flowers:
    LDA !do_poison_flowers
    BEQ .ret

    LDA !flower_poison_amount
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