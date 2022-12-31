import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import { Button, CircularProgress } from "@mui/material";
import _ from "lodash";
import { createRef, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import CardList from "./CardList";
import ClearMatch from "./ClearMatch";
import NewCard from "./NewCard";

const Creator = (props) => {
  const sampleRef = createRef();
  const [dataLoading, isDataLoading] = useState(true);
  const [showSample, changeShowSample] = useState(false);
  const [clearDialogVisible, changeClearDialogVisible] = useState(false);
  const [matchData, changeMatchData] = useState({
    matchData: [],
    lastBallExtra: false,
  });
  const [appRenderedFirstTime, changeAppRenderedFirstTime] = useState(true);
  const checkDataValidity = async (newRecord) => {
    const latestResult = await fetch(
      "https://cricket-627d5-default-rtdb.asia-southeast1.firebasedatabase.app/data.json"
    );
    if (latestResult.ok) {
      const data = await latestResult.json();
      if (_.isEqual(data, matchData)) {
        return true;
      }
      if (data === "" && matchData.matchData.length === 0) {
        if (newRecord.ballInfo.over != 0 || newRecord.ballInfo.ball != 1)
          return false;
        return true;
      }
    }
    return false;
  };
  const addMatchRecord = async (newRecord, lastBallExtra) => {
    isDataLoading(true);
    const dataValid = await checkDataValidity(newRecord);
    isDataLoading(false);
    if (dataValid) {
      const matchedOver = matchData.matchData.find(
        (item) =>
          item.ballInfo.over === newRecord.ballInfo.over &&
          item.ballInfo.ball === newRecord.ballInfo.ball
      );
      let changedMatchData = null;
      if (matchedOver && !matchedOver.nextBallStarted) {
        changedMatchData = matchData.matchData.filter(
          (item) => item !== matchedOver
        );
      } else changedMatchData = matchData.matchData.map((item) => item);
      changedMatchData.unshift(newRecord);
      changeMatchData({
        matchData: changedMatchData,
        lastBallExtra: lastBallExtra,
      });
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (appRenderedFirstTime) {
      return;
    }
    const putData = async () => {
      const result = await fetch(
        "https://cricket-627d5-default-rtdb.asia-southeast1.firebasedatabase.app/data.json",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchData.matchData.length > 0 ? matchData : ""),
        }
      );
    };
    isDataLoading(true);
    putData();
    isDataLoading(false);
  }, [matchData]);

  const getMatchData = async () => {
    isDataLoading(true);
    const result = await fetch(
      "https://cricket-627d5-default-rtdb.asia-southeast1.firebasedatabase.app/data.json"
    );
    if (result.ok) {
      const data = await result.json();
      changeMatchData(data ? data : { matchData: [], lastBallExtra: false });
    }
    changeAppRenderedFirstTime(false);
    isDataLoading(false);
  };

  useEffect(() => {
    if(showSample)
    {
      sampleRef.current?.scrollIntoView({behavior: 'smooth', block:'start'});
    }
  }, [showSample]);

  useEffect(() => {
    if (appRenderedFirstTime) {
      getMatchData();
      return;
    }
  });

  const endGame = async () => {
    changeMatchData({
      matchData: [],
      lastBallExtra: false,
    });
    changeClearDialogVisible(false);
  };

  const handleClearMatchDialogClose = () => {
    changeClearDialogVisible(false);
  };

  const getNextBall = (
    currentOver,
    currentBall,
    lastBallExtra = false,
    nextBallStarted = false
  ) => {
    if (lastBallExtra || !nextBallStarted) {
      return {
        over: currentOver,
        ball: currentBall,
      };
    }
    if (currentBall != 6)
      return {
        over: currentOver,
        ball: currentBall + 1,
      };
    return {
      over: currentOver + 1,
      ball: 1,
    };
  };

  const getNewCardObject = () => {
    if (matchData.matchData.length === 0) {
      return {
        ballInfo: {
          over: 0,
          ball: 1,
        },
        batsmenInfo: {
          onStrike: "",
          offStrike: "",
        },
        batsmenInfoAfterDismissal: {
          onStrike: "",
          offStrike: "",
        },
        ballType: "RG",
        resultType: "NN",
        bowlerInfo: "",
        runsScored: 0,
        runsUntilLastBall: 0,
        extras: 0,
        lastBallExtra: false,
        commentary: "",
      };
    } else if (matchData.matchData[0].nextBallStarted) {
      return {
        ...matchData.matchData[0],
        lastBallExtra: matchData.lastBallExtra,
        ballInfo: getNextBall(
          matchData.matchData[0].ballInfo.over,
          matchData.matchData[0].ballInfo.ball,
          matchData.lastBallExtra,
          matchData.matchData[0].nextBallStarted
        ),
        ballType: "RG",
        resultType: "NN",
        runsScored: 0,
        extras: 0,
        nextBallStarted: false,
      };
    } else {
      return {
        ...matchData.matchData[0],
        lastBallExtra: matchData.lastBallExtra,
        ballInfo: getNextBall(
          matchData.matchData[0].ballInfo.over,
          matchData.matchData[0].ballInfo.ball,
          matchData.lastBallExtra,
          matchData.matchData[0].nextBallStarted
        ),
      };
      /*return {
        ballInfo: getNextBall(
          matchData[0].ballInfo.over,
          matchData[0].ballInfo.ball,
          props.lastBallExtra,
          matchData[0].nextBallStarted
        ),
        batsmenInfo: {
          onStrike: "",
          offStrike: "",
        },
        batsmenInfoAfterDismissal: {
          onStrike: "",
          offStrike: "",
        },
        ballType: matchData[0].ballType,
        resultType: matchData[0].resultType,
        bowlerInfo: "",
        runsScored: matchData.runsScored,
        runsUntilLastBall: matchData[0].runsUntilLastBall,
        extras: 0,
        lastBallExtra: matchData.lastBallExtra,
        commentary:matchData[0].commentary,
      };*/
    }
  };
  return (
    <>
      {dataLoading && ReactDOM.createPortal(
        <div className="spinnerContainer">
          <CircularProgress />
        </div>,
        document.getElementById("modal")
      )}
      {!dataLoading && (
        <>
          <NewCard
            matchData={getNewCardObject()}
            addMatchRecord={addMatchRecord}
          />
          <div className="card">
            <Button
              style={{ width: "100%" }}
              onClick={(event) => {
                changeClearDialogVisible((prev) => !prev);
              }}
              variant="outlined"
              color="error"
            >
              Clear This Match
            </Button>
          </div>
          <ClearMatch
            endGame={endGame}
            open={clearDialogVisible}
            handleClose={handleClearMatchDialogClose}
          />
          <div style={{display:'flex', justifyContent:'center'}}>
          <button onClick={() => {
            changeShowSample((prev) => {
              return !prev;
            });
          }}>
            { 
            !showSample ?
            <KeyboardDoubleArrowDownRoundedIcon/> : <KeyboardDoubleArrowUpRoundedIcon/>
}
            </button>
          </div>
          { <CardList style={{display: !showSample && 'none' }} ref={sampleRef} matchData={matchData.matchData}/>}
        </>
      )}
    </>
  );
};

export default Creator;
