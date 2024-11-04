import React, { useEffect, useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { IoCart } from "react-icons/io5";
import "./WingoControl.css";
import {
  fetchData,
  formatDateString,
  formatSeconds,
  formatTime,
  postData,
} from "../../Api/Clientfunctions";
import { useSocket } from "../../context/SocketContext";

import { toast } from "react-toastify";
const initialLimit = 10;
function getMappedValue(input) {
  switch (input) {
    case "l":
      return "Big";
    case "n":
      return "Small";
    case "t":
      return "Violet";
    case "d":
      return "Red";
    case "x":
      return "Green";
    default:
      return input;
  }
}
const MinuteSelection = ({ minuteObj, setGame, game }) => {
  return (
    <div className="wingo-header">
      {minuteObj.map((item, key) => (
        <div
          onClick={() => setGame(item.contentMin)}
          className={`minute-part ${
            item.betMin.startsWith(`${game}M`) ? "wingo-block" : ""
          }`}
          key={key}
        >
          <div className="btn-part">
            <h1>{item.betMin}</h1>
          </div>
          <div className="wingo-det">
            <h4>WinGO {item.contentMin} min</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

const BetDisplay = ({ game, round }) => {
  const [liveStats, setLiveStats] = useState({});

  const fetchGameStats = `wingo/wingogamestats?period=${round}&game=${game}`;
  const { data: gameStats } = useSWR(fetchGameStats, fetchData, {
    refreshInterval: 3000,
  });

  useEffect(() => {
    if (gameStats && gameStats.counts) {
      setLiveStats(gameStats.counts);
    }
  }, [gameStats]);

  const wingoBet = [
    {
      icon: <IoCart />,
      BgColor: "#E9330C",
      ColorName: "Red",
      Value: liveStats?.red,
    },
    {
      icon: <IoCart />,
      BgColor: "#9917F3",
      ColorName: "Violet",
      Value: liveStats?.violet,
    },
    {
      icon: <IoCart />,
      BgColor: "#329A0E",
      ColorName: "Green",
      Value: liveStats?.green,
    },
    {
      icon: <IoCart />,
      BgColor: "#0FD7EE",
      ColorName: "Total",
      Value: liveStats?.total,
    },
    { icon: "0", BgColor: "#0F85EE", ColorName: "0", Value: liveStats?.zero },
    { icon: "1", BgColor: "#0F85EE", ColorName: "1", Value: liveStats?.one },
    { icon: "2", BgColor: "#0F85EE", ColorName: "2", Value: liveStats?.two },
    { icon: "3", BgColor: "#0F85EE", ColorName: "3", Value: liveStats?.three },
    { icon: "4", BgColor: "#0F85EE", ColorName: "4", Value: liveStats?.four },
    { icon: "5", BgColor: "#0F85EE", ColorName: "5", Value: liveStats?.five },
    { icon: "6", BgColor: "#0F85EE", ColorName: "6", Value: liveStats?.six },
    { icon: "7", BgColor: "#0F85EE", ColorName: "7", Value: liveStats?.seven },
    { icon: "8", BgColor: "#0F85EE", ColorName: "8", Value: liveStats?.eight },
    { icon: "9", BgColor: "#0F85EE", ColorName: "9", Value: liveStats?.nine },
    { icon: "B", BgColor: "#0F85EE", ColorName: "Big", Value: liveStats?.big },
    {
      icon: "S",
      BgColor: "#0F85EE",
      ColorName: "Small",
      Value: liveStats?.small,
    },
  ];

  return (
    <div className="wingo-header">
      {wingoBet.map((item, key) => (
        <div className="minute-part" key={key}>
          <div
            className="btn-part-wingo"
            style={{ backgroundColor: item.BgColor }}
          >
            {item.icon || <IoCart />}
          </div>
          <div className="wingo-det-join">
            <h4>
              {item.ColorName === "Total" ? "Total" : `Join ${item.ColorName}`}
            </h4>
            <h5>{item.Value}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

const GameHistoryTable = ({
  game,
  pagination,
  setPagination,
  generateColor,
}) => {
  const [gameHistory, setGameHistory] = useState([]);

  const fetchGameHistory = `wingo/gamehistory?game=${game}&page=${pagination.gpage}&limit=${initialLimit}`;
  const { data: gameData } = useSWR(fetchGameHistory, fetchData);

  useEffect(() => {
    if (gameData && gameData.games) {
      const processedData = gameData.games.map((item) => ({
        period: item.period,
        result: item.result,
        bigSmall: item.result >= 5 ? "Big" : "Small",
        color: generateColor(item.result),
      }));
      setGameHistory(processedData);
      setPagination((prev) => ({
        ...prev,
        gtpage: Math.ceil(gameData.length / initialLimit),
      }));
    }
  }, [gameData, generateColor, setPagination]);

  const handlePageChange = (type, direction) => {
    setPagination((prev) => {
      const newPage = direction === "next" ? prev[type] + 1 : prev[type] - 1;
      return {
        ...prev,
        [type]: Math.max(newPage, 1),
      };
    });
  };

  return (
    <div className="data-table">
      <div className="table-heading-part">
        <h1 className="user-id">Past Game Result History</h1>
      </div>
      <div className="table-parent">
        <div className="table-part">
          <div className="table-head-row">
            <div className="table-periods">Periods</div>
            <div className="table-periods">Number</div>
            <div className="table-periods">Big/Small</div>
            <div className="table-periods">Color</div>
          </div>
          {gameHistory.map((item, index) => (
            <div className="table-data-column" key={index}>
              <div className="periods-id">
                <div className="item-period">{item.period}</div>
              </div>
              <div className="periods-id">
                <div className="item-period">{item.result}</div>
              </div>
              <div className="periods-id">
                <div className="item-period">{item.bigSmall}</div>
              </div>
              <div className="periods-id">
                <div className="item-period">
                  {item.color.map((color, colorIndex) => (
                    <span
                      className="color-part"
                      key={colorIndex}
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="page-button">
            <div className="page-btn">
              <button
                onClick={() => handlePageChange("gpage", "prev")}
                disabled={pagination.gpage === 1}
              >
                Prev
              </button>
              <div className="number-pages">
                {pagination.gpage}/{pagination.gtpage}
              </div>
              <button
                onClick={() => handlePageChange("gpage", "next")}
                disabled={pagination.gpage === pagination.gtpage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const CurrentRoundBets = ({
  game,
  pagination,
  setPagination,
  generateColor,
  round,
}) => {
  const [gameHistory, setGameHistory] = useState([]);
  const FetchCurrentRoundBets = `wingo/curroundbets?game=${game}&page=${pagination.cpage}&period=${round}&limit=${initialLimit}`;
  const { data: gameData } = useSWR(FetchCurrentRoundBets, fetchData);
  useEffect(() => {
    if (gameData && gameData?.curBets) {
      const processedData = gameData.curBets.map((item) => ({
        name: item.name,
        period: item.stage,
        betAmount: item.betAmount,
        game: item.game,
        // time: formatDateString(item.time),
        bet: getMappedValue(item.bet),
      }));
      setGameHistory(processedData);
      setPagination((prev) => ({
        ...prev,
        ctpage: Math.ceil(gameData.length / initialLimit),
      }));
    }
  }, [gameData, generateColor, setPagination]);

  const handlePageChange = (type, direction) => {
    setPagination((prev) => {
      const newPage = direction === "next" ? prev[type] + 1 : prev[type] - 1;
      return {
        ...prev,
        [type]: Math.max(newPage, 1),
      };
    });
  };

  return (
    <div className="data-table">
      <div className="table-heading-part">
        <h1 className="user-id">Current Round All Bets</h1>
      </div>
      <div className="table-part">
        <div className="table-head-row">
          <div className="table-periods">Name</div>
          <div className="table-periods">Period</div>
          <div className="table-periods">BetAmount</div>
          <div className="table-periods">Game</div>
          <div className="table-periods">Bet</div>
          {/* <div className="table-periods">Time</div> */}
        </div>
        {gameHistory.map((item, index) => (
          <div className="table-data-column" key={index}>
            <div className="periods-id">
              <div className="item-period">{item.name}</div>
            </div>
            <div className="periods-id">
              <div className="item-period">{item.period}</div>
            </div>
            <div className="periods-id">
              <div className="item-period">{item.betAmount}</div>
            </div>
            <div className="periods-id">
              <div className="item-period">{item.game}</div>
            </div>
            <div className="periods-id">
              <div className="item-period">{item.bet}</div>
            </div>
            {/* <div className="periods-id">
              <div className="item-period">{item.time}</div>
            </div> */}
          </div>
        ))}
        <div className="page-button">
          <div className="page-btn">
            <button
              onClick={() => handlePageChange("gpage", "prev")}
              disabled={pagination.cpage === 1}
            >
              Prev
            </button>
            <div className="number-pages">
              {pagination.cpage}/{pagination.ctpage}
            </div>
            <button
              onClick={() => handlePageChange("gpage", "next")}
              disabled={pagination.cpage === pagination.ctpage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const ResultInput = ({ round, result, setResult, handleSubmit, game }) => {
  const [time, setTime] = useState(0);
  const countdown = `countdown${game}`;
  const socket = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on(countdown, (newTime) => {
        setTime(newTime);
        if (newTime === 0) {
          const fetchCurrentGameData = `wingo/currentgame?game=${game}`;
          mutate(fetchCurrentGameData);
        }
      });
      return () => {
        socket.off(countdown);
      };
    }
  }, [socket, game]);
  const numericValues = formatSeconds(time);
  return (
    <div className="result-part">
      <div className="heading-part-result">
        <h1>Adjusting the result {round}</h1>
        <div className="TimeLeft__C-time">
          {numericValues.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      </div>
      <div className="result-content">
        <h2>
          0 (Red and Purple) | 5 (Green and Purple) | 1, 3, 7, 9 (Green) | 2, 4,
          6, 8 (Red)
        </h2>
        <h5>Next Result: Random</h5>
        <div className="field-input">
          <input
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Enter the result (e.g., 1)"
          />
        </div>
        <div className="submit-btn" onClick={handleSubmit}>
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
};

const WingoControl = () => {
  const [round, setRound] = useState(null);
  const [game, setGame] = useState(1);
  const [result, setResult] = useState("");
  const [pagination, setPagination] = useState({
    gpage: 1,
    gtpage: 1,
    cpage: 1,
    ctpage: 1,
  });

  const generateColor = useCallback((result) => {
    if (result === 0) return ["red", "violet"];
    else if (result === 5) return ["green", "violet"];
    else if (result % 2 === 0) return ["red"];
    else return ["green"];
  }, []);

  const fetchCurrentGameData = `wingo/currentgame?game=${game}`;
  const { data: currentGameData } = useSWR(fetchCurrentGameData, fetchData);

  useEffect(() => {
    if (currentGameData && currentGameData.period) {
      setRound(currentGameData.period);
    }
  }, [currentGameData]);

  const handleSubmit = async () => {
    if (!result.trim() || isNaN(Number(result)) || result.trim().length > 1) {
      toast.warning("Invalid Input");
      return;
    }
    const res = await postData(`wingo/wingoresult`, {
      game: game,
      period: round,
      result: result.trim(),
    });
    if (res.success || res.status) {
      toast.success(res.message || "Success");
      setResult("");
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const minuteObj = [
    { betMin: "1M", contentMin: 1 },
    { betMin: "3M", contentMin: 3 },
    { betMin: "5M", contentMin: 5 },
    { betMin: "10M", contentMin: 10 },
  ];

  return (
    <div className="wingo-container">
      <div className="heading-part">
        <div className="heading-new">
          <h1>Dashboard V5 </h1>
        </div>
      </div>
      <MinuteSelection minuteObj={minuteObj} setGame={setGame} game={game} />
      <BetDisplay game={game} round={round} />
      <GameHistoryTable
        game={game}
        pagination={pagination}
        setPagination={setPagination}
        generateColor={generateColor}
      />
      <CurrentRoundBets
        game={game}
        pagination={pagination}
        setPagination={setPagination}
        generateColor={generateColor}
        round={round}
      />
      <ResultInput
        round={round}
        result={result}
        game={game}
        setResult={setResult}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default WingoControl;
