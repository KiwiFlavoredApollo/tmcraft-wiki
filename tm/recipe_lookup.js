import { readFiles, PokeMoves, createBlock } from '../useful_functions.js'

// This class contain recipe of the TM, it also have function to draw the recipe
class TMBlock extends PokeMoves {
        
    constructor(data, recipe) {
        super(data);
        this.recipe = recipe;
        this.element = document.createElement('div');
    }

    // This block draw the TM recipe
    async drawBlock() {
        this.element.innerHTML = `<div class="interface crafting-interface">
                                        <div class="crafting-interface-ingredients">
                                            <div class="item-slot-row">
                                                ${await this.getImage(this.recipe[0][0])}
                                                ${await this.getImage(this.recipe[0][1])}
                                                ${await this.getImage(this.recipe[0][2])}
                                            </div>
                                            <div class="item-slot-row">
                                                ${await this.getImage(this.recipe[1][0])}
                                                ${await this.getImage(this.recipe[1][1])}
                                                ${await this.getImage(this.recipe[1][2])}
                                            </div>
                                            <div class="item-slot-row">
                                                ${await this.getImage(this.recipe[2][0])}
                                                ${await this.getImage(this.recipe[2][1])}
                                                ${await this.getImage(this.recipe[2][2])}
                                            </div>
                                        </div>
                                        ${await this.getImage("tm")}
                                    </div>`
        document.getElementById('tm-list').appendChild(this.element);
    }

    // This funtion get item image and add a tooltip for it
    async getImage(item){
        let maxLoop = undefined;
        let nameChange = undefined;
        let otherURL = undefined;
        switch (item) {
            // No Item
            case "":
                return `<div class="item-slot"></div>`

            // Type Gems and Blank Discs and some other items are in seperate folder, so they need their own category
            // Blank Disc
            case "copper_blank_disc":
            case "iron_blank_disc":
            case "gold_blank_disc":
            case "diamond_blank_disc":
            case "netherite_blank_disc":
            case "emerald_blank_disc":
            // Type Gems
            case "normal_gem":
            case "fire_gem":
            case "water_gem":
            case "grass_gem":
            case "electric_gem":
            case "ice_gem":
            case "fighting_gem":
            case "poison_gem":
            case "ground_gem":
            case "flying_gem":
            case "psychic_gem":
            case "bug_gem":
            case "rock_gem":
            case "ghost_gem":
            case "dragon_gem":
            case "dark_gem":
            case "steel_gem":
            case "fairy_gem":
            // Others
            case "iron_ingot":
            case "emerald":
            case "diamond":
                return `<div class="item-slot" style="text-transform: capitalize;"><img src="../images/items/${item}.png"><span class="item-tooltip">${item.replaceAll("_", " ")}</span></div>`

            // Result TM use larger item slot, also crafting file doesn't contain result item. I twisted it.
            case "tm":
                return `<div class="crafting-interface-result">
                            <div class="item-slot item-slot-large"><img src="images/tm_type/${this.type}.png"><span class="item-tooltip">TM-${this.index}: ${this.name}</span></div>
                        </div>`

            // The slot contain multiple image directory so that it can loop around.
            case "crossbow": maxLoop = 2; break;
            case "seeds": maxLoop = 10; break;
            case "leaves": maxLoop = 11; break;
            case "small_flowers": maxLoop = 13; break;
            case "beds": maxLoop = 15; break;
            case "firework_star": maxLoop = 16; break;
            case "music_discs": maxLoop = 18; break;
            case "mints": maxLoop = 20; break;
            case "potion":
            case "splash_potion":
            case "tipped_arrow":
            case "boats": maxLoop = 21; break;
            case "flowers": otherURL = `images/flowers/${item}_0.png`, maxLoop = 25; break;
            case "poke_balls": nameChange = "Poké Balls"; maxLoop = 47; break;
            case "berries": maxLoop = 70; break;

            // For item that already in their tag
            case "enigma_berry":
            case "figy_berry": otherURL = "images/berries_3.png"; break;
            case "pink_petals": otherURL = "images/berries_2.png"; break;
            case "wither_rose": otherURL = "images/small_flowers_12.png"; break;

            // Animated Texture
            case "experience_bottle": nameChange = "Bottle o' Enchanting";
            case "clock":
            case "written_book":
            case "enchanted_book":
            case "magma_block":
            case "sculk_sensor":
            case "sculk_shrieker":
                otherURL = `images/${item}.gif`;
                break;

            // Correct Vanilla mistake
            case "scute":
                item = "turtle_scute"
                break;
            // Fixed Cobblemon Typo
            case "x_defence":
                item = "x_defense"
                break;

            // Custom name
            case "kings_rock": nameChange = "King's rock"; break;
            case "ender_eye": nameChange = "Eye of Ender"; break;
        }

        return `<div class="item-slot" style="text-transform: capitalize;">
                    <img src="${ otherURL ? otherURL :
                                maxLoop ? `images/${item}_0.png` : 
                                            `images/${item}.png`}"
                                ${maxLoop ? `class="loop" data-max-loop=${maxLoop}` : "" }>
                    <span class="item-tooltip">${ nameChange ? nameChange : item.replaceAll("_", " ")}
                    </span>
                </div>`
    }

    async changeImg(){
        let img = this.element.querySelector('.loop')
        const imgName = img.src.slice(- img.src.split("").reverse().join("").indexOf('/'))
        let imageNumber = Number(imgName.slice(-6,-4).replace('_',''))
        this.element.querySelector('.loop').src = this.element.querySelector('.loop').src.replace( `${imgName}`,`${imgName.replace(`${imageNumber}`, `${imageNumber == Number(img.dataset.maxLoop) ? 0 : imageNumber + 1}`)}`)
    }

}

// Get list of recipe
const moves = await readFiles('crafting recipes/manifest.json')

// Create all recipe
for (const i in moves) {
    moves[i] = await createBlock(moves[i], await readFiles(`crafting recipes/${moves[i]}.json`), TMBlock);
    moves[i].drawBlock();
    if (moves[i].element.querySelector('.loop')) moves[i].changeImg();
}

// Search function that will display when there's a match string in the move's name.
// For example. Type 'ab' -> 'ABsorb' and 'poison jAB' is match. Only 2 of them is shown.
document.getElementById('search').onkeyup = () => {
    const search_input = document.getElementById("search").value.toUpperCase();
    for (const i in moves) moves[i].element.style.display = moves[i].name.toUpperCase().indexOf(search_input) > -1 ? '': 'none'
}

// A loop that will change image every 1.5 seconds.
setInterval(() => { for (const i in moves) if (moves[i].element.querySelector('.loop')) moves[i].changeImg(); }, 1500)