import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';

import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { Pagination, Icon, Dropdown, /*Checkbox, Accordion, Form, Segment, Button, Card, Label */} from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            jobDetails: [],
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filterValue: "",
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.onClickCloseJobs = this.onClickCloseJobs.bind(this);
        this.sortChangeHandler = this.sortChangeHandler.bind(this); 
        this.filterChangeHandler = this.filterChangeHandler.bind(this);
        
    };

    init() {
        this.loadData(() =>
            this.setState({ loaderData }),
            loaderData.isLoading = false,
        )
    }

    handlePageChanged(e, { activePage }) {
        const page = activePage;
        console.log("activePage: ", page);
        this.setState({ activePage: page }, () => this.loadData(() =>
            this.setState({ loaderData }),
            loaderData.isLoading = false)
        );
    };

    onClickCloseJobs(e, { key }) {
        const buttonKey = key;
        console.log("key:", buttonKey);
    };

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'https://talentservicestalent20191010123719.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,
                sortbyDate: this.state.sortBy.date
            },
            success: function (res) {
                if (res.myJobs) {
                    this.state.jobDetails = res.myJobs
                    this.setState({ totalPages: Math.ceil(res.totalCount / 6) })
                } else {
                    console.log("Nothing", res)
                }
                console.log("myJobs:", this.state.jobDetails);
                console.log("data:", res);
                callback();
               
            }.bind(this),
            error: function (res) {
                console.log(res.status);
                callback();
            }
        })
    }


    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    sortChangeHandler(e, data) {
        if (data.value == 'newest') {
            this.setState({
                sortBy: {
                    date: "desc"
                }
            })
        }
        else if (data.value == 'oldest') {
            this.setState({
                sortBy: {
                    date: "asc"
                }
            })
        }
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    filterChangeHandler(e, data) {
        if (data.value == 'expired') {
            this.setState({
                filterValue: data.value,
                filter: {
                    showActive: true,
                    showClosed: false,
                    showDraft: true,
                    showExpired: true,
                    showUnexpired: false
                }
            })
        }
        else if (data.value == 'unexpired') {
            this.setState({
                filterValue: data.value,
                filter: {
                    showActive: true,
                    showClosed: false,
                    showDraft: true,
                    showExpired: false,
                    showUnexpired: true
                }
            })
        }
        else if (data.value == 'active') {
            this.setState({
                filterValue: data.value,
                filter: {
                    showActive: false,
                    showClosed: false,
                    showDraft: true,
                    showExpired: true,
                    showUnexpired: true
                }
            })
        }
        else if (data.value == 'closed') {
            this.setState({
                filterValue: data.value,
                filter: {
                    showActive: false,
                    showClosed: true,
                    showDraft: true,
                    showExpired: true,
                    showUnexpired: true
                }
            })
        }
        else if (data.value == 'draft') {
            this.setState({
                filterValue: data.value,
                filter: {
                    showActive: true,
                    showClosed: false,
                    showDraft: false,
                    showExpired: true,
                    showUnexpired: true
                }
            })
        }
        else if (data.value == 'all') {
            this.setState({
                filterValue: data.value,
                filter: {
                    showActive: true,
                    showClosed: false,
                    showDraft: true,
                    showExpired: true,
                    showUnexpired: true
                }
            })
        }
        
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
   
    render() {
        
        let list = this.state.jobDetails;
        let cardData = null;
        
        if (list != "") {

            cardData = list.map(card =>
                <JobSummaryCard key={card.id} id={card.id} expiryDate={card.expiryDate} title={card.title} description={card.summary} city={card.location.city} country={card.location.country} />
            )
        }
        else {
            cardData = "No Jobs Found";
        }
        const filterOptions = [
            
            { key: 'all', text: 'All', value: 'all' },
            { key: 'active', text: 'Active', value: 'active' },
            { key: 'expired', text: 'Expired', value: 'expired' },
            { key: 'unexpired', text: 'Unexpired', value: 'unexpired' },
            { key: 'closed', text: 'Closed', value: 'closed' },
            { key: 'draft', text: 'Draft', value: 'draft' }
            
        ]
        const sortOptions = [
            { key: 'newest', text: 'Newest first', value: 'newest' },
            { key: 'oldest', text: 'Oldest first', value: 'oldest' }
        ]

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div>
                        <span >
                            <Icon name='filter' /> Filter: <Dropdown placeholder='Choose Filter' defaultValue={this.state.filterValue != "" ? this.state.filterValue : null } inline options={filterOptions} onChange={this.filterChangeHandler}/>
                        </span>
                        <span>
                            <Icon name='calendar' /> Sort by Date:<Dropdown inline options={sortOptions} defaultValue={this.state.sortBy.date == 'desc' ? "newest" : "oldest"} /*defaultValue={sortOptions[0].value}*/ onChange={this.sortChangeHandler}/>
                        </span>
                    </div>
                    <br />
                    <div className="ui two cards">
                        {cardData}
                    </div>
                        <br />
                        <div align='center'>

                            <Pagination activePage={this.state.activePage} totalPages={this.state.totalPages} onPageChange={this.handlePageChanged} />
                        </div>
                        <br />
                    </div>
            </BodyWrapper>
            )
        }
    }
