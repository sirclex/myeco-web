import axios from "axios";

interface IdentityDisplay {
    id: number;
    name: string;
}

async function fetchIdentityList() {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/identity",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
        }
    );
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

async function addIdentity(name: string) {
    axios({
        method: "post",
        url: process.env.NEXT_PUBLIC_API_URL + "/identity",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        data: {
            name: name,
            type_id: 1
        },
    })
}

export { fetchIdentityList, addIdentity };
export type { IdentityDisplay };
