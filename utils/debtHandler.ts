import axios from "axios";

interface PendingDebtDisplay {
    name: string;
    amount: number;
    isIncome: boolean;
}

interface DebtDisplay {
    id: number,
    transactionId: number,
    issueDate: string;
    isIncome: boolean;
    wallet: string;
    amount: number;
    detail: string;
    identity: string;
    statusId: number;
}

async function fetchPendingDebtList() {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/pendingDebt",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
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
    return result;
}

async function fetchAllDebtList() {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/debts",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
        }
    );
    let result: DebtDisplay[] = [];

    // @ts-ignore
    response.data.forEach((element) => {
        let debt: DebtDisplay = {
            id: element.id,
            transactionId: element.transaction_id,
            issueDate: element.issue_date,
            isIncome: element.in_out,
            wallet: element.wallet,
            amount: element.amount,
            detail: element.detail,
            identity: element.identity,
            statusId: element.status_id,
        };
        result.push(debt);
    });
    return result;
}

export { fetchPendingDebtList, fetchAllDebtList };
export type { PendingDebtDisplay, DebtDisplay };
