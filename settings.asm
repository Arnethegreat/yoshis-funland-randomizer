

org $238000

!do_custom_level_order = #$01

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
; levels 1-E & bonus
db $14, $15
; score and controller settings (these never matter)
db $00, $00
db $18, $19, $1A, $1B, $1C, $1D, $1E, $1F
db $20, $21
db $00, $00
db $24, $25, $26, $27, $28, $29, $2A, $2B
db $2C, $2D 
db $00, $00 
db $30, $31, $32, $33, $34, $35, $36, $37
db $38, $39 
db $00, $00
db $3C, $3D, $3E, $3F, $40, $41, $42, $43
db $44, $45
db $00, $00


; 1-bit per mode
custom_mode_settings:
db $00