"use client";

import { DateTime } from "luxon";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";

import {
    getTransactions,
    TransactionDisplay,
} from "@/utils/transactionHandler";

import {
    fetchPendingDebtList,
    fetchAllDebtList,
    updateDebtStatus,
    PendingDebtDisplay,
    DebtDisplay,
} from "@/utils/debtHandler";

import {
    fetchIdentityList,
    addIdentity,
    IdentityDisplay,
} from "@/utils/identityHandler";

import {
    fetchCategory,
    CategoryDisplay,
    addCategory,
} from "@/utils/categoryHandler";

import { addSubcategory } from "@/utils/subcategoryHandler";

import Grid from "@mui/material/Grid2";
import {
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Stack,
    TextField,
} from "@mui/material";
import {
    DashboardOutlined,
    ReceiptLongOutlined,
    ReceiptOutlined,
    SubscriptionsOutlined,
    PermIdentityOutlined,
    AccountBalanceWalletOutlined,
    CategoryOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

const dashboardItem = [
    { id: 1, name: "Dashboard", icon: <DashboardOutlined /> },
    { id: 2, name: "Transaction", icon: <ReceiptLongOutlined /> },
    { id: 3, name: "Debt", icon: <ReceiptOutlined /> },
    { id: 4, name: "Subscription", icon: <SubscriptionsOutlined /> },
    { id: 5, name: "Wallet", icon: <AccountBalanceWalletOutlined /> },
    { id: 6, name: "Identity", icon: <PermIdentityOutlined /> },
    { id: 7, name: "Category", icon: <CategoryOutlined /> },
];

function renderFlow(isIncome: boolean) {
    if (isIncome) {
        return (
            <Chip
                label="Income"
                sx={{
                    backgroundColor: "#E5FAE6",
                    color: "#297B32",
                    fontWeight: "bold",
                }}
            />
        );
    } else {
        return (
            <Chip
                label="Expense"
                sx={{
                    backgroundColor: "#FFEBEB",
                    color: "#E83838",
                    fontWeight: "bold",
                }}
            />
        );
    }
}

function renderStatus(value: number) {
    if (value == 2)
        return (
            <Chip
                label="Done"
                sx={{
                    backgroundColor: "#E5FAE6",
                    color: "#297B32",
                    fontWeight: "bold",
                }}
            />
        );
    if (value == 3)
        return (
            <Chip
                label="Cancel"
                sx={{
                    backgroundColor: "#FFEBEB",
                    color: "#E83838",
                    fontWeight: "bold",
                }}
            />
        );
    return (
        <Chip
            label="Pending"
            sx={{
                backgroundColor: "#FEF4E1",
                color: "#F9970C",
                fontWeight: "bold",
            }}
        />
    );
}

function renderDatetime(value: string) {
    const datetime = DateTime.fromISO(value).setZone("system");
    return datetime.toFormat("ccc, LLL d, yyyy, H:mm");
}

const TRANSACTION_COLUMN_GRID_SIZE = [
    0.4, // Checkbox
    1.5, // Time
    1.5, // Amount
    1.25, // Wallet
    1, // Category
    1, // Subcategory
    3, // Detail
    1, // Status
];

const DEBT_COLUMN_GRID_SIZE = [
    0.4, // Checkbox
    1.5, // Time
    1.5, // Amount
    1.25, // Identity
    1, // Category
    1, // Subcategory
    3, // Detail
    1, // Status
];

const IDENTITY_COLUMN_GRID_SIZE = [
    0.4, // Checkbox
    1.5, // Name
];

const CATEGORY_COLUMN_GRID_SIZE = [
    0.4, // Checkbox
    1.5, // Name
    10, // Action
];

export default function PermanentDrawerLeft() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
    const [pendingDebts, setPendingDebts] = useState<PendingDebtDisplay[]>([]);
    const [identities, setIdentities] = useState<IdentityDisplay[]>([]);
    const [debts, setDebts] = useState<DebtDisplay[]>([]);
    const [selectedDebts, setSelectedDebts] = useState<number[]>([]);
    const [triggerReload, setTriggerReload] = useState(false);
    const [show, setShow] = useState(0);
    const [creatingIdentity, setCreatingIdentity] = useState(false);
    const [newIdentityName, setNewIdentityName] = useState("");
    const [categories, setCategories] = useState<CategoryDisplay[]>([]);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [creatingSubcategory, setCreatingSubcategory] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token || token === "") {
            router.push("/login");
        }

        getTransactions().then((value) => {
            const transactionsDisplay: TransactionDisplay[] = [];

            // @ts-expect-error: I know, I know
            value.forEach((element) => {
                const transaction: TransactionDisplay = {
                    issue_date: renderDatetime(element.issue_at)!,
                    wallet: element.wallet,
                    is_income: element.is_income,
                    amount: element.amount,
                    category: element.category,
                    subcategory: element.subcategory,
                    detail: element.detail,
                    status_id: element.status_id,
                };
                transactionsDisplay.push(transaction);
            });

            setTransactions(transactionsDisplay);
        });

        fetchPendingDebtList().then((value) => setPendingDebts(value));

        fetchAllDebtList().then((value) => setDebts(value));

        fetchIdentityList().then((value) => setIdentities(value));

        fetchCategory().then((value) => setCategories(value));
    }, [triggerReload, router]);

    const handleAddTransaction = () => {
        router.push("/transaction/create");
    };

    const handleAddSwtichTransaction = () => {
        router.push("/transaction/switch");
    };

    const handleDebtCheckboxChange = (id: number) => {
        setSelectedDebts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((recordId) => recordId !== id)
                : [...prevSelected, id]
        );
    };

    const handleUpdateStatus = (status_id: number) => {
        updateDebtStatus(selectedDebts, status_id);
        setTriggerReload(!triggerReload);
    };

    // Create Identity
    const handleOpenCreateIdentity = () => {
        setCreatingIdentity(true);
    };

    const handleCloseCreateIdentity = () => {
        setCreatingIdentity(false);
    };

    // @ts-expect-error: I know, I know
    const handleNewIdentityNameChange = (event) => {
        setNewIdentityName(event.target.value);
    };

    const handleSubmitNewIdentity = () => {
        addIdentity(newIdentityName);
        setNewIdentityName("");
        handleCloseCreateIdentity();
        setTriggerReload(!triggerReload);
    };

    // Create Category
    const handleOpenCreateCategory = () => {
        setCreatingCategory(true);
    };

    const handleCloseCreateCategory = () => {
        setCreatingCategory(false);
    };

    // @ts-expect-error: I know, I know
    const handleNewCategoryNameChange = (event) => {
        setNewCategoryName(event.target.value);
    };

    const handleSubmitNewCategory = () => {
        addCategory(newCategoryName);
        setNewCategoryName("");
        handleCloseCreateCategory();
        setTriggerReload(!triggerReload);
    };

    // Create Subcategory
    const handleOpenCreateSubcategory = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        setCreatingSubcategory(true);
    };

    const handleCloseCreateSubcategory = () => {
        setCreatingSubcategory(false);
    };

    // @ts-expect-error: I know, I know
    const handleNewSubcategoryNameChange = (event) => {
        setNewSubcategoryName(event.target.value);
    };

    const handleSubmitNewSubcategory = () => {
        addSubcategory(newSubcategoryName, selectedCategoryId);
        setNewSubcategoryName("");
        handleCloseCreateSubcategory();
        setTriggerReload(!triggerReload);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                }}
            >
                <Toolbar sx={{ backgroundColor: "white", color: "black" }}>
                    <Typography variant="h6" noWrap component="div">
                        Welcome back, Sircle!
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <List>
                    {dashboardItem.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => setShow(index)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {show == 0 && ( // Dashboard view
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
                >
                    <Toolbar />
                    <Box sx={{ width: "25%" }}>
                        <Divider />
                        <Grid container spacing={4} bgcolor={"#EDF8FD"}>
                            <Grid size={4}>
                                <Typography>Name</Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>Amount</Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>Flow</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        {pendingDebts.length > 0 ? (
                            pendingDebts.map((record, index) => (
                                <Box key={index}>
                                    <Grid
                                        container
                                        spacing={4}
                                        alignItems="center"
                                    >
                                        <Grid size={4}>
                                            <Typography>
                                                {record.name}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography>
                                                {record.amount}
                                            </Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            {renderFlow(record.isIncome)}
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </Box>
                            ))
                        ) : (
                            <Typography>No debts</Typography>
                        )}
                    </Box>
                </Box>
            )}
            {show == 1 && ( // Transaction view
                <Box sx={{ width: "100%" }}>
                    <Toolbar />
                    <Toolbar disableGutters>
                        <Stack direction={"row"} gap={2}>
                            <Button
                                variant="contained"
                                onClick={handleAddTransaction}
                            >
                                Add Transaction
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleAddSwtichTransaction}
                            >
                                Add Switch Transaction
                            </Button>
                        </Stack>
                    </Toolbar>
                    <Box>
                        <Divider />
                        <Grid
                            container
                            spacing={4}
                            alignItems="center"
                            bgcolor={"#EDF8FD"}
                        >
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[0]}>
                                <Checkbox />
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[1]}>
                                <Typography>Time</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[2]}>
                                <Typography>Amount</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[3]}>
                                <Typography>Wallet</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[4]}>
                                <Typography>Category</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[5]}>
                                <Typography>Subcategory</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[6]}>
                                <Typography>Detail</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[7]}>
                                <Typography>Status</Typography>
                            </Grid>
                            <Grid size={TRANSACTION_COLUMN_GRID_SIZE[8]}>
                                <Typography></Typography>
                            </Grid>
                        </Grid>
                        <Divider />

                        {transactions.map((record, index) => (
                            <Box key={index}>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[0]}
                                    >
                                        <Checkbox />
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[1]}
                                    >
                                        <Typography>
                                            {record.issue_date}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[2]}
                                    >
                                        <Typography>
                                            {record.is_income == true
                                                ? "+ "
                                                : "- "}
                                            {Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(record.amount)}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[3]}
                                    >
                                        <Typography>{record.wallet}</Typography>
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[4]}
                                    >
                                        <Typography>
                                            {record.category}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[5]}
                                    >
                                        <Typography>
                                            {record.subcategory}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[6]}
                                    >
                                        <Typography>{record.detail}</Typography>
                                    </Grid>
                                    <Grid
                                        size={TRANSACTION_COLUMN_GRID_SIZE[7]}
                                    >
                                        {renderStatus(record.status_id)}
                                    </Grid>
                                </Grid>
                                <Divider />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            {show == 2 && ( // Debt view
                <Box sx={{ width: "100%" }}>
                    <Toolbar />
                    <Toolbar disableGutters>
                        <Stack direction={"row"} spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={() => handleUpdateStatus(2)}
                            >
                                Mark as Done
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleUpdateStatus(1)}
                            >
                                Mark as Pending
                            </Button>
                        </Stack>
                    </Toolbar>
                    <Box>
                        <Divider />
                        <Grid
                            container
                            spacing={4}
                            alignItems="center"
                            bgcolor={"#EDF8FD"}
                        >
                            <Grid size={DEBT_COLUMN_GRID_SIZE[0]}>
                                <Checkbox />
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[1]}>
                                <Typography>Time</Typography>
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[2]}>
                                <Typography>Amount</Typography>
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[3]}>
                                <Typography>Identity</Typography>
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[4]}>
                                <Typography>Category</Typography>
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[5]}>
                                <Typography>Subcategory</Typography>
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[6]}>
                                <Typography>Detail</Typography>
                            </Grid>
                            <Grid size={DEBT_COLUMN_GRID_SIZE[7]}>
                                <Typography>Status</Typography>
                            </Grid>
                        </Grid>
                        <Divider />

                        {debts.map((record, index) => (
                            <Box key={index}>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[0]}>
                                        <Checkbox
                                            checked={selectedDebts.includes(
                                                record.id
                                            )}
                                            onChange={() =>
                                                handleDebtCheckboxChange(
                                                    record.id
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[1]}>
                                        <Typography>
                                            {renderDatetime(record.issueDate)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[2]}>
                                        <Typography>
                                            {record.isIncome == true
                                                ? "+ "
                                                : "- "}
                                            {Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(record.amount)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[3]}>
                                        <Typography>
                                            {record.identity}
                                        </Typography>
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[4]}>
                                        <Typography>
                                            {record.category}
                                        </Typography>
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[5]}>
                                        <Typography>
                                            {record.subcategory}
                                        </Typography>
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[6]}>
                                        <Typography>{record.detail}</Typography>
                                    </Grid>
                                    <Grid size={DEBT_COLUMN_GRID_SIZE[7]}>
                                        {renderStatus(record.statusId)}
                                    </Grid>
                                </Grid>
                                <Divider />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            {show == 3 && ( // Subscription view
                <Box>
                    <Toolbar />
                    <Box>Subscription</Box>
                </Box>
            )}
            {show == 4 && ( // Wallet view
                <Box>
                    <Toolbar />
                    <Box>Wallet</Box>
                </Box>
            )}
            {show == 5 && ( // Identity view
                <Box sx={{ width: "100%" }}>
                    <Toolbar />
                    <Toolbar disableGutters>
                        <Stack direction={"row"} gap={2}>
                            <Button
                                variant="contained"
                                onClick={handleOpenCreateIdentity}
                            >
                                Add Identity
                            </Button>
                        </Stack>
                    </Toolbar>
                    <Box>
                        <Divider />
                        <Grid
                            container
                            spacing={4}
                            alignItems="center"
                            bgcolor={"#EDF8FD"}
                        >
                            <Grid size={IDENTITY_COLUMN_GRID_SIZE[0]}>
                                <Checkbox />
                            </Grid>
                            <Grid size={IDENTITY_COLUMN_GRID_SIZE[1]}>
                                <Typography>Name</Typography>
                            </Grid>
                        </Grid>
                        <Divider />

                        {identities.map((record, index) => (
                            <Box key={index}>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid size={IDENTITY_COLUMN_GRID_SIZE[0]}>
                                        <Checkbox />
                                    </Grid>
                                    <Grid size={IDENTITY_COLUMN_GRID_SIZE[1]}>
                                        <Typography>{record.name}</Typography>
                                    </Grid>
                                </Grid>
                                <Divider />
                            </Box>
                        ))}

                        <Dialog
                            open={creatingIdentity}
                            onClose={handleCloseCreateIdentity}
                        >
                            <DialogTitle>Add new identity</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter identity name:
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    value={newIdentityName}
                                    onChange={handleNewIdentityNameChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCreateIdentity}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmitNewIdentity}>
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            )}
            {show == 6 && ( // Wallet view
                <Box sx={{ width: "100%" }}>
                    <Toolbar />
                    <Toolbar disableGutters>
                        <Stack direction={"row"} gap={2}>
                            <Button
                                variant="contained"
                                onClick={handleOpenCreateCategory}
                            >
                                Add Category
                            </Button>
                        </Stack>
                    </Toolbar>
                    <Box>
                        <Divider />
                        <Grid
                            container
                            spacing={4}
                            alignItems="center"
                            bgcolor={"#EDF8FD"}
                        >
                            <Grid size={CATEGORY_COLUMN_GRID_SIZE[0]}>
                                <Checkbox />
                            </Grid>
                            <Grid size={CATEGORY_COLUMN_GRID_SIZE[1]}>
                                <Typography>Name</Typography>
                            </Grid>
                            <Grid size={CATEGORY_COLUMN_GRID_SIZE[2]}>
                                <Typography>Action</Typography>
                            </Grid>
                        </Grid>
                        <Divider />

                        {categories.map((record, index) => (
                            <Box key={index}>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid size={CATEGORY_COLUMN_GRID_SIZE[0]}>
                                        <Checkbox />
                                    </Grid>
                                    <Grid size={CATEGORY_COLUMN_GRID_SIZE[1]}>
                                        <Typography>{record.name}</Typography>
                                    </Grid>
                                    <Grid size={CATEGORY_COLUMN_GRID_SIZE[2]}>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    handleOpenCreateSubcategory(
                                                        record.id
                                                    )
                                                }
                                            >
                                                + Sub
                                            </Button>
                                            {/* <Button
                                                variant="contained"
                                                color="error"
                                            >
                                                Delete
                                            </Button> */}
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Divider />
                            </Box>
                        ))}

                        <Dialog
                            open={creatingCategory}
                            onClose={handleCloseCreateCategory}
                        >
                            <DialogTitle>Add new category</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter category name:
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    value={newCategoryName}
                                    onChange={handleNewCategoryNameChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCreateCategory}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmitNewCategory}>
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={creatingSubcategory}
                            onClose={handleCloseCreateSubcategory}
                        >
                            <DialogTitle>Add new category</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter subcategory name:
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Subcategory name"
                                    type="text"
                                    fullWidth
                                    value={newSubcategoryName}
                                    onChange={handleNewSubcategoryNameChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCreateSubcategory}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmitNewSubcategory}>
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
