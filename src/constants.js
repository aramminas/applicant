const data = {
    // Common
    layout: {
        admin: 'admin',
        default: 'default',
        notFound: 'not-found',
        contact: 'contact'
    },
    language: [
        {
            text: 'AM',
            flag: 'AM'
        },
        {
            text: 'EN',
            flag: 'GB'
        }
    ],
    slideShowIcons: [
        {url: 'android.png'},
        {url: 'c++.png'},
        {url: 'asp.png'},
        {url: 'css3.png'},
        {url: 'database.png'},
        {url: 'java.png'},
        {url: 'html-5.png'},
        {url: 'php.png'},
        {url: 'ios.png'},
        {url: 'python.png'},
        {url: 'react.png'},
        {url: 'joomla.png'},
        {url: 'ruby.png'},
        {url: 'sass.png'},
        {url: 'sql.png'},
        {url: 'wordpress.png'},
    ],
    onlyCountries: [
        "am","ru"
    ],
    regions: ["europe","asia","ex-ussr"],
    defaultCountry: "am",
    // RegExp
    email_reg: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    pass_reg: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
    name_reg: /^[a-zA-Z ]+$/,
    phone_reg: /^.{12,30}$/, // need change this reg exp
    birthday_reg: /^(19[5-9]\d|200[0-9])$/, // todo need change every year (/^(19[5-9]\d|20[0-4]\d|2050)$/),
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    //  Admin
    admin: {
        applicantLevels: [
            {id: 1, name: 'beginner'},
            {id: 2, name: 'junior'},
            {id: 3, name: 'middle'},
            {id: 4, name: 'senior'},
            {id: 5, name: 'master'},
        ],
        times: [
            {id: 1, value: 30, name: "30 minutes"},
            {id: 2, value: 60, name: "1 hour"},
            {id: 3, value: 75, name: "1 hour 15 minutes"},
            {id: 4, value: 90, name: "1 hour 30 minutes"},
            {id: 5, value: 105, name: "1 hour 45 minutes"},
            {id: 6, value: 120, name: "2 hour"},
            {id: 7, value: 135, name: "2 hour 15 minutes"},
            {id: 8, value: 150, name: "2 hour 30 minutes"},
        ],
        // TODO: this data is temporary, need to get it from the database
        chart: [
            [
                {x: new Date(2019, 5,1), y: 20},
                {x: new Date(2019, 6,1), y: 35},
                {x: new Date(2019, 7,1), y: 44},
                {x: new Date(2019, 8,1), y: 3},
                {x: new Date(2019, 9,1), y: 93},
                {x: new Date(2019, 10,1), y: 29},
                {x: new Date(2019, 11,1), y: 43},
                {x: new Date(2020, 0,1), y: 56},
                {x: new Date(2020, 1,1), y: 22},
                {x: new Date(2020, 2,1), y: 6},
                {x: new Date(2020, 3, 1), y: 37},
                {x: new Date(2020, 4, 1), y: 1}
            ],[
                {x: new Date(2019, 5, 1), y: 1},
                {x: new Date(2019, 6, 1), y: 2},
                {x: new Date(2019, 7, 1), y: 3},
                {x: new Date(2019, 8, 1), y: 4},
                {x: new Date(2019, 9, 1), y: 5},
                {x: new Date(2019, 10, 1), y: 36},
                {x: new Date(2019, 11, 1), y: 7},
                {x: new Date(2020, 0, 1), y: 8},
                {x: new Date(2020, 1, 1), y: 9},
                {x: new Date(2020, 2, 1), y: 10},
                {x: new Date(2020, 3, 1), y: 16},
                {x: new Date(2020, 4, 1), y: 1}
            ]
        ],
    }
}

export default data