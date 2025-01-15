import axios from "axios";

interface TransactionModel {
    issue_at: string;
    wallet_id: number;
    is_income: boolean;
    amount: number;
    category_id: number;
    subcategory_id: number;
    detail: string;
    status_id: number;
}

interface TransactionDisplay {
    issue_date: string;
    is_income: boolean;
    wallet: string;
    amount: number;
    category: string;
    subcategory: string;
    detail: string;
    status_id: number;
}

interface DebtModel {
    transaction_id: number;
    is_income: boolean;
    amount: number;
    identity_id: number;
    detail: string;
    status_id: number;
}

async function addTransactionWithDebt(
    transactionModel: TransactionModel,
    debtModels: DebtModel[]
) {
    axios({
        method: "post",
        url: process.env.NEXT_PUBLIC_API_URL + "/transaction",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        data: {
            transaction_in: transactionModel,
            debts_in: debtModels,
        },
    });
}

async function getTransactions(offset: number, limit: number) {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/transaction",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
            params: {
                offset: offset,
                limit: limit
            }
        }
    );
    return response.data;
}

async function getTotalTransaction() {
    const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/transaction/total",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
        }
    );
    return response.data;
}

export { getTransactions, addTransactionWithDebt, getTotalTransaction };
export type { TransactionModel, DebtModel, TransactionDisplay };
