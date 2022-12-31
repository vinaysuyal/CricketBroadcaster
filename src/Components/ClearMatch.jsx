import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./ClearMatch.css";

const ClearMatch = (props) => {
  const [userInput, setUserInput] = useState("");
  const { endGame, handleClose, open } = props;
  const deleteAgreement = " Clear this Match";
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <div className="modal">
            <div className="card">
              <p>
                Type the following lines in the text box to continue:
                <span style={{ color: "red", fontWeight: "bolder" }}>
                  {deleteAgreement}
                </span>
              </p>
              <TextField
                onChange={handleInputChange}
                required
                id="outlined-required"
                defaultValue={''}
              />
              {userInput === deleteAgreement.trim() && (
                <Button onClick={endGame} variant="outlined" color="error">
                  Clear
                </Button>
              )}
            </div>
          </div>{" "}
        </Box>
      </Modal>
    </>
  );
};

export default ClearMatch;
