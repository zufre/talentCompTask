import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Label, Button   } from 'semantic-ui-react';


export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        
        this.closeJobHandler = this.closeJobHandler.bind(this);
        this.editJobHandler = this.editJobHandler.bind(this);
    }
    closeJobHandler(e) {

        var cookies = Cookies.get('talentAuthToken');
        var link = 'https://talentservicestalent20191010123719.azurewebsites.net/listing/listing/closeJob/';
        var id = this.props.id;
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(id),
            success: function (res) {
                console.log(res)

            }.bind(this),
            error: function (res) {
                console.log(res.status);
                callback();
            }
        })
    
    }
    editJobHandler() {
        window.location = "/EditJob/" + this.props.id;
    }

    render() {
        let currentDate = new Date();
        
        return (
        <Card style={{ width: '35rem', height: '30rem' }}>
            <Card.Content>
                    <Card.Header>{this.props.title}</Card.Header>
                <Label color='black' ribbon='right'><Icon name='user' />0</Label>
                    <Card.Meta>{this.props.city}, {this.props.country}</Card.Meta>
                <Card.Description>
                        {this.props.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <span >
                    <div style={{ height: '100%' }} className='left floated' >
                            { this.props.expiryDate  < currentDate.toISOString() ?
                            <Label color='red'  >Expired</Label>
                            :
                            <Label color='blue' >Unexpired</Label>
                        }
                    </div>
                    <div style={{ width: '70%' }} className='right floated ui three buttons'>
                        <Button basic color='blue' onClick={this.closeJobHandler} ><Icon name="close" />Close</Button>
                        <Button basic color='blue' onClick={this.editJobHandler}><Icon name="edit" />Edit</Button>
                        <Button basic color='blue' ><Icon name="copy" />Copy</Button>
                    </div>
                </span>
            </Card.Content>
            </Card>
            )
    }
}