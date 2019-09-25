import _ from 'lodash';

/**
 * Utility function that shuffles a list into a given number of sub-groups
 * @param { Array } names list of strings
 * @param { Number } numSquads the number of sub-groups
 * @return { Array } an array of length numSquads where each element is an array of strings containing elements from the input names array.
 */
export default (names, numSquads) => {
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