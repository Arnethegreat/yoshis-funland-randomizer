org $01C18B
    autoclean JSL in_level_hijack

freecode $FF

in_level_hijack:
    PHP

    PHB
    PHK
    PLB

    REP #$30
    LDA !original_level
    ASL A
    ASL A
    ASL A
    STA $D0
    TAX
    SEP #$20
    LDA custom_mode_settings,x
    SEP #$10

.byte_0
    BEQ .byte_1
    BPL +
    PHA
    JSR drunk_mode
    PLA
+
    ASL A
    BPL +
    PHA
    JSR hard_mode
    PLA
+
    ASL A
    BPL +
    PHA
    JSR death_star_counter
    PLA
+
    ASL A
    BPL +
    PHA
    JSR extended_flutter
    PLA
+
    ASL A
    BPL +
    PHA
    JSR sticky_ground
    PLA
+
    ASL A
    BPL +
    PHA
    JSR filled_mouth
    PLA
+
    ASL A
    BPL +
    PHA
    JSR boost_mode
    PLA
+
    ASL A
    BPL +
    PHA
    JSR packmule_mode
    PLA
+
.byte_1
    REP #$10
    LDX $D0
    LDA custom_mode_settings+1,x
    SEP #$10
    BEQ .byte_2

    BPL +
    PHA
    ; Disabled - trash
    ; JSR god_mode
    PLA
+
    ASL A
    BPL +
    PHA
    JSR turbo_mode
    PLA
+
    ASL A
    BPL +
    PHA
    JSR reverse_control_mode
    PLA
+
    ASL A
    BPL +
    PHA
    JSR random_cursor
    PLA
+
    ASL A
    BPL +
    PHA
    JSR bouncy_castle
    PLA
+
    ASL A
    BPL +
    PHA
    JSR tongue_everything
    PLA
+
    ASL A
    BPL +
    PHA
    JSR no_flutter
    PLA
+
    ASL A
    BPL +
    PHA
    JSR no_tongue
    PLA
+
.byte_2
    REP #$10
    LDX $D0
    LDA custom_mode_settings+2,x
    SEP #$10

    STZ !do_poison_coins
    BPL +
    LDX #$01
    STX !do_poison_coins
+
    STZ !do_poison_flowers
    ASL A
    BPL +
    LDX #$01
    STX !do_poison_flowers
+
    ASL A
    BPL +
    PHA
    JSR floor_is_lava
    PLA
+
.ret
    PLB
    PLP 
    JSL $008259 ; init oam we replaced with hijack
    RTL
