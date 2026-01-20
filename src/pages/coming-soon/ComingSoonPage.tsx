import { Card, CardContent } from "../../components/ui/card";
import { Construction } from "lucide-react";

export function ComingSoonPage({ title }: { title?: string }) {
  return (
    <div className="space-y-4">
      <Card className="glass-card border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Construction className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            {title || "Coming Soon"}
          </h2>
          <p className="text-muted-foreground">
            This page is under development and will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
