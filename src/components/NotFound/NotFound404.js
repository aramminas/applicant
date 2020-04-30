import React from "react"
import {Container, Row, Col} from 'react-bootstrap'
import { useSelector } from "react-redux"
import './NotFound404.scss'

import Layout from '../../hoc/layout/Layout'
import data from '../../constants'
//languages
import lang_en_main from '../../lang/en/main.json'
import lang_am_main from '../../lang/am/main.json'
const layout = data.layout.notFound

function NotFound404() {
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en_main : lang_am_main

    return (
        <div className={"not-found-content"}>
            <Container>
                <Row className="not-found-404">
                    <Col lg={12} className="align-self-center">
                        <h1 className={"not-found-title"}>
                            <div className="subhead">{lang.error_404}</div>
                            {lang.error_sorry}
                        </h1>
                        <p>{lang.error_landed}</p>
                    </Col>
                </Row>
            </Container>
            <figure>
                <img src="/images/pages/404_bg.jpg" alt="not found 404"/>
            </figure>
        </div>
    )
}

export default Layout(NotFound404,layout)