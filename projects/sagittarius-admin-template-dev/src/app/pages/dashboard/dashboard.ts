import { Component, computed } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DEMO_ORDERS, DEMO_USERS, DemoOrder, MONTHLY_REVENUE } from '../../core/demo-data';

const ORDER_STATUS: Record<DemoOrder['status'], { label: string; badge: string }> = {
  paid: { label: 'Zaplatená', badge: 'sg-badge-success' },
  pending: { label: 'Čaká na platbu', badge: 'sg-badge-warning' },
  cancelled: { label: 'Stornovaná', badge: 'sg-badge-danger' },
};

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  protected readonly stats = [
    { label: 'Tržby (september)', value: '207 tis. €', icon: 'payments', delta: '+13,1 %', up: true },
    { label: 'Nové objednávky', value: '412', icon: 'shopping_cart', delta: '+8,4 %', up: true },
    { label: 'Aktívni používatelia', value: String(DEMO_USERS.filter(u => u.status === 'active').length), icon: 'group', delta: '+2', up: true },
    { label: 'Otvorené tikety', value: '17', icon: 'support_agent', delta: '−3,2 %', up: false },
  ];

  protected readonly orders = DEMO_ORDERS;
  protected readonly orderStatus: Record<string, { label: string; badge: string }> = ORDER_STATUS;
  protected readonly columns = ['id', 'customer', 'date', 'status', 'total'];

  // Stĺpcový graf – jedna séria, hodnoty v tis. €
  protected readonly revenue = MONTHLY_REVENUE;
  protected readonly chart = computed(() => {
    const step = 50;
    const max = Math.ceil(Math.max(...this.revenue.map(r => r.value)) / step) * step;
    const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);
    return {
      ticks,
      max,
      bars: this.revenue.map(r => ({ ...r, pct: (r.value / max) * 100 })),
    };
  });

  protected readonly activity = [
    { icon: 'person_add', text: 'Zuzana Vargová pozvala nového používateľa', time: 'pred 12 min' },
    { icon: 'receipt_long', text: 'Objednávka OBJ-2026-0412 bola zaplatená', time: 'pred 38 min' },
    { icon: 'edit', text: 'Peter Kováč upravil nastavenia fakturácie', time: 'pred 2 h' },
    { icon: 'block', text: 'Účet eva.hudecova bol zablokovaný', time: 'včera' },
    { icon: 'cloud_upload', text: 'Import cenníka dokončený (1 284 položiek)', time: 'včera' },
  ];
}
