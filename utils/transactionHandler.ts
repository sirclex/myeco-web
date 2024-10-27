import axios from "axios";

const api_url = "http://127.0.0.1:8000";

interface TransactionModel {
    issue_date: string,
    wallet_id: number,
    in_out: boolean,
    amount: number,
    category_id: number,
    subcategory_id: number,
    detail: string,
    status_id: number
}

interface TransactionDisplay {
    issue_date: string,
    in_out: boolean,
    wallet: string,
    amount: number,
    category: string,
    subcategory: string,
    status_id: number
}

interface DebtModel {
    transaction_id: number,
    in_out: boolean,
    amount: number,
    identity_id: number
    detail: string,
    status_id: number
}

async function addTransactionWithDebt(transactionModel: TransactionModel, debtModels: DebtModel[]) {
    axios({
        method: "post",
        url: api_url + "/transaction/create",
        data: {
            transaction: transactionModel,
            debts: debtModels
        }
    }) 
}

async function getTransactions() {
    const response = await axios.get(api_url + "/transactions")
    return response.data
}

export { getTransactions, addTransactionWithDebt };
export type {TransactionModel, DebtModel, TransactionDisplay}
