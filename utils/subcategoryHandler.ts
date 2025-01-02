import axios from "axios";

interface SubcategoryDisplay {
    id: number;
    name: string;
    category_id: number;
}

async function fetchSubcategory(category_id: number) {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/subcategory",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            params: {
                category_id: category_id,
            },
        }
    );
    return response.data;
}

async function addSubcategory(name: string, categoryId: number) {
    axios({
        method: "post",
        url: process.env.NEXT_PUBLIC_API_URL + "/subcategory",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        data: {
            name: name,
            category_id: categoryId
        },
    });
}

export { fetchSubcategory, addSubcategory };
export type { SubcategoryDisplay };
