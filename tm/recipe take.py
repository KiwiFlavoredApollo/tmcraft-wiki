from os import walk
import json

filenames = next(walk('tm/crafting recipes'), (None, None, None))[2]
filenames.remove('manifest.json')

with open('tm/crafting recipes/manifest.json', 'w') as manifest:
    file = []
    for i in filenames:
        with open(f'tm/crafting recipes/{i}', 'r') as f:
            file.append(i.replace('.json', ''))
            data = json.loads(f.read())
            data = data['ingredients']
            for j in range(len(data)):
                if 'item' in data[j]:
                    k = (data[j]['item']).replace('tmcraft:', '')
                    k = k.replace('cobblemon:', '')
                    k = k.replace('minecraft:', '')
                    data[j] = k
                else: 
                    k = (data[j]['tag']).replace('tmcraft:', '')
                    k = k.replace('cobblemon:', '')
                    k = k.replace('minecraft:', '')
                    data[j] = k
            match len(data):
                case 3: data = [['', '', ''], data, ['', '', '']]
                case 4: data = [['', '', ''], [data[0], data[1], ''], [data[2], data[3], '']]
                case 5: data = [['', '', ''], data[0:3], [data[3], data[4], '']]
        # print(data)
        with open(f'tm/crafting recipes/{i}', 'w') as f:
            f.write(json.dumps(data))

    manifest.write(json.dumps(file))