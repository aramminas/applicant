import React, {Suspense, lazy} from 'react'
import {Route, Switch} from "react-router-dom"
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

// main components for router
const Welcome = lazy(() => import("./components/Welcome/Welcome"))
const AboutUs = lazy(() => import("./components/AboutUs/AboutUs"))
const ContactUs = lazy(() => import("./components/ContactUs/ContactUs"))
const SignIn = lazy(() => import("./components/SignIn/SignIn"))
const SignUp = lazy(() => import("./components/SignUp/SignUp"))

const NotFound = lazy(() => import("./components/NotFound/NotFound404"))

// admin components for router
const AdminLogin = lazy(() => import("./components/Admin/AdminLogin"))
const CreateTest = lazy(() => import("./components/CreateTest/CreateTest"))

// user components for router
const User = lazy(() => import("./components/User/User"))
const Test = lazy(() => import("./components/Test/Test"))
const Tests = lazy(() => import("./components/Tests/Tests"))

const routes = (
    <Suspense fallback={<div className={"main-loader"}><Loader type="BallTriangle" color="#1079f8" height={100} width={100}/></div>}>
        <Switch>
            {/* main routes */}
            <Route path="/" exact={true} component={Welcome}/>
            <Route path="/about-us" component={AboutUs}/>
            <Route path="/contact-us" component={ContactUs}/>
            <Route path="/sign-in" component={SignIn}/>
            <Route path="/sign-up" component={SignUp}/>
            {/* admin routes */}
            <Route path="/admin" component={AdminLogin}/>
            <Route path="/create-test" component={CreateTest}/>
            {/* user routes */}
            <Route path="/test/:id" exact component={Test}/>
            <Route path="/tests/:id" component={Tests}/>
            <Route path="/user/:id" component={User}/>

            <Route path='*' exact={true} component={NotFound} />
        </Switch>
    </Suspense>
)

export default routes
