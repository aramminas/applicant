import data from '../constants'
const characters = data.characters

export default function makeId(length){
    let result = ''
    let charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}