// Module used to evalute which tasks need to be done and enqueue them

// Repair - roads -only repair if enough to justify a full "tank" of energy for the default creep type of that tier, or defensive and being invaded
// Build - only if construction needs to happen, higher priority for Defensive structures, extensions, spawns
// Attack - highest priority if invaders
// Upgrade