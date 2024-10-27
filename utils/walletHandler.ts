import axios from "axios"

const api_url = "http://127.0.0.1:8000"

interface WalletDisplay {
    id: number;
    name: string;
}

async function fetchWalletInfo() {
    const response = await axios.get(api_url + "/wallets")
    return response.data
}

export {fetchWalletInfo}
export type {WalletDisplay}