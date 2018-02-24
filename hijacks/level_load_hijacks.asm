; Restore before score save
org $01BEC2
    nop
    nop
    autoclean JSL restore_level_save

; Prepare Overworld
org $17A5D2
    nop
    autoclean JSL restore_level_map

; World Map on choosing level
org $17B47F
    nop
    nop
    autoclean JSL prepare_level_settings

; Gamemode 0F pause menu check
org $01C14B
    nop
    nop
    autoclean JSL fix_start_select

; Beat World Cutscene (world increase)
org $17A9DE
    nop
    nop
    autoclean JSL set_world_increase

freecode $FF

;================================

set_world_increase:
    LDA do_custom_level_order
    BEQ .ret
    INC !original_world
    INC !original_world 
.ret
    INC $0218
    INC $0218
    RTL

;================================

restore_level_map:
    LDA do_custom_level_order
    BEQ .ret
    LDA !original_level
    STA $021A
    LDA !original_world
    STA $0218
.ret
    LDX #$17
    STX $4304
    RTL

;=================================

restore_level_save:
    LDA do_custom_level_order
    BEQ .ret
    LDA !original_level
    STA $021A
.ret
    LDX $021A
    LDA $030C
    RTL

;=================================
;=================================
;=================================

; 8-bit A/X/Y
prepare_level_settings:
    PHX
    PHA
    PHY
    PHP

    JSR get_level_settings
    SEP #$30
    

.set_new_level

    LDA do_custom_level_order
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


fix_start_select:
    LDX $021A
    LDA do_custom_level_order
    BEQ .ret
    CPX #$0B
    BEQ .ret
    LDX !original_level
.ret
    LDA $0222,x 
    RTL


;=================================
; walk through level modes and count end markers ($8089)
; until matching with current level number

get_level_settings:
    REP #$30                       ; 16-bit index registers

.clear
    STZ !temp_01
    STZ !temp_02
    STZ !temp_03

    STZ !floor_timer
    STZ !air_timer

    STZ !death_triggered_flag
    STZ !do_poison_coins
    STZ !do_poison_flowers
    STZ !poison_coins_amount
    STZ !poison_flowers_amount
    STZ !boost_amount
    STZ !boost_amount_neg
    STZ !max_speed
    STZ !max_speed_neg
    STZ !lava_time_amount
    STZ !lava_damage_amount
    STZ !melon_type
    STZ !bouncy_allowed 
    STZ !required_score

    STZ !poison_air_amount
    STZ !poison_time_amount

    STZ !active_modes_amount    
    LDX #$00FE
; clear out all previous pointers
..loop
    STZ !active_modes_pointers,x
    DEX
    DEX
    BNE ..loop


    LDX #$0000                     ; Settings Index
    LDY #$0000                     ; Level Counter
.find_index
    CPY $021A
    BEQ .unpack                    ; begin unpacking if level match
    LDA custom_mode_settings,x
    CMP !level_mode_settings_endmarker
    BNE .next_item                 ; if not end marker, just go to next item
    INY                            ; Last level setting item
    INX                            ; Endmarker being 2-bytes so extra INX
.next_item
    INX
    BRA .find_index

.unpack
    LDA custom_mode_settings,x
    CMP !level_mode_settings_endmarker
    BEQ .ret

    PHX
    AND #$00FF
    TAX
    LDA modes_pointers,x

    PLX

    PHA
    LDA custom_mode_settings,x
    AND #$00FF
    JSR parse_parameters
    PLA

    LDY !active_modes_amount
    STA !active_modes_pointers,y
    INY
    INY
    STY !active_modes_amount

    BRA .unpack
.ret
    RTS

;=================================
; Takes in argument in A
; Increase X by parameter length
; Checks mode index to find if it takes parameters and load them
parse_parameters:
    INX

    CMP #$0000
    BEQ .require_score_min
    CMP #$0010
    BEQ .require_score_max
    CMP #$0012
    BEQ .require_score_equal

    CMP #$000C
    BEQ .filled_mouth
    CMP #$000E
    BEQ .boost
    CMP #$0020
    BEQ .lava_floor
    CMP #$0022
    BEQ .poison_coin
    CMP #$0024
    BEQ .poison_flower
    CMP #$001A
    BEQ .poison_air

    RTS



.require_score_min
    LDA #$8000
    STA !required_score_type
    BRA .require_score_set
.require_score_max
    LDA #$0080
    STA !required_score_type
    BRA .require_score_set
.require_score_equal
    LDA #$0008
    STA !required_score_type
    ; BRA .require_score_set

.require_score_set
    LDA custom_mode_settings,x
    AND #$00FF
    STA !required_score
    INX
    RTS

.filled_mouth
; 1-byte
    LDA custom_mode_settings,x
    AND #$00FF
    STA !melon_type 
    INX
    RTS

.boost
; 4-bytes
    LDA custom_mode_settings,x
    STA !boost_amount
; dumb quick hack dont judge
    LDA #$0000
    SEC
    SBC custom_mode_settings,x
    STA !boost_amount_neg

    INX
    INX
    LDA custom_mode_settings,x
    STA !max_speed
; dumb quick hack dont judge
    LDA #$0000
    SEC
    SBC custom_mode_settings,x
    STA !max_speed_neg

    INX
    INX

    RTS

.lava_floor
; 4-bytes
    LDA custom_mode_settings,x
    STA !lava_time_amount 
    INX
    INX
    LDA custom_mode_settings,x
    STA !lava_damage_amount
    INX
    INX

    RTS

.poison_coin
; 2-bytes
    LDA custom_mode_settings,x
    STA !poison_coins_amount
    INX
    INX

    RTS

.poison_flower
; 2-bytes
    LDA custom_mode_settings,x
    STA !poison_flowers_amount
    INX
    INX

    RTS

.poison_air
; 4-bytes
    LDA custom_mode_settings,x
    STA !poison_time_amount
    INX
    INX
    LDA custom_mode_settings,x
    STA !poison_air_amount
    INX
    INX

    RTS