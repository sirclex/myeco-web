"use client";
import {DateTime} from "luxon"
import Grid from "@mui/material/Grid2";

import { useRouter } from "next/navigation";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchWalletInfo, WalletDisplay } from "@/utils/walletHandler";
import { fetchCategory, CategoryDisplay } from "@/utils/categoryHandler";
import { fetchSubcategory, SubcategoryDisplay } from "@/utils/subcategoryHandler";
import { fetchIdentityList, IdentityDisplay } from "@/utils/identityHandler";
import { addTransactionWithDebt, TransactionModel, DebtModel } from "@/utils/transactionHandler";

interface Debt {
    in_out: boolean;
    amount: number;
    identity: IdentityDisplay;
    detail: string;
    is_done: boolean;
}

interface Transaction {
    time: string;
    wallet: WalletDisplay;
    in_out: boolean;
    amount: number;
    category: CategoryDisplay;
    subcategory: SubcategoryDisplay;
    detail: string;
    have_debt: boolean;
    debts: Debt[];
}

export default function CreateTransaction() {
    const router = useRouter()
    const [walletList, setWalletList] = useState<WalletDisplay[]>([]);
    const [categoryList, setCategoryList] = useState<CategoryDisplay[]>([]);
    const [subcategoryList, setSubcategoryList] = useState<SubcategoryDisplay[]>([]);
    const [identityList, setIdentityList] = useState<IdentityDisplay[]>([]);

    useEffect(() => {
        fetchWalletInfo().then((value) => {
            setWalletList(value);
        });

        fetchCategory().then((value) => {
            setCategoryList(value);
        });

        fetchIdentityList().then((value) => {
            setIdentityList(value);
        });
    }, []);

    const getCurrentDatetime = () => {
        const now = DateTime.now().setZone("system").toString();
        return now.slice(0, 16);
    };

    const [transaction, setTransaction] = useState<Transaction>({
        time: getCurrentDatetime(),
        wallet: { id: -1, name: "" },
        in_out: false,
        amount: 0,
        category: { id: -1, name: "" },
        subcategory: { id: -1, name: "", category_id: -1 },
        detail: "",
        have_debt: false,
        debts: [],
    });

    // @ts-expect-error
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setTransaction({
            ...transaction,
            [name]: type == "checkbox" ? checked : value,
        });
    };

    // @ts-expect-error
    const handleWalletChange = (event, newValue) => {
        setTransaction({
            ...transaction,
            wallet: newValue,
        });
    };

    // @ts-expect-error
    const handleCategoryChange = (event, newValue) => {
        setTransaction({
            ...transaction,
            category: newValue,
            subcategory: { id: -1, name: "", category_id: -1 },
        });
        fetchSubcategory(newValue.id).then((value) => {
            setSubcategoryList(value);
        });
    };

    // @ts-expect-error
    const handleSubcategoryChange = (event, newValue) => {
        setTransaction({
            ...transaction,
            subcategory: newValue,
        });
    };

    // @ts-expect-error
    const handleDebtChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        let newDebts = transaction.debts;
        newDebts[index] = {
            ...newDebts[index],
            [name]: type === "checkbox" ? checked : value,
        };
        setTransaction({
            ...transaction,
            debts: newDebts,
        });
    };

    const handleAddDebt = () => {
        setTransaction({
            ...transaction,
            debts: [
                ...transaction.debts,
                {
                    in_out: false,
                    amount: 0,
                    identity: { id: -1, name: "" },
                    detail: "",
                    is_done: false,
                },
            ],
        });
    };

    // @ts-expect-error
    const handleDeleteDebt = (index, event) => {
        let newDebts = transaction.debts;
        console.log(index)
        newDebts.splice(index, 1)
        setTransaction({
            ...transaction,
            debts: newDebts,
        });
    }

    // @ts-expect-error
    const handleIdentityChange = (index: number, event, newValue) => {
        let newDebts = transaction.debts;
        newDebts[index] = {
            ...newDebts[index],
            identity: newValue,
        };
        setTransaction({
            ...transaction,
            debts: newDebts,
        });
    };

    const handleBack = () => {
        router.push("/transaction")
    }

    // @ts-expect-error
    const handleSubmit = (event) => {
        event.preventDefault();
        let transactionModel: TransactionModel = {
            issue_date: transaction.time,
            wallet_id: transaction.wallet.id,
            in_out: transaction.in_out,
            amount: transaction.amount,
            category_id: transaction.category.id,
            subcategory_id: transaction.subcategory.id,
            detail: transaction.detail,
            status_id: 2
        }
        let debtModels:DebtModel[] = []
        transaction.debts.forEach((element) => {
            let debt:DebtModel = {
                transaction_id: 0,
                in_out: element.in_out,
                amount: element.amount,
                identity_id: element.identity.id,
                detail: element.detail,
                status_id: element.is_done ? 2 : 1
            }
            debtModels.push(debt)
        })
        debtModels.forEach(debt => {
            if (debt.status_id == 1) {
                transactionModel.status_id = 1
                return;
            }
        })
        addTransactionWithDebt(transactionModel, debtModels)
        router.push("/transaction")
    };

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <Stack component="form" onSubmit={handleSubmit} gap={2} width={"50%"}>
                <Grid container spacing={1}>
                    <Box display={"flex"} gap={2}>
                        <TextField
                            label="Time"
                            type="datetime-local"
                            name="time"
                            value={transaction.time}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Amount"
                            type="number"
                            name="amount"
                            value={transaction.amount}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            name="in_out"
                            checked={transaction.in_out}
                            onChange={handleChange}
                        />
                        <Typography>Is income?</Typography>
                    </Box>
                </Grid>
                <Autocomplete
                    options={walletList}
                    getOptionLabel={(option: WalletDisplay) => option.name}
                    onChange={handleWalletChange}
                    value={transaction.wallet}
                    renderInput={(params) => (
                        <TextField {...params} label="Wallet" name="wallet" />
                    )}
                />
                <Box display={"flex"} gap={2}>
                    <Autocomplete
                        options={categoryList}
                        getOptionLabel={(option: CategoryDisplay) => option.name}
                        onChange={handleCategoryChange}
                        value={transaction.category}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" name="category" />
                        )}
                        sx={{flexGrow: 1}}
                    />
                    <Autocomplete
                        options={subcategoryList}
                        getOptionLabel={(option: SubcategoryDisplay) => option.name}
                        onChange={handleSubcategoryChange}
                        value={transaction.subcategory}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Subcategory"
                                name="subcategory"
                            />
                        )}
                        sx={{flexGrow: 1}}
                    />
                </Box>
                <TextField
                    multiline
                    label="Detail"
                    type="text"
                    name="detail"
                    value={transaction.detail}
                    onChange={handleChange}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                        name="have_debt"
                        checked={transaction.have_debt}
                        onChange={handleChange}
                    />
                    <Typography>Have debt?</Typography>
                </Box>
                {transaction.have_debt && (
                    <Stack>
                        {transaction.debts.map((debt, index) => (
                            <Stack key={index} gap={2}>
                                <Box display={"flex"} gap={2}>
                                    <Box flex={1}>
                                        <Autocomplete
                                            options={identityList}
                                            getOptionLabel={(option: IdentityDisplay) =>
                                                option.name
                                            }
                                            onChange={(e, newValue) =>
                                                handleIdentityChange(index, e, newValue)
                                            }
                                            value={debt.identity}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Identity"
                                                    name="identity"
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Stack direction="row" flex={1} gap={1}>
                                        <TextField
                                            label="Amount"
                                            type="number"
                                            name="amount"
                                            value={debt.amount}
                                            onChange={(e) => handleDebtChange(index, e)}
                                        />
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Checkbox
                                                name="in_out"
                                                checked={debt.in_out}
                                                onChange={(e) => handleDebtChange(index, e)}
                                            />
                                            <Typography>Is income?</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                                <Stack gap={1}>
                                    <TextField
                                        multiline
                                        label="Detail"
                                        type="text"
                                        name="detail"
                                        value={debt.detail}
                                        onChange={(e) => handleDebtChange(index, e)}
                                    />
                                    <Box display="flex" gap={1}>
                                        <Box display={"flex"} alignItems={"center"}>
                                        <Checkbox
                                            name="is_done"
                                            checked={debt.is_done}
                                            onChange={(e) => handleDebtChange(index, e)}
                                        />
                                        <Typography>Is done?</Typography>
                                        </Box>
                                        <Button type="button" sx={{color: "#ef5350", '&:hover': {
                                            backgroundColor: "#ffe6e6"
                                        }}}
                                        onClick={(e) => handleDeleteDebt(index, e)}
                                        >
                                        Delete Debt
                                    </Button>
                                    </Box>
                                    
                                </Stack>
                                <Divider/>
                            </Stack>
                        ))}
                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleAddDebt}
                        >
                            Add Debt
                        </Button>
                    </Stack>
                )}
                <Box display={"flex"} gap={2}>
                    <Button type="button" variant="outlined" sx={{flexGrow: 1}} onClick={handleBack}>Back</Button>
                    <Button type="submit" variant="contained" sx={{flexGrow: 1}}>
                        Submit
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
