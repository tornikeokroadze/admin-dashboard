import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";

export default function Admins() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Admins" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne
            cols={["Name", "Email", "Job", "Role", "Block", "Delete"]}
          />
        </ComponentCard>
      </div>
    </>
  );
}
