org $238000
; vars
!temp_01 = $140A
!temp_02 = $140C
!temp_03 = $140E

!original_level = $1410
!original_world = $1412

!s_player_x_speed_megaprev = $1414

!floor_timer = $1440
!air_timer = $1442

!do_poison_coins = $1500
!do_poison_flowers = $1502

!poison_coins_amount = $1504
!poison_flowers_amount = $1506

!boost_amount = $1508
!boost_amount_neg = $150A
!max_speed = $150C
!max_speed_neg = $150E

!lava_time_amount = $1510
!lava_damage_amount = $1512

!melon_type = $1514

!bouncy_allowed = $1516

!required_score = $1518
!required_score_type = $151A

!poison_time_amount = $151C
!poison_air_amount = $151E

!active_modes_amount = $1800
!active_modes_pointers = $1802


;=================================
;=================================
;=================================
!level_mode_settings_endmarker = #$8089

modes_pointers:
    dw require_score                   ; 00 (1-byte) _min
    dw drunk_mode                      ; 02
    dw hard_mode                       ; 04
    dw death_star_counter              ; 06
    dw extended_flutter                ; 08
    dw sticky_ground                   ; 0A
    dw filled_mouth                    ; 0C (1-byte)
    dw boost_mode                      ; 0E (4-bytes)
    dw require_score                   ; 10 (1-byte) _max
    dw require_score                   ; 12 (1-byte) _equal
    dw reverse_control_mode            ; 14
    dw random_cursor                   ; 16
    dw bouncy_castle                   ; 18
    dw poison_air                      ; 1A (4-bytes)
    dw no_flutter                      ; 1C
    dw tongue_nothing                  ; 1E 
    dw floor_is_lava                   ; 20 (4-bytes)
    dw enable_poison_coin              ; 22 (2-bytes)
    dw enable_poison_flower            ; 24 (2-bytes)
    dw walljumps                       ; 26


;=================================
;=================================
;=================================
;=================================
print "Do custom levels pointer:"
print pc
do_custom_level_order:
    db $01

custom_level_order:
    ; World 1
    ; levels 1-1 -> 1-8
    db $00, $01, $02, $03, $04, $05, $06, $07
    ; levels 1-E & bonus
    db $08, $09
    ; score and controller settings (these never matter)
    db $00, $00
    ; World 2
    ; levels 2-1 -> 2-8
    db $0C, $0D, $0E, $0F, $10, $11, $12, $13
    ; levels 2-E & bonus
    db $14, $15
    ; score and controller settings (these never matter)
    db $00, $00
    ; World 3
    ; levels 3-1 -> 3-8
    db $18, $19, $1A, $1B, $1C, $1D, $1E, $1F
    ; levels 3-E & bonus
    db $20, $21
    ; score and controller settings (these never matter)
    db $00, $00
    ; World 4
    ; levels 4-1 -> 4-8
    db $24, $25, $26, $27, $28, $29, $2A, $2B
    ; levels 4-E & bonus
    db $2C, $2D 
    ; score and controller settings (these never matter)
    db $00, $00 
    ; World 5
    ; levels 5-1 -> 5-8
    db $30, $31, $32, $33, $34, $35, $36, $37
    ; levels 5-E & bonus
    db $38, $39 
    ; score and controller settings (these never matter)
    db $00, $00
    ; World 6
    ; levels 6-1 -> 6-8
    db $3C, $3D, $3E, $3F, $40, $41, $42, $43
    ; levels 6-E & bonus
    db $44, $45
    ; score and controller settings (these never matter)
    db $00, $00

; Dynamic size
; one byte per enabled mode
; some modes take parameters, see modes_pointers
; each level setting is ended by a word (!level_mode_settings_endmarker)
; This refers to World Map Level
print "custom mode settings pointer:"
print pc

custom_mode_settings:
; level 1-1
dw !level_mode_settings_endmarker
; level 1-2
dw !level_mode_settings_endmarker
; level 1-3
dw !level_mode_settings_endmarker
; level 1-4
dw !level_mode_settings_endmarker
; level 1-5
dw !level_mode_settings_endmarker
; level 1-6
dw !level_mode_settings_endmarker
; level 1-7
dw !level_mode_settings_endmarker
; level 1-8
dw !level_mode_settings_endmarker
; level 1-E
dw !level_mode_settings_endmarker
; level 1-B
dw !level_mode_settings_endmarker
; Score & Controller
dw !level_mode_settings_endmarker
dw !level_mode_settings_endmarker

; level 2-1
dw !level_mode_settings_endmarker
; level 2-2
dw !level_mode_settings_endmarker
; level 2-3
dw !level_mode_settings_endmarker
; level 2-4
dw !level_mode_settings_endmarker
; level 2-5
dw !level_mode_settings_endmarker
; level 2-6
dw !level_mode_settings_endmarker
; level 2-7
dw !level_mode_settings_endmarker
; level 2-8
dw !level_mode_settings_endmarker
; level 2-E
dw !level_mode_settings_endmarker
; level 2-B
dw !level_mode_settings_endmarker
; Score & Controller
dw !level_mode_settings_endmarker
dw !level_mode_settings_endmarker

; level 3-1
dw !level_mode_settings_endmarker
; level 3-2
dw !level_mode_settings_endmarker
; level 3-3
dw !level_mode_settings_endmarker
; level 3-4
dw !level_mode_settings_endmarker
; level 3-5
dw !level_mode_settings_endmarker
; level 3-6
dw !level_mode_settings_endmarker
; level 3-7
dw !level_mode_settings_endmarker
; level 3-8
dw !level_mode_settings_endmarker
; level 3-E
dw !level_mode_settings_endmarker
; level 3-B
dw !level_mode_settings_endmarker
; Score & Controller
dw !level_mode_settings_endmarker
dw !level_mode_settings_endmarker

; level 4-1
dw !level_mode_settings_endmarker
; level 4-2
dw !level_mode_settings_endmarker
; level 4-3
dw !level_mode_settings_endmarker
; level 4-4
dw !level_mode_settings_endmarker
; level 4-5
dw !level_mode_settings_endmarker
; level 4-6
dw !level_mode_settings_endmarker
; level 4-7
dw !level_mode_settings_endmarker
; level 4-8
dw !level_mode_settings_endmarker
; level 4-E
dw !level_mode_settings_endmarker
; level 4-B
dw !level_mode_settings_endmarker
; Score & Controller
dw !level_mode_settings_endmarker
dw !level_mode_settings_endmarker

; level 5-1
dw !level_mode_settings_endmarker
; level 5-2
dw !level_mode_settings_endmarker
; level 5-3
dw !level_mode_settings_endmarker
; level 5-4
dw !level_mode_settings_endmarker
; level 5-5
dw !level_mode_settings_endmarker
; level 5-6
dw !level_mode_settings_endmarker
; level 5-7
dw !level_mode_settings_endmarker
; level 5-8
dw !level_mode_settings_endmarker
; level 5-E
dw !level_mode_settings_endmarker
; level 5-B
dw !level_mode_settings_endmarker
; Score & Controller
dw !level_mode_settings_endmarker
dw !level_mode_settings_endmarker

; level 6-1
dw !level_mode_settings_endmarker
; level 6-2
dw !level_mode_settings_endmarker
; level 6-3
dw !level_mode_settings_endmarker
; level 6-4
dw !level_mode_settings_endmarker
; level 6-5
dw !level_mode_settings_endmarker
; level 6-6
dw !level_mode_settings_endmarker
; level 6-7
dw !level_mode_settings_endmarker
; level 6-8
dw !level_mode_settings_endmarker
; level 6-E
dw !level_mode_settings_endmarker
; level 6-B
dw !level_mode_settings_endmarker
; Score & Controller
dw !level_mode_settings_endmarker
dw !level_mode_settings_endmarker