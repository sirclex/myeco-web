import axios from "axios";

const api_url = "http://127.0.0.1:8000";

interface SubcategoryDisplay {
    id: number;
    name: string;
    category_id: number;
}

async function fetchSubcategory(category_id: number) {
    const response = await axios.get(api_url + "/subcategories", {
        params: {
            category_id: category_id,
        },
    });
    return response.data;
}

export { fetchSubcategory };
export type { SubcategoryDisplay };
