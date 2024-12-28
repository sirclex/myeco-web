"use client";
import { DateTime } from "luxon";
import Grid from "@mui/material/Grid2";

import { useRouter } from "next/navigation";
import {
    Autocomplete,
    Box,
    Button,
    Stack,
    TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useEffect, useState } from "react";
import { fetchWalletInfo, WalletDisplay } from "@/utils/walletHandler";
import { CategoryDisplay } from "@/utils/categoryHandler";
import {
    SubcategoryDisplay,
} from "@/utils/subcategoryHandler";
import { IdentityDisplay } from "@/utils/identityHandler";
import {
    addTransactionWithDebt,
    TransactionModel,
} from "@/utils/transactionHandler";

interface Debt {
    in_out: boolean;
    amount: number;
    identity: IdentityDisplay;
    detail: string;
    is_done: boolean;
}

interface Transaction {
    time: DateTime;
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
    const router = useRouter();
    const [walletListFrom, setWalletListFrom] = useState<WalletDisplay[]>([]);
    const [walletListTo, setWalletListTo] = useState<WalletDisplay[]>([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (!token || token === '') {
            router.push('/login')
        }

        fetchWalletInfo().then((value) => {
            setWalletListFrom(value);
        });
    }, [router]);

    const [transactionFrom, setTransactionFrom] = useState<Transaction>({
        time: DateTime.now(),
        wallet: { id: -1, name: "" },
        in_out: false,
        amount: 0,
        category: { id: 5, name: "Misc" },
        subcategory: { id: 15, name: "Switch", category_id: 5 },
        detail: "",
        have_debt: false,
        debts: [],
    });

    const [transactionTo, setTransactionTo] = useState<Transaction>({
        time: DateTime.now(),
        wallet: { id: -1, name: "" },
        in_out: true,
        amount: 0,
        category: { id: 5, name: "Misc" },
        subcategory: { id: 15, name: "Switch", category_id: 5 },
        detail: "",
        have_debt: false,
        debts: [],
    });

    // @ts-expect-error: I know, I know
    const handleTimePicker = (value) => {
        setTransactionFrom({
            ...transactionFrom,
            time: value,
        });
    };

    // @ts-expect-error: I know, I know
    const handleAmountChange = (event) => {
        const { name, value, type, checked } = event.target;
        setTransactionFrom({
            ...transactionFrom,
            [name]: type == "checkbox" ? checked : value,
        });

        setTransactionTo({
            ...transactionTo,
            [name]: type == "checkbox" ? checked : value,
        });
    };

    // @ts-expect-error: I know, I know
    const handleWalletFromChange = (event, newValue) => {
        setTransactionFrom({
            ...transactionFrom,
            wallet: newValue,
        });

        setTransactionTo({
            ...transactionTo,
            wallet: { id: -1, name: "" },
        });
        setWalletListTo(
            walletListFrom.filter((wallet) => wallet.id != newValue.id)
        );
    };

    // @ts-expect-error: I know, I know
    const handleWalletToChange = (event, newValue) => {
        setTransactionTo({
            ...transactionTo,
            wallet: newValue,
        });
    };

    const handleBack = () => {
        router.push("/transaction");
    };

    // @ts-expect-error: I know, I know
    const handleSubmit = (event) => {
        event.preventDefault();
        const transactionFromModel: TransactionModel = {
            issue_at: transactionFrom.time.toString().slice(0, 19),
            wallet_id: transactionFrom.wallet.id,
            is_income: transactionFrom.in_out,
            amount: transactionFrom.amount,
            category_id: transactionFrom.category.id,
            subcategory_id: transactionFrom.subcategory.id,
            detail: `To ${transactionTo.wallet.name}`,
            status_id: 2,
        };

        const transactionToModel: TransactionModel = {
            issue_at: transactionFrom.time.plus(1000).toString().slice(0, 19),
            wallet_id: transactionTo.wallet.id,
            is_income: transactionTo.in_out,
            amount: transactionTo.amount,
            category_id: transactionTo.category.id,
            subcategory_id: transactionTo.subcategory.id,
            detail: `From ${transactionFrom.wallet.name}`,
            status_id: 2,
        };

        addTransactionWithDebt(transactionFromModel, []);
        addTransactionWithDebt(transactionToModel, []);

        router.push("/transaction");
    };

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <Stack
                component="form"
                onSubmit={handleSubmit}
                gap={2}
                width={"50%"}
            >
                <Grid container spacing={1}>
                    <Box display={"flex"} gap={2}>
                        <LocalizationProvider
                            dateAdapter={AdapterLuxon}
                            adapterLocale={"vi"}
                        >
                            <DateTimePicker
                                label="Time"
                                name="time"
                                value={transactionFrom.time}
                                onChange={handleTimePicker}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Amount"
                            type="number"
                            name="amount"
                            value={transactionFrom.amount}
                            onChange={handleAmountChange}
                        />
                    </Box>
                </Grid>
                <Autocomplete
                    options={walletListFrom}
                    getOptionLabel={(option: WalletDisplay) => option.name}
                    onChange={handleWalletFromChange}
                    value={transactionFrom.wallet}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="From wallet"
                            name="walletFrom"
                        />
                    )}
                />
                <Autocomplete
                    options={walletListTo}
                    getOptionLabel={(option: WalletDisplay) => option.name}
                    onChange={handleWalletToChange}
                    value={transactionTo.wallet}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="To wallet"
                            name="walletTo"
                        />
                    )}
                />
                <Box display={"flex"} gap={2}>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ flexGrow: 1 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
