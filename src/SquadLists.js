import React from 'react';
import { List, Loader, Divider } from 'semantic-ui-react';

export default class SquadLists extends React.Component {
    onDragStart = (e) => {
      console.log('drag start:', e.target.innerHTML);
      e.dataTransfer.setData('name', e.target.innerHTML);
      // todo splice this name out of whichever list is being dragged from.
    }
    preventDefault = e => e.preventDefault();
    onDragOver = e => this.preventDefault(e);
    onDrop = (e) => {
      e.preventDefault();
      console.log('drop', e.dataTransfer.getData('name'));
      // todo push this name into whichever list is being dropped on.
    };
    render() {
        const { randomizing, squadLeads, squads } = this.props;
        return (<div id="squadListContainer">
          {
            randomizing ? <Loader active>Shuffling...</Loader> : squadLeads.length && squads.length ? squadLeads.map((name, i) => (
              <div className="Squad">
                { i === 0 ? <Divider /> : null }
                <h2 className="Squad-leader">{name}'s Squad</h2>
                <List>
                  { squads[i].map(squadMember => <List.Item draggable onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragOver={this.onDragOver} onDrop={this.onDrop} key={`${squadMember}_${name}'s_Squad`}>{squadMember}</List.Item>) }
                </List>
                { i === squadLeads.length - 1 ? null : <Divider fitted /> }
              </div>
            )) : null
          }
        </div>);
    }
}