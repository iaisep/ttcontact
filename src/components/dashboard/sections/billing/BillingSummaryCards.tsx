
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UsageData } from './types';
import { formatCurrency } from './utils/BillingUtils';

interface BillingSummaryCardsProps {
  usage: UsageData | null;
}

const BillingSummaryCards = ({ usage }: BillingSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Factura actual</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(usage?.total_cost ?? 0)}</div>
          <p className="text-xs text-muted-foreground">{usage?.current_period}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minutos de voz</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usage?.voice_minutes?.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)} a $0.075 por minuto
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próxima factura</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1 de mayo, 2025</div>
          <p className="text-xs text-muted-foreground">Estimado: {formatCurrency(usage?.total_cost ? usage.total_cost + 40 : 0)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSummaryCards;
