import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link } from "react-router";
import { useState } from "react";

interface Transaction {
  createdAt: string;
  id: string;
  amount: number;
  desc: string;
}

interface UserDetails {
  credits: number;
  transactions: Transaction[];
}

const BillingHistory = ({ user }: { user: UserDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credits & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Balance Banner */}
          <div className="flex items-center justify-between p-4 bg-[#00E0C6] rounded-lg">
            <div>
              <p className="text-sm font-medium">Current Balance</p>
              <p className="text-2xl font-bold">{user?.credits || 0} Credits</p>
            </div>
            <Link to="/dashboard/credits">
              <Button className="bg-black text-white hover:bg-gray-800">
                Buy More Credits
              </Button>
            </Link>
          </div>

          {/* Transaction History */}
          <div>
            <h4 className="font-semibold mb-4">Transaction History</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-sm">
                      Date
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-sm">
                      Action
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-sm">
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user?.transactions && user?.transactions.length > 0 ? (
                    (() => {
                      // Calculate pagination
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const currentTransactions = user?.transactions.slice(startIndex, endIndex);

                      return (
                        <>
                          {currentTransactions.map((txn: Transaction) => {
                            const date = new Date(txn.createdAt);
                            const formattedDate = date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });

                            return (
                              <tr key={txn.id} className="border-b border-gray-100">
                                <td className="py-3 px-2 text-sm">{formattedDate}</td>
                                <td className="py-3 px-2 text-sm">{txn.desc}</td>
                                <td className="py-3 px-2 text-sm font-bold">
                                  {txn.amount}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      );
                    })()
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {user?.transactions && user?.transactions.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, user?.transactions.length)} to{" "}
                  {Math.min(currentPage * itemsPerPage, user?.transactions.length)} of {user?.transactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(user?.transactions.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(user?.transactions.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(user?.transactions.length / itemsPerPage)}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory;
