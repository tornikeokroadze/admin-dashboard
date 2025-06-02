import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { ContactLidsItem } from "../types/contactLids";
import { fetchData } from "../hooks/useApi";

export default function ContsctLids() {
  const [contactLids, setContactLids] = useState<ContactLidsItem[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchContactLids = async () => {
    const res = await fetchData<ContactLidsItem[]>("/contactlids");
    setContactLids(
      res.data?.filter((item: any) => item.subscribe === false) || []
    );
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchContactLids();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Contact Lids" />
      <div className="space-y-6">
        <ComponentCard title="Contact Lids" button={false}>
          <BasicTableOne
            data={contactLids}
            loading={loading}
            page="contactlids"
            save={false}
            refetch={fetchContactLids}
            cols={["name", "email", "createdAt", "actions"]}
          />
        </ComponentCard>
      </div>
    </>
  );
}
