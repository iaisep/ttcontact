
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const BatchCallGuide = () => {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Batch Call Guide</CardTitle>
        <CardDescription>
          How to set up batch calls with your AI agents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">1</span>
            Prepare your contacts file
          </h4>
          <p className="text-sm text-muted-foreground pl-7">
            Create a CSV or JSON file with phone numbers and optional variables for personalization.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">2</span>
            Select your AI agent
          </h4>
          <p className="text-sm text-muted-foreground pl-7">
            Choose which agent will handle all calls in this batch.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">3</span>
            Start your batch
          </h4>
          <p className="text-sm text-muted-foreground pl-7">
            Launch the batch and monitor progress in real-time.
          </p>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-2">Example CSV Format:</h4>
          <pre className="bg-muted p-2 rounded text-xs">
{`phone,name,variables
+14155552671,John Smith,{"company":"Acme Inc"}
+16505557812,Jane Doe,{"appointment":"3pm"}
+12125558901,Alex Wong,{"order_id":"ORD-12345"}`}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Example JSON Format:</h4>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
{`[
  {
    "phone": "+14155552671",
    "name": "John Smith",
    "variables": {
      "company": "Acme Inc"
    }
  },
  {
    "phone": "+16505557812",
    "name": "Jane Doe",
    "variables": {
      "appointment": "3pm"
    }
  }
]`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchCallGuide;
