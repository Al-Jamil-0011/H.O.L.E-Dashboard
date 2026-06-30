import { ExpenseDetails } from "@/components/expense-details";


export default async function ExpenseDetailPage({ params }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <div className="bg-background-200/30 h-full rounded-lg">
        <ExpenseDetails expenseId={id} />
    </div>;
}