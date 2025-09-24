import AdminLayout from "@/components/dashboard/AdminLayout";

export const metadata = {
    title: "Qwesi. - Dashboard",
    description: "Qwesi. - Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
