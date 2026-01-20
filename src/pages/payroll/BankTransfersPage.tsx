import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { CreditCard, FileText, CheckCircle } from "lucide-react";
import { payrollService } from "../../services/payroll.service";
import { getStatusColor } from "../../utils/status";
import type { BankTransfer } from "../../types";

export function BankTransfersPage() {
  const [bankTransfers, setBankTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const transfersData = await payrollService.getBankTransfers();
        setBankTransfers(transfersData);
      } catch (error) {
        console.error("Error loading bank transfers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Bank Transfers
            </CardTitle>
            <Button className="gradient-primary text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Transfers
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transfer Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.bank}</TableCell>
                  <TableCell>{transfer.employees}</TableCell>
                  <TableCell>{transfer.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(transfer.status)}>
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      {transfer.status === 'pending' && (
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
