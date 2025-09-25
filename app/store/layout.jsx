import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Qwesi. - Store Dashboard",
    description: "Qwesi. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
