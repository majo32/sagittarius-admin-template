export type UserStatus = 'active' | 'invited' | 'blocked';
export type UserRole = 'Administrátor' | 'Editor' | 'Čitateľ';

export interface DemoUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  lastLogin: string;
  createdAt: string;
}

export interface DemoOrder {
  id: string;
  customer: string;
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
  date: string;
}

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Aktívny',
  invited: 'Pozvaný',
  blocked: 'Zablokovaný',
};

export const STATUS_BADGE: Record<UserStatus, string> = {
  active: 'sg-badge-success',
  invited: 'sg-badge-info',
  blocked: 'sg-badge-danger',
};

const FIRST = ['Ján', 'Mária', 'Peter', 'Zuzana', 'Martin', 'Katarína', 'Tomáš', 'Lucia', 'Michal', 'Eva', 'Juraj', 'Andrea', 'Lukáš', 'Veronika', 'Marek', 'Simona'];
const LAST = ['Novák', 'Horváthová', 'Kováč', 'Vargová', 'Tóth', 'Baláž', 'Molnár', 'Szabová', 'Lukáč', 'Hudecová', 'Kráľ', 'Polák', 'Šimko', 'Urbanová', 'Blaho', 'Čierna'];
const DEPARTMENTS = ['Obchod', 'Financie', 'IT', 'Marketing', 'Zákaznícka podpora'];
const ROLES: UserRole[] = ['Administrátor', 'Editor', 'Čitateľ', 'Čitateľ', 'Editor'];
const STATUSES: UserStatus[] = ['active', 'active', 'active', 'invited', 'blocked'];

function ascii(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export const DEMO_USERS: DemoUser[] = Array.from({ length: 48 }, (_, i) => {
  const firstName = FIRST[i % FIRST.length]!;
  const lastName = LAST[(i * 7) % LAST.length]!;
  const day = ((i * 5) % 27) + 1;
  return {
    id: 1000 + i,
    firstName,
    lastName,
    email: `${ascii(firstName)}.${ascii(lastName)}${i}@example.com`,
    phone: `+421 9${(10 + i) % 100} ${String(100 + i * 13).slice(-3)} ${String(200 + i * 29).slice(-3)}`,
    role: ROLES[i % ROLES.length]!,
    status: STATUSES[(i * 3) % STATUSES.length]!,
    department: DEPARTMENTS[i % DEPARTMENTS.length]!,
    lastLogin: `2026-09-${String(day).padStart(2, '0')}T${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`,
    createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
});

export const DEMO_ORDERS: DemoOrder[] = [
  { id: 'OBJ-2026-0412', customer: 'Tatra Logistics s.r.o.', total: 12480, status: 'paid', date: '2026-09-20' },
  { id: 'OBJ-2026-0411', customer: 'Kovo Trenčín a.s.', total: 3920.5, status: 'pending', date: '2026-09-20' },
  { id: 'OBJ-2026-0410', customer: 'Danubia Foods', total: 845, status: 'paid', date: '2026-09-19' },
  { id: 'OBJ-2026-0409', customer: 'Mesto Žilina', total: 27300, status: 'pending', date: '2026-09-18' },
  { id: 'OBJ-2026-0408', customer: 'Nitra Agro družstvo', total: 1560, status: 'cancelled', date: '2026-09-18' },
  { id: 'OBJ-2026-0407', customer: 'Poprad Hotels', total: 6210, status: 'paid', date: '2026-09-17' },
];

export const MONTHLY_REVENUE: { month: string; value: number }[] = [
  { month: 'Okt', value: 142 }, { month: 'Nov', value: 158 }, { month: 'Dec', value: 196 },
  { month: 'Jan', value: 121 }, { month: 'Feb', value: 134 }, { month: 'Mar', value: 162 },
  { month: 'Apr', value: 171 }, { month: 'Máj', value: 168 }, { month: 'Jún', value: 189 },
  { month: 'Júl', value: 176 }, { month: 'Aug', value: 183 }, { month: 'Sep', value: 207 },
];
