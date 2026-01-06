import { TradeMoves, readFiles, createBlock, search } from '../useful_functions.js'

let data = await readFiles('trade.json')

// Define moves array
const moves = []
for (const i of Object.keys(data)) for (const j of data[i]) moves.push.apply(moves, [await createBlock(j, [i, 100/data[i].length], TradeMoves)]); 

// This will first merge all moves that in the same villager level, then display it
for (const i in moves){
    if (i > 0) { if (moves[i].villager_level != moves[i - 1].villager_level) moves[i].villagerLevelRowspan = data[moves[i].villager_level].length 
    } else moves[i].villagerLevelRowspan = data[moves[i].villager_level].length 
    console.log(moves);
    
    moves[i].drawBlock('EGG');
}

// Search function
document.getElementById('search').onkeyup = () => search(moves, 'EGG')