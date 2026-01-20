import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, CreditCard, Car, Download, Plus } from "lucide-react";

export function DocumentsPage() {
  return (
    <div className="space-y-4">
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Salary Definition Letter</h3>
                    <p className="text-sm text-muted-foreground">Official salary certificate for bank/visa applications</p>
                    <Button size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Request Letter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-10 w-10 text-green-600" />
                  <div>
                    <h3 className="font-medium">Employee ID Card</h3>
                    <p className="text-sm text-muted-foreground">Request new or replacement ID card</p>
                    <Button size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Request ID Card
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-10 w-10 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Experience Certificate</h3>
                    <p className="text-sm text-muted-foreground">Employment experience and service certificate</p>
                    <Button size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Request Certificate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Car className="h-10 w-10 text-orange-600" />
                  <div>
                    <h3 className="font-medium">Parking Permit</h3>
                    <p className="text-sm text-muted-foreground">Request parking access permit</p>
                    <Button size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Permit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
