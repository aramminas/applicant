import React from "react"
import './Letters.scss'

function Letters() {
    const span = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"]
        .map((letter, index ) => <span className="letter" data-letter={letter} key={index}>{letter}</span>)

    return (
        <div className="letters-content foo">
            {span}
        </div>
    )
}

export default Letters