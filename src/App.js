import React, { Component } from 'react';
import shuffle from './shuffle';
import { modes } from './constants';
import { Dropdown, Button, List, Divider, Loader, Icon, Input, Popup } from 'semantic-ui-react';
import SquadLists from './SquadLists';
import ListEditor from './ListEditor';
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

  /**
   * @param { Array } names
   * @return { Array } each element in returned array is an object with keys for semantic ui dropdown option
   */
  mapNamesToOptions = names => names.map((name, i) => ({ text: name, value: name, key: `${name}_squad_member${i}` }));

  /**
   * @param { Object } e click event
   * @param { Array } value destructured/renamed to squadLeads, the user-inputted values to the squad leads dropdown
   */
  addSquadLead = (e, { value: squadLeads }) => {
    this.setState({ squadLeads, squads: [] });
  }

  /**
   * Invokes shuffle utility function and sets state with list of randomly assigned squads.
   */
  setSquads = () => {
    const { squadLeads, names } = this.state;
    const squadFollowers = names.filter(name => squadLeads.indexOf(name) < 0);
    const squads = shuffle(squadFollowers, squadLeads.length);
    this.setState({ randomizing: true }, () => {
      setTimeout(() => {
        this.setState({ squads, randomizing: false });
      }, 500)
    });
  }

  /**
   * Resets application state.
   */
  startOver = () => this.setState({ 
    mode: modes.confirm_participants,
    squadLeads: [],
    squads: []
  });

  /**
   * Sets state to move user to confirm squad leads mode.
   */
  goToConfirmSquadLeads = () => this.setState({ mode: modes.confirm_squad_leads });

  /**
   * Sets state to move user to confirm participants mode.
   */
  goToConfirmParticipants = () => this.setState({ mode: modes.confirm_participants })

  /**
   * Sets state.newName based on input value
   * @param { Object } e input onChange event
   * @param { String } value destructured/renamed to newName, the user-inputted string.
   */
  changeNewName = (e, { value: newName }) => this.setState({ newName });

  /**
   * adds new name to state.names and resets state.newName to empty string.
   */
  addNewName = () => this.setState({ names: [ _.capitalize(this.state.newName), ...this.state.names].sort(), newName: '' });

  /**
   * Splices the name at the given index from state.names
   * @param { Number } idx the index to splice out
   */
  deleteName = idx => {
    const names = this.state.names.slice();
    names.splice(idx, 1);
    this.setState({ names });
  }

  /**
   * Sets state to move user to edit participants mode.
   */
  editParticipants = () => this.setState({ mode: modes.edit_participants });

  /**
   * Key handler to allow user to hit enter key in order to add a new name to the list of participants.
   * @param { Object } event keyUp event for input.
   */
  inputKeyHandler = (event) => {
    const { keyCode } = event;
    if (keyCode === 13 && this.state.newName.length) {
      this.addNewName();
    }
  }

  /**
   * Helper function to render prompt section of application.
   * @return { HTML } to be rendered in the prompt area
   */
  renderPrompt = () => {
    const { mode } = this.state;
    const { confirm_squad_leads, confirm_participants } = modes;
    return mode === confirm_squad_leads ? <h2>Who are the squad leads?</h2> : mode === confirm_participants ? <h2>Please confirm the list of participants for this sprint.</h2> : <h2>Add or remove sprint participants</h2>
  }

  /**
   * Helper function to render the list of participants
   * @return { HTML } to be rendered in the participant list area.
   */
  renderParticipantList = () => (
    <List>
      {this.state.names.map(name => <List.Item className="List-item">{name}</List.Item>)}
    </List>
  );

  /**
   * Helper function to render user controls area of application.
   * @return { HTML } to be rendered in the squadLeadsControls area.
   */
  renderControls = () => {
    const { mode, names, newName, squadLeads } = this.state;
    const listEditorProps = {
      names,
      newName,
      goToConfirmParticipants: this.goToConfirmParticipants,
      renderNameOption: this.renderNameOption,
      inputKeyHandler: this.inputKeyHandler,
      changeNewName: this.changeNewName,
      addNewName: this.addNewName,
      deleteName: this.deleteName,
    };
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
          open={squadLeads.length < 2}
        />
      </div>
    ) : mode === modes.confirm_participants ? (
      <div>
        { this.renderParticipantList() }
        <br />
        <Button.Group>
          <Button color="green" onClick={this.goToConfirmSquadLeads}>Confirm</Button>
          <Button.Or />
          <Button color="yellow" onClick={this.editParticipants}>Edit</Button>
        </Button.Group>
      </div>
    ) : <ListEditor {...listEditorProps} />;
  }

  /**
   * Helper function to render the randomize button with dynamic text.
   * @return { HTML } a button
   */
  renderRandomizeButton = () => <Button color="teal" onClick={this.setSquads} disabled={this.state.squadLeads.length < 2} ><Icon name="random"/>Shuffle {this.state.squads.length ? 'Again' : 'Squads'}</Button>
  
  /**
   * Helper function to render a button group.
   * @return { HTML } a button group
   */
  renderButtonGroup = () => (
    <Button.Group>
      { this.renderRandomizeButton() }
      <Button.Or />
      <Button color="blue" onClick={this.startOver}><Icon name="refresh"/>Start Over</Button>
    </Button.Group>
  );

  render() {
    const { squadLeads, squads, randomizing, mode } = this.state;
    const listProps = { squadLeads, squads, randomizing };
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
            mode === modes.confirm_squad_leads  ? 
            <div>
              {
                this.renderButtonGroup()
              }
            </div>
            : null
          }
        </div>        
        <SquadLists {...listProps} {...this.state} />
      </div>
    );
  }
}

export default App;
