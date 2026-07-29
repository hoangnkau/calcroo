import AbnExpenseTracker from "@/components/AbnExpenseTracker";

export const metadata = {
  title: "ABN ledger",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AbnExpenseTracker />;
}
