import axios from "axios";

interface CategoryDisplay {
    id: number;
    name: string;
}

async function fetchCategory() {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/categories",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
        }
    );
    return response.data;
}

async function addCategory(name: string) {
    axios({
        method: "post",
        url: process.env.NEXT_PUBLIC_API_URL + "/category/create",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        data: {
            name: name,
        },
    });
}

export { fetchCategory, addCategory };
export type { CategoryDisplay };
