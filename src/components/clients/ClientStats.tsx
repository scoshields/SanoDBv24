import React from 'react';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import type { Client } from '../../types/client';

interface ClientStatsProps {
  clients: Client[];
}

export function ClientStats({ clients }: ClientStatsProps) {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  const newClientsThisMonth = clients.filter(c => {
    const startDate = new Date(c.therapy_start_date || c.created_at);
    const now = new Date();
    return startDate.getMonth() === now.getMonth() && 
           startDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      name: 'Total Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      name: 'Active Clients',
      value: activeClients,
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      name: 'Inactive Clients',
      value: inactiveClients,
      icon: UserX,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      name: 'New This Month',
      value: newClientsThisMonth,
      icon: Calendar,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 flex items-center gap-4"
          >
            <div className={`${stat.bg} rounded-lg p-3`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}