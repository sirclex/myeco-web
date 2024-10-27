import axios from "axios"

const api_url = "http://127.0.0.1:8000"

interface CategoryDisplay {
    id: number;
    name: string;
}

async function fetchCategory() {
    const response = await axios.get(api_url + "/categories")
    return response.data
}

export {fetchCategory}
export type { CategoryDisplay }