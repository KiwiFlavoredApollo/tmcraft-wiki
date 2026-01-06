export async function readFiles(directory) {
    const res = await fetch(directory);
    const list = await res.json();

    return list;
}

// A class that contain name, power, category, accuracy, pp of a move
export class PokeMoves {
    constructor(data) {
        this.index = data.id;
        this.name = (() => { for (const i of data.names){ if (i.language.name === "en") { return i.name}}})()
        this.type = data.type.name;
        this.power = data.power;
        this.category = data.damage_class.name;
        this.accuracy = data.accuracy;
        this.pp = data.pp;
    }
}

// This class contain which villager level will be trade
export class TradeMoves extends PokeMoves{
    constructor(data, [level, probability]){
        super(data);
        this.villager_level = level;
        this.probability = probability
        this.villagerLevelRowspan = 0
        this.element = document.createElement('tr');
    }
    async drawBlock(itemFirstName) {
        this.element.innerHTML = `<tr>${this.villagerLevelRowspan ? `<th style="text-transform: capitalize; font-weight: normal;" rowspan="${this.villagerLevelRowspan}">${this.villager_level}</th>` : ''}
                                        <td style="text-transform: capitalize;">${       Number.isInteger(this.probability) ? this.probability :
                                                                                Number.isInteger(this.probability * 10 / 1) ? this.probability.toFixed(1)
                                                                                                                            : this.probability.toFixed(2)}%</td>
                                        <td style="text-transform: capitalize;">${await this.wantedItems()}</td>
                                        <td style="text-transform: capitalize;"><img src="images/${this.type}.png" style="width: 32px; height: 32px"> ${itemFirstName}-${this.index}: ${this.name}</td>
                                        <td style="border-right: 0px;text-align: right;"><img src="../images/types/${this.type}.png">&ensp;
                                            <img src="../images/move_categories/${this.category}.png" style="width: 48px; height: 32px"> 
                                        </td>
                                        <td style="border-left: 0px; border-right: 0px;">${this.power ? this.power : '—'}</td>
                                        <td style="border-left: 0px; border-right: 0px;">${this.accuracy ? this.accuracy : '—'}</td>
                                        <td style="border-left: 0px; padding-right: 1%;">${this.pp}</td>
                                    </tr>`
        document.getElementById('trading-table').appendChild(this.element);
    }

    // This class auto generate wanted items since they're all the same
    async wantedItems() {
        let emerald = undefined;
        let gem = '+ </br>';
        switch (this.villager_level) {
            case 'novice':
                emerald = 6
                break;
            case 'apprentice':
                emerald = 10
                break;
            case 'journeyman':
            case 'expert':
                emerald = 16    
                break;
            default:
                emerald = 22
                gem = '+</br>3 × '
                break;
        }
        return `${emerald} × <img src="../images/items/emerald.png" style="width: 32px; height: 32px"> Emerald
                ${gem}<img src="../images/items/${this.type}_gem.png" style="width: 32px; height: 32px"> ${this.type} Gem`
    }
}

// Search function that will display when there's a match string in the move's name.
// It is however also change the collum span of the trade table, which is why can't be use with TM recipe search function
export function search(moves, itemFirstName) {
    const search_input = document.getElementById("search").value.toUpperCase(); // Get input value
    const showMoves = []
    for (const i in moves){
        if (moves[i].name.toUpperCase().indexOf(search_input) > -1) {
            if (i == 0 || showMoves.length == 0) showMoves[showMoves.length] = []
            else if (moves[i].villager_level != moves[i - 1].villager_level) showMoves[showMoves.length] = []
            moves[i].element.style.display = '';
            moves[i].villagerLevelRowspan = 0
            console.log(showMoves.length);
            
            showMoves[showMoves.length - 1][showMoves[showMoves.length - 1].length] = moves[i]
        } else moves[i].element.style.display = 'none'
    }
    for (const i in showMoves) {
        showMoves[i][0].villagerLevelRowspan = showMoves[i].length
        for (const j of showMoves[i]) {j.drawBlock(itemFirstName);
        }
    }
}

// Fetch is special and need await to get the value, can't create async constructor to do that. Need function to do the job for it 
export async function createBlock(name, data, aClass) {
    const url = await fetch(`https://pokeapi.co/api/v2/move/${name}`);
    const APIdata = await url.json();
    const block = new aClass(APIdata, data);
    return block;
}
