export function TransactionsTableHeader() {
  const headers = ["Título", "Preço", "Categoria", "Data"];

  return (
    <div
      className="grid grid-cols-[3fr_1fr_1fr_0.5fr] text-[#969CB2] mb-4 px-6"
      style={{
        fontFamily: "Poppins",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: "100%",
      }}
    >
      {headers.map((header) => (
        <div key={header} className="text-left">
          {header}
        </div>
      ))}
    </div>
  );

}
