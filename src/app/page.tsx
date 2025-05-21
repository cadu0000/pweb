"use client";

import { useState } from "react";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { Header } from "@/components/Header";
import { TransactionsTable } from "@/components/TransactionsTable/TransactionsTable";
import { NewTransactionModal } from "@/components/TransactionModal"; 

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <Header onOpenModal={handleOpenModal} />
      <BodyContainer>
        <CardContainer />
      </BodyContainer>
      <TransactionsTable />

      {isModalOpen && <NewTransactionModal onClose={handleCloseModal} />}
    </div>
  );
}
