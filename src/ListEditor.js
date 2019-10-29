import React from 'react';
import { Button, List, Icon, Input, Popup } from 'semantic-ui-react';

export default (props) => {
    const { 
        names, newName, renderNameOption, inputKeyHandler, changeNewName, deleteName, addNewName, goToConfirmParticipants
    } = props;
    return (
        <div id="Edit-List-container">
            <Input id="New-name" value={newName} onKeyUp={inputKeyHandler} onChange={changeNewName} action={{ disabled: newName.length < 1, size: 'small', color: 'teal', content: 'Add name', labelPosition: 'right', icon: 'plus', onClick: addNewName }} />
            <div id="Edit-list-subcontainer">
                <List selection relaxed>
                    { 
                        names.map((name, i) => (
                            <List.Item className="List-item">
                                {name}{' | '}
                                <Icon name="delete" color="red" onClick={() => deleteName(i)} />
                            </List.Item> 
                        ))
                    }
                </List>
            </div>
            <Popup
                trigger={<Button disabled={names.length < 2} color="green" onClick={goToConfirmParticipants} content="Done"/>}
                open={names.length < 2}
                content="Add more sprint participants"
                position="right center"
            />
        </div>
    );
}