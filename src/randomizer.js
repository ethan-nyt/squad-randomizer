import _ from 'lodash';

export const randomizer = (names, numSquads) => {
    const squads = [];
    for (let i = 0; i < numSquads; i++) {
        squads.push([]);
    }
    const shuffledNames = _.shuffle(names);
    const squadSize = Math.ceil(names.length / numSquads);
    return shuffledNames.reduce((squads, name, i) => {
        const squadIdx = i % numSquads;
        squads[squadIdx].push(name);
        return squads;
    }, squads);
}