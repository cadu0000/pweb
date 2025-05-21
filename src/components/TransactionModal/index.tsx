interface NewTransactionModalProps {
  onClose: () => void;
}

export function NewTransactionModal({ onClose }: NewTransactionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#F0F2F5] p-8 rounded-md w-full max-w-md relative shadow-lg">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold text-[#363F5F] mb-6">Cadastrar transação</h2>

        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Nome" className="bg-[#E7E9EE] p-4 rounded" />
          <input type="number" placeholder="Preço" className="bg-[#E7E9EE] p-4 rounded" />

          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#E7E9EE] p-4 rounded border border-transparent hover:border-green-500"
            >
              <span className="text-green-500">↑ Entrada</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#E7E9EE] p-4 rounded border border-transparent hover:border-red-500"
            >
              <span className="text-red-500">↓ Saída</span>
            </button>
          </div>

          <input type="text" placeholder="Categoria" className="bg-[#E7E9EE] p-4 rounded" />

          <button
            type="submit"
            className="bg-[#33CC95] text-white p-4 rounded mt-4 hover:brightness-90 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  )
}
