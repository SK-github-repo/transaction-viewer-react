import React from 'react';
import axios from 'axios';
import ReactFileReader from "react-file-reader";
import JsonTable from "ts-react-json-table";

class TransactionViewer extends React.Component {

    state = {
        transactionsFromServer: '',
        transactionsToUpload: '',
        exchangeRatesToUpload: '',
        isLoading: false,
        transactionReadyToSend: false,
        exchangeRatesReadyToSend: false
    };

    componentDidMount() {
        this.getAllTransactions();
    }

    getAllTransactions = () => {
        this.setState({isLoading: true});
        axios.get('transaction/all')
            .then(response => response.data)
            .then(data => {
                this.receivedTransactions(data);
                this.setState({isLoading: false});
            }).catch(error => {
            alert(error.response.data.message);
            console.log(error.response.data.message);
            this.setState({isLoading: false});
        });
    };

    getAllTransactionsWithCurrencyConversion = () => {
        this.setState({isLoading: true});
        axios.get('transaction/all/withCurrency')
            .then(response => response.data)
            .then(data => {
                this.receivedTransactions(data);
                this.setState({isLoading: false});
            }).catch(error => {
            alert(error.response.data.message);
            console.log(error.response.data.message);
            this.setState({isLoading: false});
        });
    };

    receivedTransactions = (data) => {
        this.setState({
            transactionsFromServer: data,
        });
        console.log(this.state.transactionsFromServer);
    };

    sendTransactionsToServer = () => {
        if (this.state.transactionsToUpload === '') {
            alert("Their is no data to send! First upload the csv file with data.")
        } else {
            this.setState({isLoading: true});
            console.log(this.state.transactionsToUpload);
            axios.post('transaction', this.state.transactionsToUpload,
                {
                    headers: {
                        'accept': 'application/json',
                        'accept-language': 'en_US',
                        'content-type': 'application/json'
                    }
                })
                .then(res => res.data)
                .then(data => {
                    console.log(data);
                    this.setState({
                        isLoading: false,
                        transactionsToUpload: '',
                        transactionReadyToSend: false
                    });
                    this.getAllTransactions();
                }).catch(error => {
                alert(error.response.data.message);
                console.log(error.response.data.message);
                this.setState(
                    {
                        isLoading: false,
                        transactionsToUpload: '',
                        transactionReadyToSend: false
                    });
            });
        }
    };

    sendExchangeRatesToServer = () => {
        if (this.state.exchangeRatesToUpload === '') {
            alert("Their is no data to send! First upload the csv file with data.")
        } else {
            this.setState({isLoading: true});
            console.log(this.state.exchangeRatesToUpload);
            axios.post('exchange', this.state.exchangeRatesToUpload,
                {
                    headers: {
                        'accept': 'application/json',
                        'accept-language': 'en_US',
                        'content-type': 'application/json'
                    }
                })
                .then(res => res.data)
                .then(data => {
                    console.log(data);
                    this.setState({
                        isLoading: false,
                        exchangeRatesToUpload: '',
                        exchangeRatesReadyToSend: false

                    });
                }).catch(error => {
                alert(error.response.data.message);
                console.log(error.response.data.message);
                this.setState({isLoading: false});
            });
        }
    };

    loadFromFileTransactionsAndConvertToJson = (files) => {
        this.setState({isLoading: true});
        let reader = new FileReader();
        reader.onload = function (e) {
            let csv = require('csvtojson');
            csv({
                noheader: false,
                headers: ["id", "bookingDate", "mainTitle", "amount", "currency"]
            })
                .fromString(reader.result)
                .then((jsonObj) => {
                    this.saveTransactionsFromCsvFileAsJson(jsonObj);
                });
        }.bind(this);
        reader.readAsText(files[0]);
        this.setState({isLoading: false});
    };

    saveTransactionsFromCsvFileAsJson = (jsonObj) => {
        let receivedTransactions = {
            receivedTransactions: jsonObj
        };
        this.setState({
            transactionsToUpload: JSON.stringify(receivedTransactions),
            transactionReadyToSend: true
        });
        console.log("Transactions ready to be sent");
    };

    loadFromFileExchangeRatesAndConvertToJson = (files) => {
        this.setState({isLoading: true});
        let reader = new FileReader();
        reader.onload = function (e) {
            let csv = require('csvtojson');
            csv({
                noheader: false,
                headers: ["startDate", "endDate", "exchangeRate", "currencyFrom", "currencyTo"]
            })
                .fromString(reader.result)
                .then((jsonObj) => {
                    this.saveExchangeRatesFromCsvFileAsJson(jsonObj);
                });
        }.bind(this);
        reader.readAsText(files[0]);
        this.setState({isLoading: false});
    };

    saveExchangeRatesFromCsvFileAsJson = (jsonObj) => {
        let receivedExchangeRates = {
            receivedExchangeRates: jsonObj
        };
        this.setState({
            exchangeRatesToUpload: JSON.stringify(receivedExchangeRates),
            exchangeRatesReadyToSend: true
        });
        console.log("Exchanges rates ready to be sent");
    };

    tableColumns = [
        {key: 'id', label: 'ID'},
        {key: 'bookingDate', label: 'Booking date'},
        {key: 'mainTitle', label: 'Main title'},
        {key: 'amount', label: 'Amount'},
        {key: 'currency', label: 'Currency'},
        {key: 'amount', label: 'Amount'},
        {key: 'currency', label: 'Currency'},
        {key: 'exchangedAmount', label: 'Exchanged amount'},
        {key: 'exchangeCurrency', label: 'Exchange currency'}
    ];

    render() {
        const {isLoading, transactionReadyToSend, exchangeRatesReadyToSend} = this.state;

        if (isLoading) {
            return (
                <section>
                    <div className='container'>
                        <div className='alert-info text-center'>Loading</div>
                    </div>
                </section>
            )
        } else {
            return (
                <section>
                    <div className='container'>
                        <div className="row">
                            <div className="column">
                                <div className="header">Manage transactions</div>
                                <ReactFileReader handleFiles={this.loadFromFileTransactionsAndConvertToJson}
                                                 fileTypes={'.csv'}>
                                    <button>Upload transactions</button>
                                </ReactFileReader>
                                <button className={[transactionReadyToSend ? 'btn-send' : 'disabled']}
                                        onClick={this.sendTransactionsToServer}>Save transactions
                                </button>
                            </div>

                            <div className="column">
                                <div className="header">Manage exchange ranges</div>
                                <ReactFileReader handleFiles={this.loadFromFileExchangeRatesAndConvertToJson}
                                                 fileTypes={'.csv'}>
                                    <button>Upload exchange rates</button>
                                </ReactFileReader>
                                <button className={[exchangeRatesReadyToSend ? 'btn-send' : 'disabled']}
                                        onClick={this.sendExchangeRatesToServer}>Save exchange rates
                                </button>
                            </div>

                            <div className="column">
                                <div className="header">Show transactions</div>
                                <div>
                                    <button onClick={this.getAllTransactions}>Without currency conversion</button>
                                </div>
                                <div>
                                    <button onClick={this.getAllTransactionsWithCurrencyConversion}>With currency
                                        conversion
                                    </button>
                                </div>
                            </div>
                        </div>

                        <JsonTable className="table" rows={this.state.transactionsFromServer}
                                   columns={this.tableColumns}/>
                    </div>
                </section>
            )
        }
    }
}

export default TransactionViewer;