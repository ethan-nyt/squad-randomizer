import React, { Component } from 'react';
import { randomizer } from './randomizer';
import { modes } from './constants';
import { Dropdown, Button, List, Divider, Loader, Icon, Input, Popup } from 'semantic-ui-react';
import './App.css';
import _ from 'lodash';

class App extends Component {
  state = {
    names: this.props.defaultNames.sort(),
    newName: '',
    squadLeads: [],
    squads: [],
    randomizing: false,
    mode: modes.confirm_participants,
  };

  mapNamesToOptions = names => names.map((name, i) => ({ text: name, value: name, key: `${name}_squad_member${i}` }));

  addSquadLead = (e, { value: squadLeads }) => {
    this.setState({ squadLeads, squads: [] });
  }

  setSquads = () => {
    const { squadLeads, names } = this.state;
    const squadFollowers = names.filter(name => squadLeads.indexOf(name) < 0);
    const squads = randomizer(squadFollowers, squadLeads.length);
    this.setState({ randomizing: true }, () => {
      setTimeout(() => {
        this.setState({ squads, randomizing: false });
      }, 500)
    });
  }

  startOver = () => this.setState({ 
    mode: modes.confirm_participants,
    squadLeads: [],
    squads: []
  });

  confirmParticipants = () => this.setState({ mode: modes.confirm_squad_leads });

  changeNewName = (e, { value: newName }) => this.setState({ newName });

  addNewName = () => this.setState({ names: [ _.capitalize(this.state.newName), ...this.state.names].sort(), newName: '' });

  deleteName = idx => {
    const names = this.state.names.slice();
    names.splice(idx, 1);
    this.setState({ names });
  }

  editParticipants = () => {
    this.setState({
      mode: modes.edit_participants,
    });
  }

  inputKeyHandler = (event) => {
    const { keyCode } = event;
    if (keyCode === 13 && this.state.newName.length) {
      this.addNewName();
    }
  }

  renderPrompt = () => {
    const { mode } = this.state;
    const { confirm_squad_leads, confirm_participants } = modes;
    return mode === confirm_squad_leads ? <h2>Who are the squad leads?</h2> : mode === confirm_participants ? <h2>Please confirm the list of participants for this sprint.</h2> : <h2>Add or remove sprint participants</h2>
  }

  renderParticipantList = () => (
    <List>
      {this.state.names.map(name => <List.Item className="List-item">{name}</List.Item>)}
    </List>
  );

  renderNameOption = (name, i) => <List.Item className="List-item">{name}{' | '}<Icon name="delete" color="red" onClick={() => this.deleteName(i)} /></List.Item>

  renderListEditor = () => {
    const names = this.state.names.slice();
    return (
      <div id="Edit-List-container">
        <Input id="New-name" value={this.state.newName} onKeyUp={this.inputKeyHandler} onChange={this.changeNewName} action={{ disabled: this.state.newName.length < 1, size: 'small', color: 'teal', content: 'Add name', labelPosition: 'right', icon: 'plus', onClick: this.addNewName }} />
        <div id="Edit-list-subcontainer">
          <List selection relaxed>
            { names.map((name, i) => this.renderNameOption(name, i)) }
          </List>
        </div>
        <Popup
          trigger={<Button disabled={names.length < 2} color="green" onClick={this.confirmParticipants} content="Done"/>}
          open={names.length < 2}
          content="Add more sprint participants"
          position="right center"
        />
      </div>
    );
  }

  renderControls = () => {
    const { mode, names, squadLeads } = this.state;
    return mode === modes.confirm_squad_leads ? (
      <div>
        <Popup
          trigger={<Dropdown
            search
            selection
            multiple
            closeOnChange
            onChange={this.addSquadLead}
            options={this.mapNamesToOptions(names)}
            />}
          position="right center"
          content="select at least two squad leads."
          size="mini"
          open={this.state.squadLeads.length < 2}
        />
      </div>
    ) : mode === modes.confirm_participants ? (
      <div>
        { this.renderParticipantList() }
        <br />
        <Button.Group>
          <Button color="green" onClick={this.confirmParticipants}>Confirm</Button>
          <Button.Or />
          <Button color="yellow" onClick={this.editParticipants}>Edit</Button>
        </Button.Group>
      </div>
    ) : this.renderListEditor();
  }

  renderRandomizeButton = () => <Button color="teal" onClick={this.setSquads}><Icon name="random"/>Shuffle {this.state.squads.length ? 'Again' : 'Squads'}</Button>
  
  renderButtonGroup = () => (
    <Button.Group>
      {this.renderRandomizeButton()}
      <Button.Or />
      <Button color="blue" onClick={this.startOver}><Icon name="refresh"/>Start Over</Button>
    </Button.Group>
  );

  render() {
    const { squadLeads, squads, randomizing } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h1><span id="Sub-header">Super-Duper</span>Squad Shuffler</h1>
        </div>
        {this.renderPrompt()}
        <div className="squadLeadsControl">
          {this.renderControls()}
          <br/>
          {
            squadLeads.length > 1 ? 
            <div>
              {
                squads.length ? this.renderButtonGroup() : this.renderRandomizeButton()
              }
            </div>
            : null
          }
        </div>        
        <div id="squadListContainer">
          {
            randomizing ? <Loader active>Shuffling...</Loader> : squadLeads.length && squads.length ? squadLeads.map((name, i) => (
              <div className="Squad">
                { i === 0 ? <Divider /> : null }
                <h2 className="Squad-leader">{name}'s Squad</h2>
                <List>
                  { squads[i].map(squadMember => <List.Item key={`${squadMember}_${name}'s_Squad`}>{squadMember}</List.Item>) }
                </List>
                { i === squadLeads.length - 1 ? null : <Divider fitted /> }
              </div>
            )) : null
          }
        </div>
      </div>
    );
  }
}

export default App;
