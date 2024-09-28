require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN; //'';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

function requestHeaders() {
    return {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
}

app.get('/', async (req, res) => {
    // render the home page
    const cats = 'https://api.hubapi.com/crm/v3/objects/cats?idProperty=name&properties=name,bio,cutness_level,preferred_food';
    const headers = requestHeaders();

    try {
        const resp = await axios.get(cats, { headers });
        const data = resp.data.results;
        // console.log(data);

        res.render('homepage', { 'title': 'Homepage | Integrating With HubSpot I Practicum', data });

    } catch (err) {
        console.error(err);
        console.log(requestHeaders());
    }
});

app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = requestHeaders();

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;

        res.render('contacts', { 'title': 'Contacts | Integrating With HubSpot I Practicum', data });

    } catch (err) {
        console.error(err);
        console.log(requestHeaders());
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render('updates', { 'title': 'Add a Cat | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const contacts = 'https://api.hubapi.com/crm/v3/objects/cats';
    const headers = requestHeaders();

    var dryFood = req.body.dry_food;
    var wetFood = req.body.wet_food;

    const dryFoodLiteral = 'Dry Food';
    const wetFoodLiteral = 'Wet Food';

    var preferred_food = '';
    if (dryFood && wetFood) {
        preferred_food = dryFoodLiteral + ";" + wetFoodLiteral;

    } else if (dryFood) {
        preferred_food = dryFoodLiteral;

    } else if (wetFood) {
        preferred_food = wetFoodLiteral;
    }

    const catData = {
        'properties': {
            'name': req.body.name,
            'bio': req.body.bio,
            'cutness_level': req.body.cuteness_level,
            'preferred_food': preferred_food
        }
    };

    try {
        const resp = await axios.post(contacts, catData, { headers });
        const data = resp.data.results;

        res.redirect('/');

    } catch (err) {
        console.log('UPDATE WENT WRONG');
        console.error(err);
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            'favorite_book': req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));