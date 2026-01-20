import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Plus, DollarSign } from "lucide-react";
import { loanService } from "../../services/loan.service";
import { getStatusColor } from "../../utils/status";
import type { LoanRequest } from "../../types";

export function LoansPage() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoanRequestOpen, setIsLoanRequestOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loansData = await loanService.getLoanRequests();
        setLoanRequests(loansData);
      } catch (error) {
        console.error("Error loading loan requests:", error);
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
              <DollarSign className="h-5 w-5 text-primary" />
              Loans & Salary Advances
            </CardTitle>
            <Dialog open={isLoanRequestOpen} onOpenChange={setIsLoanRequestOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Loan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Loan Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-type">Loan Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="emergency">Emergency Loan</SelectItem>
                        <SelectItem value="advance">Salary Advance</SelectItem>
                        <SelectItem value="housing">Housing Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Requested Amount</Label>
                    <Input id="loan-amount" placeholder="SAR 0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-purpose">Purpose</Label>
                    <Textarea id="loan-purpose" placeholder="Explain the purpose of this loan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-installments">Preferred Installments</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installment period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsLoanRequestOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="gradient-primary text-white">
                      Submit Request
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Installments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loanRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.type}</TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.installments} months</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
