
import React, { useState } from "react";

const SIGNS = ["★", "♠", "♥", "♦", "♣", "☀", "☂", "⚡", "☯", "◆"];

export default function App() {
  const [entry, setEntry] = useState(100);
  const [prize, setPrize] = useState(1000);
  const [counts, setCounts] = useState(Array(10).fill(0));
  const [winningSign, setWinningSign] = useState(null);
  const [history, setHistory] = useState([]);

  const totalPlayers = counts.reduce((a, b) => a + b, 0);
  const collection = totalPlayers * entry;
  const winners = winningSign === null ? 0 : counts[winningSign];
  const payout = winners * prize;
  const profit = collection - payout;
  const expectedProfit = totalPlayers * (entry - prize / 10);

  const money = n => "$" + n.toLocaleString("en-US");

  function updateCount(i, value) {
    const next = [...counts];
    next[i] = Math.max(0, Math.floor(Number(value) || 0));
    setCounts(next);
    setWinningSign(null);
  }

  function randomDistribution() {
    const next = Array(10).fill(0);
    for (let i = 0; i < 15; i++) {
      next[Math.floor(Math.random() * 10)]++;
    }
    setCounts(next);
    setWinningSign(null);
  }

  function revealSign() {
    if (totalPlayers === 0) {
      alert("Add participants first!");
      return;
    }

    const result = Math.floor(Math.random() * 10);
    const winnerCount = counts[result];
    const totalPayout = winnerCount * prize;
    const resultProfit = collection - totalPayout;

    setWinningSign(result);

    setHistory(old => [{
      round: old.length + 1,
      sign: SIGNS[result],
      players: totalPlayers,
      winners: winnerCount,
      collection,
      payout: totalPayout,
      profit: resultProfit
    }, ...old]);
  }

  function resetGame() {
    setCounts(Array(10).fill(0));
    setWinningSign(null);
    setHistory([]);
  }

  const panel = {
    background: "#151e32",
    border: "1px solid #293650",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20
  };

  const muted = { color: "#9caec5" };

  const field = {
    background: "#0b1020",
    color: "white",
    border: "1px solid #3a4b65",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    boxSizing: "border-box"
  };

  const button = {
    background: "#6366f1",
    color: "white",
    border: 0,
    borderRadius: 9,
    padding: "13px 18px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  function stat(label, value, color = "#fff") {
    return (
      <div style={{
        background: "#0b1020",
        padding: 17,
        borderRadius: 11,
        border: "1px solid #293650"
      }}>
        <div style={{ ...muted, fontSize: 13 }}>{label}</div>
        <div style={{
          fontSize: 23,
          fontWeight: "bold",
          color,
          marginTop: 9
        }}>{value}</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b1020",
      color: "#f8fafc",
      fontFamily: "Arial, sans-serif",
      padding: 24
    }}>
      <main style={{ maxWidth: 1050, margin: "auto" }}>

        <header style={{ marginBottom: 25 }}>
          <div style={{ color: "#818cf8", letterSpacing: 2 }}>
            ACADEMIC CASE STUDY
          </div>
          <h1 style={{ fontSize: 36 }}>
            Gambling Game Simulator
          </h1>
          <p style={muted}>
            Ten signs. One random reveal. Multiple possible winners.
          </p>
        </header>

        <section style={panel}>
          <h2>Game Configuration</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 15
          }}>
            <label>
              <span style={muted}>Entry Fee ($)</span>
              <input type="number" min="0" value={entry}
                style={field}
                onChange={e => {
                  setEntry(Math.max(0, Number(e.target.value)));
                  setWinningSign(null);
                }} />
            </label>
            <label>
              <span style={muted}>Winning Payout ($)</span>
              <input type="number" min="0" value={prize}
                style={field}
                onChange={e => {
                  setPrize(Math.max(0, Number(e.target.value)));
                  setWinningSign(null);
                }} />
            </label>
          </div>
          <p style={muted}>
            Winning payout includes the original $100 entry fee.
          </p>
        </section>

        <section style={panel}>
          <h2>Participant Sign Selection</h2>
          <p style={muted}>
            Enter the number of participants who selected each sign.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(125px,1fr))",
            gap: 12
          }}>
            {SIGNS.map((sign, i) => (
              <div key={i} style={{
                background: "#0b1020",
                border: winningSign === i
                  ? "2px solid #34d399"
                  : "1px solid #293650",
                borderRadius: 12,
                padding: 14,
                textAlign: "center"
              }}>
                <div style={{ fontSize: 32 }}>{sign}</div>
                <div style={muted}>Sign {i + 1}</div>
                <input type="number" min="0" step="1"
                  value={counts[i]}
                  style={{ ...field, marginTop: 10, textAlign: "center" }}
                  onChange={e => updateCount(i, e.target.value)} />
                <small style={muted}>Participants</small>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 20
          }}>
            <button style={button} onClick={randomDistribution}>
              Randomly Assign 15 Players
            </button>
            <button style={{ ...button, background: "#334155" }}
              onClick={() => {
                setCounts(Array(10).fill(0));
                setWinningSign(null);
              }}>
              Clear Selections
            </button>
          </div>

          <h3>Total Participants: {totalPlayers}</h3>
        </section>

        <section style={panel}>
          <h2>Reveal the Winning Sign</h2>
          <p style={muted}>
            One of the ten signs is selected randomly in each round.
          </p>

          <button style={{ ...button, width: "100%", padding: 17 }}
            onClick={revealSign}>
            REVEAL WINNING SIGN
          </button>

          {winningSign !== null && (
            <div style={{
              marginTop: 20,
              padding: 25,
              background: "#0b1020",
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #34d399"
            }}>
              <p style={muted}>Winning Sign</p>
              <div style={{ fontSize: 70 }}>
                {SIGNS[winningSign]}
              </div>
              <h2 style={{ color: "#34d399" }}>
                {winners} Winner{winners !== 1 ? "s" : ""}
              </h2>
              <p>{totalPlayers - winners} participants lost their entry fee.</p>
              <h3>Total Payout: {money(payout)}</h3>
            </div>
          )}
        </section>

        <h2>Financial Dashboard</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 12,
          marginBottom: 20
        }}>
          {stat("Total Collection", money(collection))}
          {stat("Number of Winners",
            winningSign === null ? "—" : winners)}
          {stat("Total Payout",
            winningSign === null ? "—" : money(payout))}
          {stat("Actual Profit / Loss",
            winningSign === null ? "Awaiting round" : money(profit),
            winningSign === null ? "#fff" :
              profit >= 0 ? "#34d399" : "#fb7185")}
        </div>

        <section style={panel}>
          <h2>Expected Financial Performance</h2>
          <p style={muted}>
            Assuming all ten signs are equally likely.
          </p>
          <h2>{money(expectedProfit)}</h2>
          <p style={muted}>
            Expected organiser profit per round before expenses.
            This is an average, not a guaranteed result.
          </p>
        </section>

        <section style={panel}>
          <h2>Round History ({history.length})</h2>
          {history.length === 0 ? (
            <p style={muted}>No rounds played yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 580
              }}>
                <thead>
                  <tr>
                    {["Round", "Sign", "Players", "Winners",
                      "Collection", "Payout", "Profit/Loss"].map(x => (
                      <th key={x} style={{
                        padding: 10,
                        textAlign: "left",
                        borderBottom: "1px solid #334155"
                      }}>{x}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.round}>
                      <td style={{ padding: 10 }}>{item.round}</td>
                      <td style={{ padding: 10 }}>{item.sign}</td>
                      <td style={{ padding: 10 }}>{item.players}</td>
                      <td style={{ padding: 10 }}>{item.winners}</td>
                      <td style={{ padding: 10 }}>{money(item.collection)}</td>
                      <td style={{ padding: 10 }}>{money(item.payout)}</td>
                      <td style={{
                        padding: 10,
                        color: item.profit >= 0 ? "#34d399" : "#fb7185"
                      }}>{money(item.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <button style={{ ...button, background: "#475569", width: "100%" }}
          onClick={resetGame}>
          RESET ENTIRE SIMULATION
        </button>

        <footer style={{
          textAlign: "center",
          color: "#718096",
          padding: 25,
          fontSize: 12
        }}>
          Educational simulation only · No real-money transactions
        </footer>

      </main>
    </div>
  );
}
