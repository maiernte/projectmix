import {loadBooks} from 'server/load_books'

declare var Meteor;

Meteor.startup(loadBooks); 