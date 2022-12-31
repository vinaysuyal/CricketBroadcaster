import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useReducer } from "react";
import "./NewCard.css";

const cardReducer = (state, action) => {
  let newState = {};
  switch (action.type) {
    case "ballInfo":
      newState = {
        ...state,
        ballInfo: getNextBall(
          action.lastDelivery.ballInfo.over,
          action.lastDelivery.ballInfo.ball,
          action.lastBallExtra
        ),
      };
      break;
    case "ballType":
      newState = { ...state, ballType: action.ballType };
      break;
    case "resultType":
      newState = { ...state, resultType: action.resultType };
      break;
    case "runs":
      newState = { ...state, runsScored: action.runsScored };
      break;
    case "extras":
      newState = { ...state, extras: action.extras };
      break;
    case "commentary":
      newState = { ...state, commentary: action.commentary };
      break;
    case "nextBallStart":
      newState = state; //action.getInitialState();
      action.addMatchRecord(
        { ...state, 
          nextBallStarted: true, 
          runsUntilLastBall:
          state.runsUntilLastBall +
          state.runsScored +
          state.extras +
          (state.ballType !== "RG" ? 1 : 0),
        },
        action.lastBallExtra,
      );
      newState = {
        ...newState,
        ballInfo: getNextBall(
          state.ballInfo.over,
          state.ballInfo.ball,
          action.lastBallExtra,
          true
        ),
        runsUntilLastBall:
          state.runsUntilLastBall +
          state.runsScored +
          state.extras +
          (state.ballType !== "RG" ? 1 : 0),
      };
      break;
      default:
        break;
  }
  return newState;
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
  if (currentBall !== 6)
    return {
      over: currentOver,
      ball: currentBall + 1,
    };
  return {
    over: currentOver + 1,
    ball: 1,
  };
};
const NewCard = (props) => {
  const { matchData } = props;
  const [cardState, dispatch] = useReducer(cardReducer, matchData);
  const changeBallType = (event) => {
    dispatch({ type: "ballType", ballType: event.target.value });
  };
  const changeResultType = (event) => {
    dispatch({ type: "resultType", resultType: event.target.value });
  };
  const changeReunScored = (event) => {
    dispatch({ type: "runs", runsScored: event.target.value });
  };
  const changeExtras = (event) => {
    dispatch({ type: "extras", extras: event.target.value });
  };
  const changeCommentary = (event) => {
    dispatch({ type: "commentary", commentary: event.target.value });
  };
  const onPublish = () => {
    const lastBallExtra = cardState.ballType !== "RG";
    props.addMatchRecord(cardState, lastBallExtra);
  };
  const onNextBallStart = () => {
    const lastBallExtra = cardState.ballType !== "RG";
    dispatch({
      type: "nextBallStart",
      lastBallExtra,
      addMatchRecord: props.addMatchRecord,
    });
  };
  return (
    <div className="card">
      <div className="flex-row"></div>
      <div className="flex-row">
        <h2>{cardState.ballInfo.over + "." + cardState.ballInfo.ball}</h2>
        <div id="ballType">
          <label htmlFor="ballType">Ball Type: </label>
          <Select onChange={changeBallType} value={cardState.ballType}>
            <MenuItem value="WD">Wide</MenuItem>
            <MenuItem value="NB">No Ball</MenuItem>
            <MenuItem value="RG">Regular</MenuItem>
          </Select>
        </div>
        <div id="resultType">
          <label htmlFor="resultType">Result Type: </label>
          <Select onChange={changeResultType} value={cardState.resultType}>
            <MenuItem value="NN">None</MenuItem>
            <MenuItem value="W">Wicket</MenuItem>
            <MenuItem value="LB">Leg By</MenuItem>
          </Select>
        </div>
      </div>
      <div className="flex-row">
        <h2>
          {cardState.runsUntilLastBall +
            cardState.runsScored +
            cardState.extras +
            (cardState.ballType !== "RG" ? 1 : 0)}
        </h2>
        <div id="runsScored">
          <label htmlFor="runs">Runs: </label>
          <Select onChange={changeReunScored} value={cardState.runsScored}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={0}>0</MenuItem>
          </Select>
        </div>
        <div id="extras">
          <label htmlFor="extras">Extras: </label>
          <Select onChange={changeExtras} value={cardState.extras}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={0}>0</MenuItem>
          </Select>
        </div>
      </div>
      <div>
        <div id="commentary">
          <label htmlFor="commentary">Commentary: </label>
          <TextField
            onChange={changeCommentary}
            value={cardState.commentary}
            multiline
            fullWidth
            rows={5}
          />
        </div>
      </div>
      <div className="flex-row buttonContainer">
        <Button
          onClick={onPublish}
          sx={{ marginRight: "20px" }}
          variant="contained"
        >
          Publish
        </Button>
        <Button onClick={onNextBallStart} variant="contained" color="success">
          Next Delivery
        </Button>
      </div>
      <p>* Use publish if you wish to show data in pieces to the user.</p>
      <p>
        * Data for current Delivery will not be editable after Next Delivery is
        clicked.
      </p>
    </div>
  );
};

export default NewCard;
