import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Plus, Users } from "lucide-react";
import { loanService } from "../../services/loan.service";
import type { Dependent } from "../../types";

export function DependentsPage() {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDependentOpen, setIsAddDependentOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dependentsData = await loanService.getDependents();
        setDependents(dependentsData);
      } catch (error) {
        console.error("Error loading dependents:", error);
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
              <Users className="h-5 w-5 text-primary" />
              Dependents & Insurance
            </CardTitle>
            <Dialog open={isAddDependentOpen} onOpenChange={setIsAddDependentOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependent
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Dependent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dep-name">Full Name</Label>
                    <Input id="dep-name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dep-relationship">Relationship</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="son">Son</SelectItem>
                        <SelectItem value="daughter">Daughter</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dep-birth">Birth Date</Label>
                    <Input id="dep-birth" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dep-id">ID Number</Label>
                    <Input id="dep-id" placeholder="Enter ID number" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dep-insurance" />
                    <Label htmlFor="dep-insurance">Include in medical insurance</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDependentOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="gradient-primary text-white">
                      Add Dependent
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
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dependents.map((dependent) => (
                <TableRow key={dependent.id}>
                  <TableCell className="font-medium">{dependent.name}</TableCell>
                  <TableCell>{dependent.relationship}</TableCell>
                  <TableCell>{dependent.birthDate}</TableCell>
                  <TableCell>{dependent.idNumber}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={dependent.insurance ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {dependent.insurance ? 'Covered' : 'Not Covered'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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
