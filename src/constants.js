const data = {
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
    phone_reg:/^.{12,30}$/, // need change this reg exp
    birthday_reg:/^(19[5-9]\d|200[0-9])$/, // todo need change every year (/^(19[5-9]\d|20[0-4]\d|2050)$/)
}

export default data