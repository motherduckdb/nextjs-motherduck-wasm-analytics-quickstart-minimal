"use client"

import { MotherDuckClientProvider, useMotherDuckClientState } from "@/lib/motherduck/context/motherduckClientContext";
import HintComponent from "./components/hint";
import { useCallback, useState, useEffect } from "react";

const SQL_QUERY_STRING = `SELECT 
    u.username, 
    u.email, 
    o.total_amount, 
    o.order_date::VARCHAR as order_date
FROM 
    my_db.main.orders o
JOIN 
    my_db.main.users u ON o.user_id = u.user_id;`;

const useFetchCustomerOrdersData = () => {
    const { safeEvaluateQuery } = useMotherDuckClientState();
    const [error, setError] = useState<string | null>(null);

    const fetchCustomerOrdersData = useCallback(async () => {
        try {
            const safeResult = await safeEvaluateQuery(SQL_QUERY_STRING);
            if (safeResult.status === "success") {
                setError(null);
                return safeResult.result.data.toRows().map((row) => {
                    return {
                        username: row.username?.valueOf() as string,
                        email: row.email?.valueOf() as string,
                        totalAmount: row.total_amount?.valueOf() as number,
                        orderDate: row.order_date?.valueOf() as string,
                    };
                });

            } else {
                setError(safeResult.err.message);
                return [];
            }
        } catch (error) {
            setError("fetchCustomerOrdersData failed with error: " + error);
            return [];
        }

    }, [safeEvaluateQuery]);

    return { fetchCustomerOrdersData, error };
}


function CustomerOrdersTable() {
    const { fetchCustomerOrdersData, error } = useFetchCustomerOrdersData();
    const [customerOrdersData, setCustomerOrdersData] = useState<{ username: string, email: string, totalAmount: number, orderDate: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFetchCustomerOrdersData = async () => {
        setLoading(true);
        const result = await fetchCustomerOrdersData();
        setCustomerOrdersData(result);
        setLoading(false);
    };

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await fetchCustomerOrdersData();
            setCustomerOrdersData(result);
            setLoading(false);
        };
        fetch();
    }, [fetchCustomerOrdersData]);

    return (
        <div className="p-5">
            <p className="text-xl"> Customer Orders Data </p>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}
            <div className="w-3/4">
                {customerOrdersData.length > 0 && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Username</th>
                                <th className="border border-gray-300 p-2">Email</th>
                                <th className="border border-gray-300 p-2">Total Amount</th>
                                <th className="border border-gray-300 p-2">Order Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerOrdersData.map((orderItem, index) => (
                                <tr key={index} className="hover:bg-gray-400">
                                    <td className="border border-gray-300 p-2">{orderItem.username}</td>
                                    <td className="border border-gray-300 p-2">{orderItem.email}</td>
                                    <td className="border border-gray-300 p-2 text-right">${orderItem.totalAmount.toFixed(2)}</td>
                                    <td className="border border-gray-300 p-2">{orderItem.orderDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={handleFetchCustomerOrdersData} className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" >Refresh</button>
        </div>
    );
}

export default function Home() {
    return (
        <div>
            <MotherDuckClientProvider>
                <CustomerOrdersTable />
                <HintComponent />
            </MotherDuckClientProvider>
        </div>
    );
}
