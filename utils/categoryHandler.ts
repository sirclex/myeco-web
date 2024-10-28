import axios from "axios"

interface CategoryDisplay {
    id: number;
    name: string;
}

async function fetchCategory() {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/categories",
        {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }
    )
    return response.data
}

export {fetchCategory}
export type { CategoryDisplay }