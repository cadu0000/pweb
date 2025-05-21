import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { Header } from "@/components/Header";
import { TransactionsTable } from "@/components/TransactionsTable/TransactionsTable";

export default function Home() {
  return (
    <div>
      <Header />
      <BodyContainer>
        <CardContainer />
      </BodyContainer>
      <TransactionsTable />
    </div>
  );
}
