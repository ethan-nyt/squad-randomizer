import React, { Component } from 'react';
import { randomizer } from './randomizer';
import { names, modes } from './constants';
import { Dropdown, Button, List, Divider, Loader, Icon } from 'semantic-ui-react';
import './App.css';

class App extends Component {
  state = {
    squadMembers: names.map((name, i) => ({ text: name, value: name, key: `${name}_squad_member${i}` })),
    squadLeads: [],
    squads: [],
    randomizing: false,
    mode: modes.confirm_participants,
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
      }, 500)
    })
  }

  startOver = () => this.setState({ 
    mode: modes.confirm_participants,
    squadLeads: [],
    squads: []
  });

  confirmParticipants = () => this.setState({ mode: modes.confirm_squad_leads })

  renderPrompt = () => {
    return this.state.mode === modes.confirm_squad_leads ? (<h2>Who are the squad leads?</h2>) : (<h2>Please confirm the list of participants for this sprint.</h2>)
  }

  renderControls = () => {
    const { mode, squadMembers } = this.state;
    return mode === modes.confirm_squad_leads ? (
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
    ) : (
      <div>
        <List>
          {names.map(name => <List.Item>{name}</List.Item>)}
        </List>
        <br />
        <Button color="green" onClick={this.confirmParticipants}>Confirm</Button>
      </div>
    )
  }
  
  render() {
    const { squadMembers, squadLeads, squads, randomizing } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Squad Randomizer</h2>
        </div>
        {this.renderPrompt()}
        <div className="squadLeadsControl">
          {this.renderControls()}
          <br/>
          {
            squadLeads.length > 1 ? 
            <div>
              <Button color="teal" onClick={this.setSquads}><Icon name="random"/>Randomize {squads.length ? 'Again' : 'Squads'}</Button>
              {squads.length ? <Button color="blue" onClick={this.startOver}><Icon name="refresh"/>Start Over</Button> : null}
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
