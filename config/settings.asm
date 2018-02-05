org $238000
; vars
!original_level = $1410
!original_world = $1412
!do_poison_coins = $1500
!do_poison_flowers = $1502
!floor_timer = $1440
;=================================
;=================================
;=================================
; Global Settings (for now)
;=================================
!do_custom_level_order = #$01
;=================================
!coin_poison_amount = #$FFF0
;=================================
!flower_poison_amount = #$FFC0
;=================================

modes_pointers:
    dw mode_return                     ; 00
    dw drunk_mode                      ; 02
    dw hard_mode                       ; 04
    dw death_star_counter              ; 06
    dw extended_flutter                ; 08
    dw sticky_ground                   ; 0A
    dw filled_mouth                    ; 0C
    dw placeholder_1                   ; 0E
    dw god_mode                        ; 10
    dw turbo_mode                      ; 12
    dw reverse_control_mode            ; 14
    dw random_cursor                   ; 16
    dw bouncy_castle                   ; 18
    dw tongue_everything               ; 1A
    dw no_flutter                      ; 1C
    dw no_tongue                       ; 1E
    dw floor_is_lava                   ; 20
    dw enable_poison_coin              ; 22
    dw enable_poison_flower            ; 24

; Remove
; packmule_speed_table:
; ; unused
;     dw $0000
; ; positive values
;     dw $02A0
;     dw $0250
;     dw $0200
;     dw $01A0
;     dw $0150
;     dw $0100
; ; negative values
;     dw -$02A0
;     dw -$0250
;     dw -$0200
;     dw -$01A0
;     dw -$0150
;     dw -$0100
;=================================
!boost_amount = $0020
!max_speed = $0500

boost_amount_table:
    dw !boost_amount
    dw $0000-!boost_amount

max_speed_table:
    dw !max_speed
    dw $0000-!max_speed
;=================================
;=================================
;=================================
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

; See enable_bits_format.txt for format
; 1-bit per mode
; 8-bytes per level
; This refers to World Map Level
custom_mode_settings:
; level 1-1
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-2
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-3
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-4
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-5
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-6
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-7
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-8
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-E
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 1-Bonus
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
;== World 2 ==
; level 2-1
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-2
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-3
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-4
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-5
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-6
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-7
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-8
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-E
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 2-Bonus
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
;== World 3 ==
; level 3-1
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-2
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-3
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-4
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-5
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-6
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-7
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-8
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-E
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 3-Bonus
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
;== World 4 ==
; level 4-1
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-2
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-3
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-4
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-5
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-6
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-7
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-8
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-E
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 4-Bonus
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
;== World 5 ==
; level 5-1
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-2
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-3
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-4
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-5
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-6
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-7
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-8
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-E
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 5-Bonus
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
;== World 6 ==
; level 6-1
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-2
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-3
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-4
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-5
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-6
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-7
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-8
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-E
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; level 6-Bonus
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
; Useless Trash
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000
db %00000000