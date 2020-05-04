import {applyMiddleware, combineReducers, compose, createStore} from "redux"

// Reducers **
import welcomeReducer from "./reducers/welcomeReducer"
import setAdminReducer from "./reducers/setAdminReducer"
import languageReducer from "./reducers/languageReducer"
import userReducer from "./reducers/userReducer"

const AllReducers = combineReducers({
    welcome: welcomeReducer,
    admin: setAdminReducer,
    language: languageReducer,
    user: userReducer
})

const InitialState = {}
const middleware = []

const store = createStore(
    AllReducers,
    InitialState,
    compose(applyMiddleware(...middleware),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
)

export default store