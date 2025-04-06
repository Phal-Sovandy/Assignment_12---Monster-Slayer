import React, { useState, useEffect } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [logs, setLogs] = useState([]); // For logs history
  const [playerHealth, setPlayerHealth] = useState(100); // player health
  const [monsterHealth, setMonsterHealth] = useState(100); // moster health
  const [result, setResult] = useState("Win"); // game result (Is player the winner?)

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  // For restarting game
  function restartGame() {
    setMonsterHealth(100);
    setPlayerHealth(100);
    setLogs([])
    window.alert("Game Restarted!");
  }
  // Handle for both normal attack and special attack
  function handleAttack(min, max) {
    const damage = getRandomValue(min, max);
    setMonsterHealth((m) => {
      const attacked = m - damage;
      return attacked < 0 ? 0 : attacked;
    });

    //Player also take damages from monster
    const playerTakeDamage = getRandomValue(5, 15);
    if(monsterHealth > 0){
      setPlayerHealth(p => {
        const attacked = p - playerTakeDamage;
        return attacked < 0 ? 0 : attacked;
      })
    }
    setLogs((l) => [...l, createLogAttack(false, damage)]);
    setLogs((l) => [...l, createLogAttack(true, playerTakeDamage)]);
  }
  // Handle when player healing
  function handleHeal() {
    const healing = getRandomValue(8, 15);
    setPlayerHealth((p) => {
      const heal = p + healing;
      return heal > 100 ? 100 : heal;
    });
    setLogs((l) => [...l, createLogHeal(healing)]);
  }
  // Handle player kills themself
  function handleSuicide() {
    setPlayerHealth(0);
    setLogs((l) => [...l, createLogAttack(true, 100)]);
  }
  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  // For each entity Player and Monster
  function Entity({ entityHealth, entityName }) {
    return (
      <section className={`container ${entityName}`}>
        <h2>{entityName} Health</h2>
        <div className="healthbar">
          <div
            style={{ width: `${entityHealth}%` }}
            className="healthbar__value"
          ></div>
        </div>
      </section>
    );
  }

  // For game result
  function GameOver({ title }) {
    return (
      <section className="container result">
        <h2>Game Over!</h2>
        <h3>You {title}</h3>
        <button onClick={restartGame}>Start New Game</button>
      </section>
    );
  }

  // For game controls like Attack, Heal,...
  function GameControls() {
    return (
      <section id="controls">
        <button
          onClick={() => handleAttack(5, 12)}
          disabled={monsterHealth <= 0 || playerHealth <= 0}
        >
          ATTACK
        </button>
        <button
          onClick={() => handleAttack(8, 25)}
          disabled={monsterHealth <= 0 || playerHealth <= 0}
        >
          SPECIAL !
        </button>
        <button
          onClick={handleHeal}
          disabled={playerHealth <= 0 || playerHealth >= 100}
        >
          HEAL
        </button>
        <button onClick={handleSuicide} disabled={playerHealth <= 0}>
          KILL YOURSELF
        </button>
      </section>
    );
  }

  // For game's logs
  function Log({ logMessages }) {
    const recentLogs = [...logMessages].reverse();
    return (
      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {recentLogs.map((message, index) => (
            <li key={index}>
              <span
                className={message.isPlayer ? "log--player" : "log--monster"}
              >
                {message.isPlayer ? "Player" : "Monster"}
              </span>
              <span
                className={message.isDamage ? "log--damage" : "log--heal"}
              >
                {message.text}
              </span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Track and change the game result every time the Player and/or Mosnter health changes
  useEffect(() => {
    if (playerHealth <= 0 && monsterHealth > 0) {
      setResult("Lose");
    } else if (monsterHealth <= 0 && playerHealth > 0) {
      setResult("Win");
    } else if (playerHealth <= 0 && monsterHealth <= 0) {
      setResult("and Monster are Draw");
    }
  }, [playerHealth, monsterHealth]);
  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <Entity entityName="Monster" entityHealth={monsterHealth} />
      <Entity entityName="Player" entityHealth={playerHealth} />
      {playerHealth === 0 || monsterHealth === 0 ? (
        <GameOver title={result} />
      ) : null}
      <GameControls />
      <Log logMessages={logs} />
    </>
  );
}

export default Game;
