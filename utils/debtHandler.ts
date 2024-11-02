import axios from "axios";

interface PendingDebtDisplay {
    name: string,
    amount: number,
    isIncome: boolean
}

async function fetchPendingDebtList() {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/pendingDebt",
        {
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }
    );
    let result: PendingDebtDisplay[] = [];

    // @ts-ignore
    response.data.forEach((element) => {
        let debt: PendingDebtDisplay = {
            name: element.name,
            amount: element.amount,
            isIncome: element.isIncome,
        };
        result.push(debt);
    });
    console.log(result)
    return result;
}

export { fetchPendingDebtList };
export type { PendingDebtDisplay };
