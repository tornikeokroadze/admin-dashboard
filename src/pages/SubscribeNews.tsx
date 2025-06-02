import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { ContactLidsItem } from "../types/contactLids";
import { fetchData } from "../hooks/useApi";

export default function SubscribeNews() {
  const [subscribeNews, setSubscribeNews] = useState<ContactLidsItem[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchSubscribeNews = async () => {
    const res = await fetchData<ContactLidsItem[]>("/contactlids");
    setSubscribeNews(
      res.data?.filter((item: any) => item.subscribe === true) || []
    );
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchSubscribeNews();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Subscribe News" />
      <div className="space-y-6">
        <ComponentCard title="Subscribe News" button={false}>
          <BasicTableOne
            data={subscribeNews}
            loading={loading}
            page="contactlids"
            edit={false}
            refetch={fetchSubscribeNews}
            cols={["email", "createdAt", "actions"]}
          />
        </ComponentCard>
      </div>
    </>
  );
}
