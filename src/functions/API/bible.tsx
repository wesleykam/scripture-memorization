import axios from "axios"

const getVerses = () => {
    axios.get(
        'https://bible-go-api.rkeplin.com/v1/books/1/chapters/1/1001001?translation=NIV'
    ).then((response) => {
        const data = response.data
        console.log(data)
    })
}

export default getVerses