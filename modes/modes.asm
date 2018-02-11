!yoshi_x_speed = $60B4
!drunk_mode_timer = $7FE8
;=================================
require_score:
    NOP
.ret
    RTS

drunk_mode:
    LDA $0118
    SEC
    SBC #$0F
    ORA !s_player_state
    BNE .no_drunk
    LDA #$01
    BRA .ret
.no_drunk
    LDA #$00
.ret
    STA !s_fuzzy_timer
    RTS

;=================================

hard_mode:
    LDA $61B3 ; baby mario state
    CMP #$80
    BEQ .ret
    LDA !s_player_state
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
    LDA !s_player_state
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
    LDA !s_player_state
    ORA $60AE
    BNE .ret
    REP #$20
    LDA $60C0
    BNE .ret
    LDA !s_player_x_speed 
    CMP #$0021
    BCC .ret
    CMP #$FFD0
    BCS .ret
    LDA #$0000
    STA !s_player_x_speed 
.ret
    SEP #$20
    RTS

;=================================
; add fire and ice melon support
; !melon_type = #$02

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
    CMP !max_speed_neg
    BCC .no_add
    BRA .add
.pos
    CMP !max_speed
    BCS .no_add
.add
    CLC
    ADC !boost_amount,x
.no_add
    STA !s_player_x_speed
    SEP #$30

.ret
    RTS

;=================================


;=================================


;=================================

placeholder_1:
    

.ret
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
    LDA !s_player_state
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
    LDA !s_rng
    XBA
    AND #$7FFF
    STA !s_egg_cursor_angle

.ret
    SEP #$20
    RTS

;=================================
; TODO: Might add higher bounce if groundpound

bouncy_castle:
    REP #$30
    LDA !s_player_state
    BNE .ret
    LDA !s_player_tile_collision
    AND #$0007
    ORA !s_on_sprite_platform_flag
    BEQ .ret
    STZ !s_on_sprite_platform_flag
    LDA #$0013    
    JSL $0085D2 ; play boing sound 
    STZ !s_player_ground_pound_state
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
; !lava_time_amount = #$0000
; TODO: Rewrite? Messy implementation

floor_is_lava:
    REP #$20
    LDA !s_player_state
    BNE .ret
    LDA !s_player_tile_collision
    AND #$0007
    ORA !s_on_sprite_platform_flag
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
    SEC
    SBC !lava_damage_amount
    STA $03B6

    PHA
    PHY
    JSR test_spawn      ; test
    PLY
    PLA

    BPL .reset_timer
    STZ $03B6
.reset_timer
    LDA !lava_time_amount
    STA !floor_timer
.ret
    SEP #$30
    RTS

enable_poison_coin:
    LDA #$01
    STA !do_poison_coins
.ret
    RTS

enable_poison_flower:
    LDA #$01
    STA !do_poison_flowers
.ret
    RTS

test_spawn:
    LDA #$01E0                                ; $02ABB7 |
    JSL $008B21                               ; $02ABBA |
    LDA !s_player_x                           ; $02ABBE |
    ; CLC                                       ; $02ABC1 |
    ; ADC #$0006                                ; $02ABC2 |
    STA $70A2,y                               ; $02ABC5 |
    LDA !s_player_y                           ; $02ABC8 |
    CLC                                       ; $02ABCB |
    ADC #$0018                                ; $02ABCC |
    STA $7142,y                               ; $02ABCF |
    LDA #$0004                                ; $0DC246 |\
    STA $7782,y                               ; $0DC249 |/ Animation duration
    STA $7E4C,y                               ; $0DC24C |

    LDA $60F4
    BPL +
    LDA #$0080
    BRA .store
+
    LDA #$FF80
.store
    STA $71E0,y                               ; $0DC251 |/  Set ambient sprite x-speed
    LDA #$0030                                ; $0DC254 |\
    STA $71E2,y                               ; $0DC257 |/  Ambient sprite y-speed
    LDA $60F4                                 ; $0DC25A |\
    EOR #$0002                                ; $0DC25D | | Set ambient sprite direction same as tap-tap
    STA $73C0,y                               ; $0DC260 |/
    LDY #$04                                  ; $0DC263 |
    LDA #$0006                                ; $0DC265 | animation frame
    LDA #$0017                                ; $0DC2CF |\ play sound #$002E
    JSL $0085D2                               ; $0DC2D2 |/
.ret
    RTS