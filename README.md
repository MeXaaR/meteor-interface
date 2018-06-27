# <a href='https://www.mexar.fr'><img src='https://s3-eu-west-3.amazonaws.com/mexar/projects/logo_interface_black.png' height='60' alt='MeXaR'></a> Meteor Interface


Meteor-Interface is an ultra-simple CMS for Meteor  apps.** It is based on React and made with Semantic UI.** It's an early stage project so there are a lot I will do in the future days, but this version is ready for production on simple websites. You just have to configure it and it creates all the methods and publications for you.

Let' see how you do that !!

## Quick Start

Start by installing the package.

```
$ meteor add mexar:meteor-interface
```

## Configuration
Interface works with a configuration file accessible for both your client AND server. I usually put it at the root of my project
Here is an example

```javascript
// import your collections
import Clients from '/imports/api/clients/clients'
// or create it, but interface must has access to your databases
const LandingPage = new Mongo.Collection("landing-page");

import { createInterface } from 'meteor/mexar:meteor-interface'

// widget list: string, html, boolean, list, image
const config = {
    title: 'Interface CMS',  // Title on the brower tab
    root: '/admin', // route to Interface, it must be the same as the route in your router
    login: '/login', // route to Interface login
    toastPosition: 'bottom left', // position of the notification system toasters
    logs: true, // to see all interface actions in your server console
    logo: "https://goo.gl/WQahB9",
    roles: ['super-admin', 'admin', 'editor'], // Be sure to put the super admin roles in the first position
    media_roles: ['super-admin', 'admin'], // Who can edit, upload and delete media. Others can only use them and see them
    collections: [ // configure your collections
        {
            single: false, // default - Tell if the document must be alone in the database
            name: 'Clients', // Must be a string written exactly like the collection variable
            label: 'Projects executed', // displayed label in the interface
            mongo: Clients, // your mongo collections
            icon: 'chart line', // icon based on Semantic UI
            visible: ['editor', 'admin', 'super-admin'], // visible for these roles
            edit: ['admin', 'super-admin'], // editable by these roles
            create: ['admin', 'super-admin'], // creatable by these roles
            fields: [
                { name: 'name', label: 'Name', widget: 'string' }, 
                { name: 'logo', label: 'Logo', widget: 'image' },
                { name: 'link', label: 'Link', widget: 'string' },
                { name: 'finished', label: 'Finished', widget: 'boolean' },
                { name: 'description', label: 'Description', widget: 'html' },
                { name: 'techno', label: 'Techno', widget: 'list' }
            ]
        },
        {
            single: true, // default - Tell if the document must be alone in the database
            name: 'LandingPage', // Must be a string written exactly like the collection variable
            label: 'Landing page', // displayed label in the interface
            mongo: LandingPage,
            icon: 'address book',
            visible: ['editor', 'admin', 'super-admin'], // visible for these roles
            edit: ['admin', 'super-admin', 'editor'], // editable by these roles
            create: ['admin', 'super-admin'], // creatable by these roles
            fields: [
                { name: 'name', label: 'Name', widget: 'string' },
                { name: 'logo', label: 'Logo', widget: 'image' },
                { name: 'link', label: 'Link', widget: 'string' },
                { name: 'finished', label: 'Finished', widget: 'boolean' },
                { name: 'description', label: 'Description', widget: 'html' },
                { name: 'techno', 
                label: 'Techno',
                widget: 'list',
                fields: [
                    { name: 'name', label: 'Name', widget: 'string' },
                    { name: 'logo', label: 'Logo', widget: 'image' },
                    { name: 'description', label: 'Description', widget: 'html' },
                ]
            }
            ]
        }
    ]
}

// send the configuration to Interface
createInterface(config)

```

## Importation
You have to set Interface in your router on the client and the server, if you don't set it on your server router, you need to import Interface at least once on the server to build publication and methods.

I advice to import it dynamically.

```javascript
import Interface       from 'meteor/mexar:meteor-interface'


const App = appProps => ( 
    <Router>
        <Switch>
            <Route path="/admin" component={Interface} /> // same route as in the config file
            <Route path="/" component={MainLayout} />
        </Switch>
    </Router>
)
```

The first user to be created is "admin" and the password is the same


## Widgets
Different widgets are already in Interface to edit and create your databases entries.

| Widget name | Type in database | Displayed in Interface |
|------------|--------------|------------|
| string | String | A simple input |
| multiline | String | A textarea |
| html | String | A tinymce wysiwyg |
| boolean | Boolean | A checkbox |
| image | String | an image picker |
| list | Array | Depends if you define some fields or not (check example) |

## Evolutions and issues
Don't hesitate to tell me if there is some issues I must correct or if you have ideas to improve it.


## To Do
 - A Date widget
 - A rate limiter protection for methods