import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {Container, Row, Col} from 'react-bootstrap'
import Button from '@material-ui/core/Button'
import {useSelector} from "react-redux"
import './Welcome.scss'
import './type_writer_effect_.scss'
//languages
import lang_en from '../../lang/en/en.json'
import lang_am from '../../lang/am/am.json'


const GreetingText = () => {
    const [toSignIn, setToSignIn] = useState(false)
    const [toTests, setToTests] = useState(false)
    const {language} = useSelector(state => state.language)
    const {user} = useSelector(state => state)

    let lang = language === 'EN' ? lang_en : lang_am
    let isLogged = user.isLogged

    const startTests = (e) => {
        e.preventDefault()
        isLogged === true ? setToTests(() => true) : setToSignIn(() => true)
    }
    // After checking registrations, redirecting the user to the registration page or tests page
    if (toTests === true) {
        return <Redirect to={`/tests/${user.userId}`}/>
    }
    if (toSignIn === true) {
        return <Redirect to="/sign-in"/>
    }

    return (
        <div className={"welcome-greeting-text"}>
            <Container>
                <Row className="text-center greeting-content">
                    <Col lg={12} className="greeting-text align-self-center">
                        <p>{lang.greeting_text_1}</p>
                        <p className="writer-effect">{lang.greeting_text_2}</p>
                    </Col>
                    <Col lg={12}>
                        <Button variant="contained" color="primary" size="large"
                                onClick={(e) => startTests(e)}
                        >
                            {lang.start_test}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default GreetingText