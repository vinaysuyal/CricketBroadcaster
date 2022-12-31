import logo from "./logo.svg";
import "./App.css";
import Creator from "./Components/Creator";
import { useState } from "react";
import Displayer from "./Components/Displayer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/Create" exact
          element={<Creator />}>
          </Route>
          <Route path="/" exact
          element={<Displayer />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
