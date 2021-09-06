import "./App.css";
import Popup from "./popup/popup";
import Popupcontent from "./popup/popupcontent";
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

function App() {
  const [popActive, setPopActive] = useState(true);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <button className="open-btn" onClick={() => setPopActive(true)}>
              Do koszyka
            </button>
            <Popup active={popActive} setActive={setPopActive}>
              <Popupcontent />
            </Popup>
          </div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
