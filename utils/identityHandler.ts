import axios from "axios";

const api_url = "http://127.0.0.1:8000";

interface IdentityDisplay {
    id: number;
    name: string;
}

async function fetchIdentityList() {
    const response = await axios.get(api_url + "/identities");
    let result: IdentityDisplay[] = [];

    // @ts-ignore
    response.data.forEach((element) => {
        let identity: IdentityDisplay = {
            id: element.id,
            name: element.name,
        };
        result.push(identity);
    });
    return result;
}

export { fetchIdentityList };
export type { IdentityDisplay };
