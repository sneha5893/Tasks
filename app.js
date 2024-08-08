const battleForm = document.getElementById('battle-form');
const resultsDiv = document.getElementById('results');

battleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const yourPlatoonsInput = document.getElementById('your-platoons');
    const opponentPlatoonsInput = document.getElementById('opponent-platoons');

    const yourPlatoons = yourPlatoonsInput.value.trim().split('\n');
    const opponentPlatoons = opponentPlatoonsInput.value.trim().split('\n');

    const results = planAttack(yourPlatoons, opponentPlatoons);

    resultsDiv.innerHTML = '';
    results.forEach((platoon, index) => {
        const resultElement = document.createElement('p');
        resultElement.textContent = `#${index + 1}: ${platoon}`;
        resultsDiv.appendChild(resultElement);
    });
});

function getAdvantage(unitClass, opponentUnitClass) {
    const advantages = {
        Militia: ['Spearmen', 'LightCavalry'],
        Spearmen: ['LightCavalry', 'HeavyCavalry'],
        LightCavalry: ['FootArcher', 'CavalryArcher'],
        HeavyCavalry: ['Militia', 'FootArcher', 'LightCavalry'],
        CavalryArcher: ['Spearmen', 'HeavyCavalry'],
        FootArcher: ['Militia', 'CavalryArcher']
    };

    return advantages[unitClass].includes(opponentUnitClass);
}

function battleResult(yourSoldiers, opponentSoldiers, advantage) {
    if (advantage) {
        return yourSoldiers > opponentSoldiers * 2 ? 'You Win' : 'Draw';
    } else {
        return yourSoldiers < opponentSoldiers ? 'You Lose' : 'Draw';
    }
}

function planAttack(yourPlatoons, opponentPlatoons) {
    const results = [];

    for (const yourPlatoon of yourPlatoons) {
        const [platoonClass, yourSoldiers] = yourPlatoon.split('#');
        yourSoldiers = parseInt(yourSoldiers, 10);

        let possibleWins = 0;

        for (const opponentPlatoon of opponentPlatoons) {
            const [opponentClass, opponentSoldiers] = opponentPlatoon.split('#');
            opponentSoldiers = parseInt(opponentSoldiers, 10);

            const advantage = getAdvantage(platoonClass, opponentClass);
            const result = battleResult(yourSoldiers, opponentSoldiers, advantage);

            if (result === 'You Win') {
                possibleWins++;
            }
        }

        results.push(`${platoonClass}#${yourSoldiers} - Possible Wins: ${possibleWins}`);
    }

    results.sort((a, b) => {
        const winsA = parseInt(a.split(' - Possible Wins: ')[1], 10);
        const winsB = parseInt(b.split(' - Possible Wins: ')[1], 10);
        return winsB - winsA;
    });

    return results.slice(0, 5);
}
