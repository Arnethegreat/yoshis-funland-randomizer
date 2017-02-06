org $01C18B
    autoclean JSL in_level_hijack

freecode $FF

in_level_hijack:
    PHP

    PHB
    PHK
    PLB

    ; JSR drunk_mode
    ; JSR hard_mode
    ; JSR death_star_counter
    ; JSR extended_flutter
    ; JSR sticky_ground
    ; JSR filled_mouth
    ; JSR boost_mode
    ; JSR packmule_mode
    ; JSR god_mode
    ; JSR turbo_mode
    ; JSR reverse_control_mode
    ; JSR random_cursor
    ; JSR bouncy_castle
    ; JSR tongue_everything
    ; JSR no_flutter
    JSR no_tongue

.ret
    PLB
    PLP 
    JSL $008259 ; init oam we replaced with hijack
    RTL
