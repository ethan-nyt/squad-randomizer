import React, { Component } from 'react';
import { randomizer } from './randomizer';
import { names } from './constants';
import { Dropdown, Button, List, Divider, Loader } from 'semantic-ui-react';
import './App.css';

class App extends Component {
  state = {
    squadMembers: names.map((name, i) => ({ text: name, value: name, key: `${name}_squad_member${i}` })),
    squadLeads: [],
    squads: [],
    randomizing: false,
  };

  addSquadLead = (e, { value: squadLeads }) => {
    this.setState({ squadLeads, squads: [] });
  }

  setSquads = () => {
    const { squadLeads } = this.state;
    const squadFollowers = names.filter(name => squadLeads.indexOf(name) < 0);
    const squads = randomizer(squadFollowers, squadLeads.length);
    this.setState({ randomizing: true }, () => {
      setTimeout(() => {
        this.setState({ squads, randomizing: false });
      }, 1500)
    })
  }
  
  render() {
    const { squadMembers, squadLeads, squads, randomizing } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Squad Randomizer</h2>
        </div>
        <h2>Who are the squad leads?</h2>
        <div className="squadLeadsControl">
          <div>
            <Dropdown
              search
              selection
              multiple
              closeOnChange
              onChange={this.addSquadLead}
              options={squadMembers}
              />
          </div>
          <br/>
          {
            squadLeads.length > 1 ? 
            <div>
              <Button primary onClick={this.setSquads}>Randomize Squads</Button>
            </div> : null
          }
        </div>
        <Divider />
          <div id="squadListContainer">
            {
              randomizing ? <Loader active>Randomizing...</Loader> : squadLeads.length && squads.length ? squadLeads.map((name, i) => (
                <div className="squad">
                  <h2>{name}'s Squad</h2>
                  <List>
                    { squads[i].map(squadMember => <List.Item key={`${squadMember}_${name}'s_Squad`}>{squadMember}</List.Item>) }
                  </List>
                  <Divider fitted />
                </div>
              )) : null
            }
          </div>
      </div>
    );
  }
}

export default App;
