const firstContact = [
    '5',
    '4',
    '1 1',
    '1 3',
    '3 4',
    '5 2',
    '4 0',
    '3 3',
    '3 1',
    '0 0',
    '-1 4',
]
const realCase = [
    '7',
    '6',
    '1 -2',
    '6 0',
    '0 1',
    '4 -4',
    '5 -3',
    '5 1',
    '3 -4',
    '4 -1',
    '-1 0',
    '4 -3',
    '3 0',
    '0 -4',
    '1 1',
]
const greatBattle = [
    '10',
    '10',
    '9 0',
    '11 1',
    '-5 5',
    '-1 7',
    '3 8',
    '-4 1',
    '-1 -1',
    '7 7',
    '4 -2',
    '11 4',
    '5 -10',
    '-7 0',
    '-5 -8',
    '10 1',
    '10 -7',
    '-1 6',
    '4 6',
    '-7 -4',
    '-6 4',
    '9 3  ',
];
const hugeArea = [
    '14',
    '12',
    '1 5',
    '-7 5',
    '5 0',
    '-8 2',
    '-7 -3',
    '-2 -5',
    '5 -1',
    '4 3',
    '-4 6',
    '1 -5',
    '-6 -4',
    '-8 4',
    '-3 6',
    '4 -3',
    '3 -1',
    '-4 7',
    '-7 0',
    '3 7',
    '-6 5',
    '4 5',
    '-5 -4',
    '-7 2',
    '-6 -3',
    '0 8',
    '1 -4',
    '1 8',
];

const noContact = [
    '5',
    '5',
    '6 -3',
    '6 -10',
    '3 -3',
    '3 -10',
    '0 -6',
    '-5 5',
    '-5 0',
    '0 0',
    '5 0',
    '0 5'
];

const sideSuperposition = [
    '4',
    '4',
    '0 0',
    '5 5',
    '5 0',
    '0 5',
    '-2 5',
    '3 0',
    '-2 0',
    '3 5'
];

export const battles = {
    firstContact,
    realCase,
    greatBattle,
    hugeArea,
    noContact,
    sideSuperposition
};

Object.keys(battles).map(function(key, index) {
    battles[key] = toBattles(battles[key]);
});

function initPolygon(nVertices, input) {
    const polygon = [];
    for (let i = 0; i < nVertices; i++) polygon.push(input.shift().split(' ').map(Number));
    return polygon;
}

/**
 * Transforms an input [nVertices, mVertices, n..., m...] to an object {A: n..., B: n...}.
 *
 * @param input
 * @return {{A: [], B: []}}
 */
function toBattles(input) {
    const n = +input.shift(), m = +input.shift();
    const A = initPolygon(n, input), B = initPolygon(m, input);
    return {A, B};
}
