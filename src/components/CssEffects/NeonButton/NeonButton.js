/* ** Usage example **
 <NeonButton  variant="default">Neon Button</NeonButton>
 ** Available classes **
 default, primary, secondary, success, danger, warning, info, light, dark */

import React from "react"
import './NeonButton.scss'

function NeonButton(props) {
    const span = [1,2,3,4,].map((index) => <span key={index} />)
    const {children= "Button", variant= "b-default"} = props

    const doEvent = (doProps,ev) => {
        for (const property in doProps) {
            if(typeof doProps[property] === "function")
                doProps[property](ev)
        }
    }

    return (
            <div className={`neon-btn b-${variant}`}>
                <a href="/" onClick={ev => {
                    ev.preventDefault()
                    doEvent(props,ev)
                    return false
                }}>
                    {span}
                    {children}
                </a>
            </div>
        )
}

export default NeonButton