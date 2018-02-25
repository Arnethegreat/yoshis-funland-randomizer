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

wallkick_x_speeds:
    dw $FD80
    dw $0280

!wallkick_y_speed = #$FB00

!wallkick_timer_decay = #$0001

!s_player_x_speed_megaprev = $1414
!wallkick_timer = $1416

walljumps:
    REP #$30
    LDA !s_player_state
    BNE .fail_ret
    LDA !s_player_jump_state 
    BEQ .fail_ret

    LDA !s_player_tile_collision
    AND #$0040
    BNE .right_side_collision
    AND #$0100
    BNE .left_side
    BRA .fail_ret

.right_side_collision
    LDA !wallkick_timer
    DEC A
    BPL .allow_jump

    LDA !s_player_x_speed_megaprev
    CMP #$0100
    BCC .fail_ret
    STA !wallkick_timer

.allow_jump
    SEC
    SBC !wallkick_timer_decay
    STA !wallkick_timer

    LDA #$003B
    STA !s_player_cur_anim_frame

    LDA #$00C0
    STA !s_player_y_speed

    LDA $6073
    AND #$0080
    BEQ .ret

    LDX !s_player_direction
    LDA wallkick_x_speeds,x
    CLC
    ADC !s_player_x_speed
    STA !s_player_x_speed

    LDA !wallkick_y_speed
    STA !s_player_y_speed
    LDA #$0006
    STA !s_player_jump_state

    LDA #$0002
    STA !s_player_direction

    LDA #$0049
    JSL $0085D2

    BRA .ret

.left_side
    LDA #$003B
    STA !s_player_cur_anim_frame


    BRA .ret

.fail_ret
    STZ !wallkick_timer

.ret
    LDA !s_player_x_speed_prev
    STA !s_player_x_speed_megaprev

    SEP #$30
    RTS

;=================================
; needs proper rewrite
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

    LDA !r_game_mode
    CMP #$000F
    BNE .clear_death_flag

    LDA !death_triggered_flag
    BNE .check_states
    LDA !s_player_state
    BNE .clear_death_flag
    LDA $03B6
    CMP #$0002 
    BCS .ret
.check_states
    LDA #$0001
    STA !death_triggered_flag
    LDA !s_player_state
    ORA !s_player_disable_flag
    ORA !s_sprite_disable_flag
    BNE .ret
; carry out death if star counter = 0 or 1
.death
    LDA #$0028 ; lava death
    JSL $04F6E2

.clear_death_flag
    STZ !death_triggered_flag
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

placeholder:
    NOP

.ret
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

    LDA !bouncy_allowed
    BEQ .toggle_bounce

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
.toggle_bounce
    LDA !bouncy_allowed
    EOR #$0001
    STA !bouncy_allowed

.ret
    SEP #$30
    RTS

;=================================


tongue_nothing:
    LDX #$5C
.loop
    LDA $6F00,x
    BEQ .ret
    LDA $6FA0,x
    ; AND #%00111111
    ORA #%10000000
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

poison_air:
    REP #$20
    LDA !s_player_state
    ORA !s_player_disable_flag
    ORA !s_sprite_disable_flag
    BNE .ret
    LDA !s_player_tile_collision
    AND #$0007
    ORA !s_on_sprite_platform_flag
    BNE .ret

    LDA !air_timer
    BMI .damage

    DEC !air_timer
    BRA .ret

.damage
    LDA $03B6
    BNE .decrease
    STZ $03B6
    BRA .reset_timer
.decrease
    SEC
    SBC !poison_air_amount
    STA $03B6

    PHA
    PHY
    JSR test_spawn      ; test
    PLY
    PLA

    BPL .reset_timer
    STZ $03B6
.reset_timer
    LDA !poison_time_amount
    STA !air_timer
.ret
    SEP #$30
    RTS

;=================================
; !lava_time_amount = #$0000
; TODO: Rewrite? Messy implementation

floor_is_lava:
    REP #$20
    LDA !s_player_state
    ORA !s_player_disable_flag
    ORA !s_sprite_disable_flag
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


; spawns lava particle +
test_spawn:
; add so on poison air its offset less

    LDA #$001F
    STA !r_starcounter_timer
    LDA #$01D6                                ; $02ABB7 | $01E0 default
    JSL $008B21                               ; $02ABBA |
    LDA !s_player_x                           ; $02ABBE |
    ; CLC                                       ; $02ABC1 |
    ; ADC #$0006                                ; $02ABC2 |
    STA $70A2,y                               ; $02ABC5 |
    LDA !s_player_y                           ; $02ABC8 |
    CLC                                       ; $02ABCB |
    ADC #$0016                                ; $02ABCC |
    STA $7142,y                               ; $02ABCF |
    LDA #$0006                                ; $0DC246 |\
    STA $7782,y                               ; $0DC249 |/ Animation duration
    LDA #$0003
    STA $7E4C,y                               ; $0DC24C |

    LDA $60C4
    BEQ +
    LDA #$0100
    BRA .store
+
    LDA #$FF00
.store
    STA $71E0,y                               ;|/  Set ambient sprite x-speed
    LDA #$0080                                ;|\
    STA $71E2,y                               ;|/  Ambient sprite y-speed
    LDA $60C4                                 ;|\
    EOR #$0002                                ;| | Set ambient sprite direction same as tap-tap
    STA $73C0,y                               ;|/
    LDY #$04                                  ;|
    ; LDA #$0006                                ;| animation frame
    LDA #$0055                                ;|\ play sound #$002E
    JSL $0085D2                               ;|/ Nathan loves this feature
.ret
    RTS