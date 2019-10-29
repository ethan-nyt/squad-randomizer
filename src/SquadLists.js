import React from 'react';
import { List, Loader, Divider } from 'semantic-ui-react';

export default class SquadLists extends React.Component {
    onDragStart = () => console.log('drag start');
    onDragEnd = () => console.log('drag end');
    preventDefault = e => e.preventDefault();
    onDragOver = e => {
        e.preventDefault();
        console.log('drag over');
    }
    onDrop = () => console.log('drop');
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