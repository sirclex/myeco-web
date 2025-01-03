import axios from "axios";

interface PendingDebtDisplay {
    identity: string;
    amount: number;
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
        process.env.NEXT_PUBLIC_ANALYTIC_API_URL + "/debt/pending",
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
            identity: element.identity,
            amount: element.amount
        };
        result.push(debt);
    });
    return result;
}

async function fetchAllDebtList() {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/debt",
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
            issueDate: element.issue_at,
            isIncome: element.is_income,
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
    const cookedData = debt_ids.map((id) => {
        return {
            id: id,
            status_id: status_id,
        };
    });
    const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + "/debt/multi",
        cookedData,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            }
        }
    );
}

export { fetchPendingDebtList, fetchAllDebtList, updateDebtStatus };
export type { PendingDebtDisplay, DebtDisplay };
