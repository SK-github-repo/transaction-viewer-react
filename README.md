# Transaction Viewer - frontend

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Prerequirements](#prerequirements)
* [Setup](#setup)
* [Related project](#related-project)

## General info
This project enables uploading and viewing transactions which were uploaded in CSV files.  
The transactions can be uploaded with different currencies.   
The amount of transaction can be converted to other currency according to exchange rate for the date when the transaction was made.  
For this moment the only option on the website is to show the transaction amount in the currency relation PLN -> EUR.  
In case the date of some transaction doesn't fit in given currency exchange rate date range then the shown converted amount will be 0.  

## Technologies
Project was created using below libraries:
* React 16.12
* axios 0.19.2
* csvtojson 2.0.10
* react-file-reader 1.1.4
* ts-react-json-table 0.1.2

## Prerequirements
To download and run this project install below software:
* NodeJS

Prepare files which can be uploaded to the application   
*sample files can be found in **sampleCsvInputs** catalog of this project*

#### Requirements for CSV *transaction* file:  
- The transaction file format is as shown:
```csv
<id transakcji>,<data transakcji>,<tytul>,<kwota>,<waluta>
1,2019-10-30,Zakup zarowek, 123.84, PLN
2,2019-03-30,Zakup lodowek, 121.11, PLN
```
- In case the *transaction id* will be duplicated an error will be thrown
- Transaction currency needs to be added to database before transactions in given currency can be uploaded

#### Requirements for CSV *exchange* file:  
- The exchange file format is as shown:
```csv
<data od>, <data do>, <kurs>, <waluta_z>, <waluta_na>
2019-10-11, 2020-01-01, 4.23, EUR, PLN
2018-10-11, 2019-01-01, 6.00, EUR, PLN
2019-02-11, 2019-09-01, 5.55, EUR, PLN
2019-02-11, 2019-09-01, 0.25, PLN, EUR
2020-02-11, 2020-09-01, 0.24, PLN, EUR
```
- The date ranges cannot interfere each other. In case they interfere a validation error will be thrown.

## Setup
To run this project, install it locally following below steps: 

#### 1. Download project from github
To copy project from github run below command in your terminal in location you want to save the project:

```
$ git clone <project link.git>
```

#### 2. Install required libraries and run the app
In the project directory run:

### `npm install`

Then to start the app run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Related project
Backend part of this project - https://github.com/SK-github-repo/transaction-viewer
