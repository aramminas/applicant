import React from 'react'
import './Title3D.scss'

const Title3D = () => {
    const array = new Array(20)
    return (
        <div className={"title-3d-container"}>
            <div className="stage">
                {[...array].map((item, index)=>(<div className="layer" key={index}/>))}
            </div>
        </div>
    )
}

export default Title3D