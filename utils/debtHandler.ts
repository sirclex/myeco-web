import axios from "axios";

interface PendingDebtDisplay {
    name: string;
    amount: number;
    isIncome: boolean;
}

interface DebtDisplay {
    id: number;
    issueDate: string;
    isIncome: boolean;
    amount: number;
    category: string,
    subcategory: string,
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
            issueDate: element.issue_date,
            isIncome: element.in_out,
            amount: element.amount,
            category: element.category,
            subcategory: element.subcategory,
            detail: element.detail,
            identity: element.identity,
            statusId: element.status_id,
        };
        result.push(debt);
    });
    return result;
}

async function updateDebtStatus(debt_ids: number[], status_id: number) {
    const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/updateStatusDebt",
        debt_ids,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            params: {
                status_id: status_id,
            },
        }
    );
}

export { fetchPendingDebtList, fetchAllDebtList, updateDebtStatus };
export type { PendingDebtDisplay, DebtDisplay };
