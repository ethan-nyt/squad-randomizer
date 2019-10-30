import React from 'react';
import { List, Loader, Divider } from 'semantic-ui-react';

export default class SquadLists extends React.Component {
  state = {
    activeName: null,
    idxToSplice: [],
  }
  onDragStart = (e, i, j) => {
    this.setState({ activeName: e.target.innerHTML, idxToSplice: [i, j] });
  }
  preventDefault = e => e.preventDefault();
  onDragOver = (e, i) => { 
    this.preventDefault(e);
  }
  onDrop = (e, i) => {
    e.preventDefault();
    const newSquads = JSON.parse(JSON.stringify(this.props.squads));
    newSquads[i].push(this.state.activeName);
    newSquads[this.state.idxToSplice[0]].splice([this.state.idxToSplice[1]], 1);
    this.props.setParentState({ squads: newSquads });
    this.setState({ activeName: null, idxToSplice: [] });
  };
  render() {
      const { randomizing, squadLeads, squads } = this.props;
      return (<div id="squadListContainer">
        {
          randomizing ? <Loader active>Shuffling...</Loader> : squadLeads.length && squads.length ? squadLeads.map((name, i) => (
            <div className="Squad">
              { i === 0 ? <Divider /> : null }
              <h2 className="Squad-leader">{name}'s Squad</h2>
              <List onDragOver={(e) => this.onDragOver(e, i)}>
                { squads[i].map((squadMember, j) => <List.Item draggable onDragStart={(e) => this.onDragStart(e, i, j)} onDragEnd={this.onDragEnd} onDrop={(e) => this.onDrop(e, i)} key={`${squadMember}_${name}'s_Squad`}>{squadMember}</List.Item>) }
              </List>
              { i === squadLeads.length - 1 ? null : <Divider fitted /> }
            </div>
          )) : null
        }
      </div>);
  }
}