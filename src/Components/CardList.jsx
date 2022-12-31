import React from "react";
import "./CardList.css";

const CardList = React.forwardRef(({ matchData, style }, ref) => {
  const extractLastThirtyRecords = () => {
    if(matchData.length < 30)
        return matchData;
        const newMatchData = [];
    for(let i = 0;i<30;i++)
    {
        newMatchData.push(matchData[i]);
    }
    return newMatchData;
}
  return (
    <div ref={ref} style={style} className="card">
      {extractLastThirtyRecords().map((element, index) => (
        <div className="card" key={index}>
          <div className="keyIndicators">
            <div className="runs">{element.runsScored + " runs"}</div>
            {element.ballType !== "RG" && (
              <div className="extras">{element.ballType}</div>
            )}
            {element.resultType !== "NN" && (
              <div className={element.resultType ==='W'?"wicket":"leg-by"}>{element.resultType}</div>
            )}
          </div>
          <p className="over">
            {element.ballInfo.over +
              "." +
              element.ballInfo.ball +
              " : " +
              (element.commentary==undefined ? '': element.commentary)}
          </p>
        </div>
      ))}
    </div>
  );
});

export default CardList;
