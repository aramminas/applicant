import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import './Welcome.scss'
import {useSelector} from "react-redux"
import lang_en from "../../lang/en/en.json"
import lang_am from "../../lang/am/am.json"

const Technology = () => {
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am
    return (
        <div className="technology-block">
            <Container>
                <Row className="text-center">
                    <Col lg={12} className="align-self-center">
                        <h1 className="technology-title">{lang.about_tests}</h1>
                    </Col>
                </Row>
                <Row className="technology-content">
                    <Col lg={4}  xs={12} className="technology-text">
                        <h1 className="large-text text-left">
                            {lang.test_desc_title_1} &nbsp; {lang.test_desc_title_2}
                            <br/>
                        </h1>
                        <p className="technology-description">{lang.test_desc_1}</p>
                        <p className="technology-description">{lang.test_desc_2}</p>
                    </Col>
                    <Col lg={8} className="technology-image">
                        <figure>
                            <img src="/images/pages/technologies_bg.png" className="technology-img" alt="technology" />
                        </figure>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Technology