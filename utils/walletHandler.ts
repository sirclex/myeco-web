import axios from "axios"

interface WalletDisplay {
    id: number;
    name: string;
}

async function fetchWalletInfo() {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/wallets",
        {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }
    )
    return response.data
}

export {fetchWalletInfo}
export type {WalletDisplay}