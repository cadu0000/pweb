import { TransactionsTableHeader } from "@/components/TransactionsTable/header"
import { TransactionsTableRow } from "@/components/TransactionsTable/row"

const invoices = [
  { titulo: "Desenvolvimento de site", preco: 12000, data: "13/04/2021", categoria: "Venda" },
  { titulo: "Hamburguer", preco: -59, data: "10/04/2021", categoria: "Alimentação" },
  { titulo: "Aluguel do apartamento", preco: -1200, data: "27/03/2021", categoria: "Casa" },
  { titulo: "Computador", preco: 5400, data: "15/03/2021", categoria: "Venda" },
]

export function TransactionsTable() {
  return (
    <div className="w-full max-w-[1120px] mx-auto mt-8">
      <TransactionsTableHeader />
      <div className="flex flex-col gap-2">
        {invoices.map((invoice) => (
          <TransactionsTableRow key={invoice.titulo} {...invoice} />
        ))}
      </div>
    </div>
  );
}
