export default function convertData(set) {
    let date = new Date(set) // MM/DD/YYYY
    let d = date.getDate()
    let m = date.getMonth() + 1
    let y = date.getFullYear()

    return  (m <= 9 ? '0' + m : m) + '/' +(d <= 9 ? '0' + d : d) + '/' + y
}