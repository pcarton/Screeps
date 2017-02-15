# Screeps
A collection of my scripts for the game Screeps.

## How To Use the Code
1. Installation -
  * Copy/Download the top level \*.js files and put them into your Screeps directory in the same way you would normally import files
2. Flag Syntax
  + Essential -
    * Source Flags - Marked in the format *S#* where # is the number of squares (out of the adjacent 8) that are mineable from. If # is the same for multiple sources in the room, name the flags with doubles that are the same integer ie 3.0, 3.00, etc.
    * DropOffs - Marked by *DropOff#* and used to mark where the dedicated miners will deposit energy once they spawn (should be within one block of the source mining location and on a container of some sort)
    * GDropOffs - Marked by *GDropOff#* and is the same as a regular DropOff but for mineral extraction
    * Deliveries - Marked by *Deliver#* and should be on top of a container that is used often for other creeps, like near the controller for upgraders.
  + Construction Flags -
    * Walls - Denoted by *WallX##* where X is a direction denoted by *D* for down, *U*, *R*, or *L* and ## is the number of blocks to build the wall in that direction
    * Extensions - Marked in the middle of the formation. *Extensions1* and *Extensions2* are plus signs (one extension in the middle, one in each cardinal direction) while *Extensions3* and *Extensions4* are rows of 5 horizontally the row above the flag and below.
    * Towers - Marked by in the format *Tower#* since they are unlocked at different times.
    * Containers - Just marked by *Container* can only place one flag at a time, may change.
    * (G)DropOffs & Deliveries - function the same as the normal Container Flag above
    * Terminal, Storage, Link - marked by *Terminal* or *Storage* or *Link*
    * Extractor - marked by *Extractor* , in the future this flag will be placed automatically

3. Explanation of Tiers -
  + The tiers are when different bodies of creeps spawn, or at Tier 4 when a new type takes over a job. This is based on the amount of energy available in the room. Reverts temporarily in order to spawn harvesters if needed.

4. Explanation of Memory -
  + Most max number are stored in *Memory.rooms[roomName].roles* and *Memory.rooms[roomName].towersMem* is where the tower target and mode is stored.
  + initialized the first time the script is run, or when the *Memory.initialized* value is false.
