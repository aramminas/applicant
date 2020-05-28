// need add fontawesome cdn icons link in your index.html
import React from 'react'
import './RadioButtons3D.scss'

const RadioButtons3D = () => {
    return (
        <div className={"radio-button-container"}>
            <div className={"radio-button-content"}>
                <p>Yes No ?</p>
                <div>
                    <label>
                        <input type="radio" name={"yes-no"}/>
                        <i className="fad fa-check"/>
                    </label>
                    <label>
                        <input type="radio" name={"yes-no"}/>
                        <i className="fad fa-times"/>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default RadioButtons3D