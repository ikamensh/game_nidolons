
class AI {

    //TODO mind the walls! (hanging now)

    static wonderingFightBack(/*Unit*/ unit, /*Grid*/ grid, /*Unit*/ theHero, /*Array<Unit>*/ allies) {

        /*Hex[]*/
        let possibleMoves = grid.getMovableHexes(unit, 1);

        if (possibleMoves.length) {

            //If Helene is near, most likely attack!
            for (let hex of possibleMoves) {
                if (hex.content === theHero) {
                    if (Math.random() > 0.36) {
                        grid.goTo(hex, unit);
                        return;
                    }
                }
            }

            //maybe do nothing?
            if (Math.random() > 0.50) {
                return;
            }

            //else lets get rolling
            let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            if (randomMove.content && allies.indexOf(randomMove.content) !== -1) {
                //maybe do nothing?
                if (Math.random() > 0.50) {
                    return;
                }
                //lets give him a chance, or else! (rerandom - perhaps we will not kick an ally!)
                return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

            }
            return randomMove;

        }
    };

    static pursueAndFight(/*Unit*/ unit, /*Grid*/ grid, /*Unit*/ theHero,) {
        /*Hex[]*/
        let possibleMoves = grid.getMovableHexes(unit, 1);

        if (possibleMoves.length) {
            let closestToTarget = possibleMoves[0];
            let distToTarget = grid.getHexDistance(closestToTarget, theHero.hex);
            for (let hex of possibleMoves) {
                if (grid.getHexDistance(hex, theHero.hex) < distToTarget) {

                    distToTarget = grid.getHexDistance(hex, theHero.hex);
                    closestToTarget = hex;
                }
            }

            return closestToTarget;

        }
    };
}

export {AI}