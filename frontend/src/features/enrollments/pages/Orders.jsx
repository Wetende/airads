import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Orders({ orders = [] }) {
    return (
        <DashboardLayout role="student" breadcrumbs={[{ label: "Orders" }]}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Head title="My Orders" />
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2.5 }}>
                    <Typography variant="h5" fontWeight={700}>My Orders</Typography>
                    <Button component={Link} href="/programs/" variant="outlined">Browse Programs</Button>
                </Stack>
                <Card>
                    <CardContent>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reference</TableCell>
                                    <TableCell>Program</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.reference}</TableCell>
                                        <TableCell>{order.program?.name}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.currency} {(order.amountMinor / 100).toLocaleString()}</TableCell>
                                        <TableCell>{order.provider}</TableCell>
                                        <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</TableCell>
                                    </TableRow>
                                ))}
                                {orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No orders yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Container>
        </DashboardLayout>
    );
}
