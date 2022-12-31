import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import CardList from "./CardList";

const Displayer = () => {
  const [dataLoading, isDataLoading] = useState(false);
  const [matchData, changeMatchData] = useState({
    matchData: [],
    lastBallExtra: false,
  });
  useEffect(() => {
    isDataLoading(true);
    const getMatchData = async () => {
      const result = await fetch(
        "https://cricket-627d5-default-rtdb.asia-southeast1.firebasedatabase.app/data.json"
      );
      if (result.ok) {
        const data = await result.json();
        isDataLoading(false);
        changeMatchData(data ? data : { matchData: [], lastBallExtra: false });
      }
    };
    getMatchData();
    setInterval(() => {
      getMatchData();
    }, 30000);
  }, [dataLoading]);

  return (
    <>
      {matchData.matchData.length > 0 && (
        <CardList matchData={matchData.matchData} />
      )}
      {!matchData.matchData.length > 0 && (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'50vh'}}>
          <CircularProgress/>
          <p>Seems like there is no Match live currently.</p>
          <p>Match Data will display here as soon as the game starts.</p>
        </div>
      )}
    </>
  );
};

export default Displayer;
