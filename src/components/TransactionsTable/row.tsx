interface TransactionsTableRowProps {
  titulo: string;
  preco: number;
  categoria: string;
  data: string;
}

export function TransactionsTableRow({ titulo, preco, categoria, data}: TransactionsTableRowProps) {
  const priceTextColor = (value: number) => value < 0 ? "text-[#E62E4D]" : "text-[#33CC95]";

  return (
    <div
      className="grid grid-cols-[3fr_1fr_1fr_0.5fr] bg-white rounded-[5px] px-6 py-4 shadow-sm"
      style={{
        fontFamily: "Poppins",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: "24px",
      }}
    >
      <span className="text-[#363F5F]">{titulo}</span>
      <span className={priceTextColor(preco)}>
        {preco.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
      })}
      </span>
      <span className="text-[#969CB3]">{categoria}</span>
      <span className="text-[#969CB3] text-left">{data}</span>
    </div>
  );
}
