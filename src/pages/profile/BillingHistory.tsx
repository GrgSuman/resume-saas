import { CreditCard, ChevronLeft, ChevronRight, Plus, TrendingUp, Calendar } from "lucide-react";
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
      {/* Credits Overview Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-[#7060fc]" />
            Credits & Billing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Balance Banner */}
          <div className="bg-gradient-to-r from-[#7060fc] to-[#6050e5] rounded-xl p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/90">Current Balance</p>
                <p className="text-3xl font-bold">{user?.credits || 0} Credits</p>
                <p className="text-sm text-white/80">Available for resume creation and AI features</p>
              </div>
              <Link to="/dashboard/credits">
                <Button className="bg-white text-[#7060fc] hover:bg-slate-100 font-semibold shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy More Credits
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-[#7060fc]" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
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
                        {currentTransactions.map((txn: Transaction, index: number) => {
                          const date = new Date(txn.createdAt);
                          const formattedDate = date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });

                          return (
                            <tr key={txn.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                              <td className="py-4 px-4 text-sm text-slate-600">
                                {formattedDate}
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-900 font-medium">
                                {txn.desc}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                  txn.amount > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {txn.amount > 0 ? '+' : ''}{txn.amount} Credits
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    );
                  })()
                ) : (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">No transactions yet</p>
                          <p className="text-sm text-slate-500">Your transaction history will appear here</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {user?.transactions && user?.transactions.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, user?.transactions.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, user?.transactions.length)} of {user?.transactions.length} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 border-slate-300 text-slate-700 hover:border-[#7060fc] hover:text-[#7060fc]"
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
                      className={`w-8 h-8 p-0 ${
                        currentPage === page 
                          ? 'bg-[#7060fc] text-white' 
                          : 'border-slate-300 text-slate-700 hover:border-[#7060fc] hover:text-[#7060fc]'
                      }`}
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
                  className="flex items-center gap-1 border-slate-300 text-slate-700 hover:border-[#7060fc] hover:text-[#7060fc]"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory;
