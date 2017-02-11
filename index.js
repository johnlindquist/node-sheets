const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const uuidV1 = require('uuid/v1')


const google = require('googleapis')
const credentials = require('./credentials.json')

const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    [
        'https://www.googleapis.com/auth/spreadsheets'
    ],
    null
)

google.options({ auth })

const sheets = google.sheets('v4')
const spreadsheetId = '1Sgy_CkmUgBLNgUzUd_-fxd9JnLFWleazdqwXA_Wp40Y'

app.get('/', (req, res) => {
    res.send('Hello')
})

app.post('/animals', (req, res) => {
    sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'animals!all',
        valueInputOption: 'USER_ENTERED',
        includeValuesInResponse: true,
        resource: {
            values: [[req.body.name, req.body.count]]
        }
    }, (err, response) => {
        res.send(response.updates)
    })
})


app.get('/animals', (req, res) => {
    sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'animals!all'
    }, (err, response) => {
        res.send(response.values.map(([name, count]) => ({ name, count })))
    })
})


app.listen(3000)