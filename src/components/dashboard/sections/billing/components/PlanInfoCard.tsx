
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PlanInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Plan</CardTitle>
        <CardDescription>Plan Pro</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Minutos de voz ilimitados</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Hasta 20 llamadas paralelas</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Soporte prioritario</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Analíticas avanzadas</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Actualizar Plan</Button>
      </CardFooter>
    </Card>
  );
};

export default PlanInfoCard;
