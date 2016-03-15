//import {Debug, logdebug} from 'lib/debugdef'

Meteor.startup(function() {
    var Debug = Meteor.settings.public ?
        Meteor.settings.public.Debug : false
    
    if(Debug){
        Kadira.connect('4qWZxRSWd7LGWnWMm', 'cc838a0a-2ff7-4f9c-954f-b8f49b62eed9');
    }else{
        Kadira.connect('E7Kv7HZFSeuPMSPc5', '9fcdd16e-aac4-4362-a0f2-d3473d0d649e');
    }
});

/*huahe.eu-gb.mybluemix.net : huaheapp
Kadira.connect('4qWZxRSWd7LGWnWMm', 'cc838a0a-2ff7-4f9c-954f-b8f49b62eed9');*/

/*huaheweb.eu-gb.mybluemix.net : huahe
Kadira.connect('E7Kv7HZFSeuPMSPc5', '9fcdd16e-aac4-4362-a0f2-d3473d0d649e');*/
