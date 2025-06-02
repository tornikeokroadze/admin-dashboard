import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { BookItem } from "../types/book";
import { fetchData } from "../hooks/useApi";

export default function Books() {
  const [books, setBooks] = useState<BookItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    const res = await fetchData<BookItem[]>("/books");
    setBooks(res.data);
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Books" />
      <div className="space-y-6">
        <ComponentCard title="Books" button={false}>
          <BasicTableOne
            data={books}
            loading={loading}
            deletable={false}
            page="books"
            refetch={fetchBooks}
            cols={["name", "email", "peopleNum", "tourId", "createdAt", "actions"]}
          />
        </ComponentCard>
      </div>
    </>
  );
}
