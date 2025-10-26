# Analytics Dashboard Examples

Real-world examples of filtering for analytics and reporting.

## User Analytics

### User Activity Dashboard

```typescript
import { useFilter, useDebouncedFilter } from '@mcabreradev/filter/react';

interface UserActivity {
  userId: number;
  userName: string;
  lastActive: Date;
  sessionsCount: number;
  pageViews: number;
  avgSessionDuration: number;
  country: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
}

const UserActivityDashboard = ({ activities }: { activities: UserActivity[] }) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [minSessions, setMinSessions] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const baseExpression = useMemo(() => {
    const conditions = [];

    conditions.push({
      $and: [
        { lastActive: { $gte: dateRange[0] } },
        { lastActive: { $lte: dateRange[1] } }
      ]
    });

    if (minSessions > 0) {
      conditions.push({ sessionsCount: { $gte: minSessions } });
    }

    if (selectedCountries.length > 0) {
      conditions.push({ country: { $in: selectedCountries } });
    }

    if (selectedDevices.length > 0) {
      conditions.push({ device: { $in: selectedDevices } });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [dateRange, minSessions, selectedCountries, selectedDevices]);

  const { filtered: baseFiltered } = useFilter(activities, baseExpression, {
    memoize: true
  });

  const searchExpression = useMemo(() => ({
    userName: { $regex: new RegExp(searchTerm, 'i') }
  }), [searchTerm]);

  const { filtered, isPending } = useDebouncedFilter(
    baseFiltered,
    searchTerm ? searchExpression : {},
    { delay: 300 }
  );

  const stats = useMemo(() => ({
    totalUsers: filtered.length,
    totalSessions: filtered.reduce((sum, a) => sum + a.sessionsCount, 0),
    totalPageViews: filtered.reduce((sum, a) => sum + a.pageViews, 0),
    avgSessionDuration: filtered.length > 0
      ? filtered.reduce((sum, a) => sum + a.avgSessionDuration, 0) / filtered.length
      : 0
  }), [filtered]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Users" value={stats.totalUsers} />
        <MetricCard title="Total Sessions" value={stats.totalSessions} />
        <MetricCard title="Page Views" value={stats.totalPageViews} />
        <MetricCard
          title="Avg Session Duration"
          value={`${Math.round(stats.avgSessionDuration)}s`}
        />
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        {isPending && <Spinner size="sm" />}

        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <input
          type="number"
          value={minSessions}
          onChange={(e) => setMinSessions(Number(e.target.value))}
          placeholder="Minimum sessions"
        />

        <CountryMultiSelect
          selected={selectedCountries}
          onChange={setSelectedCountries}
        />

        <DeviceMultiSelect
          selected={selectedDevices}
          onChange={setSelectedDevices}
        />
      </div>

      <UserActivityTable activities={filtered} />
    </div>
  );
};
```

## Sales Analytics

### Sales Performance Dashboard

```typescript
interface SaleRecord {
  id: number;
  date: Date;
  amount: number;
  product: string;
  category: string;
  region: string;
  salesPerson: string;
  status: 'completed' | 'pending' | 'refunded';
}

const SalesAnalyticsDashboard = ({ sales }: { sales: SaleRecord[] }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState(0);
  const [status, setStatus] = useState<string>('');

  const expression = useMemo(() => {
    const conditions = [];

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    conditions.push({ date: { $gte: startDate } });

    if (selectedCategories.length > 0) {
      conditions.push({ category: { $in: selectedCategories } });
    }

    if (selectedRegions.length > 0) {
      conditions.push({ region: { $in: selectedRegions } });
    }

    if (minAmount > 0) {
      conditions.push({ amount: { $gte: minAmount } });
    }

    if (status) {
      conditions.push({ status: { $eq: status } });
    }

    return { $and: conditions };
  }, [period, selectedCategories, selectedRegions, minAmount, status]);

  const { filtered } = useFilter(sales, expression, {
    memoize: true
  });

  const analytics = useMemo(() => {
    const totalRevenue = filtered.reduce((sum, s) => sum + s.amount, 0);
    const avgOrderValue = filtered.length > 0 ? totalRevenue / filtered.length : 0;

    const categoryBreakdown = filtered.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.amount;
      return acc;
    }, {} as Record<string, number>);

    const regionBreakdown = filtered.reduce((acc, s) => {
      acc[s.region] = (acc[s.region] || 0) + s.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSales: filtered.length,
      totalRevenue,
      avgOrderValue,
      categoryBreakdown,
      regionBreakdown
    };
  }, [filtered]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Sales"
          value={analytics.totalSales}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${analytics.avgOrderValue.toFixed(2)}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartCard title="Revenue by Category">
          <BarChart data={analytics.categoryBreakdown} />
        </ChartCard>
        <ChartCard title="Revenue by Region">
          <PieChart data={analytics.regionBreakdown} />
        </ChartCard>
      </div>

      <div className="mb-6 space-y-4">
        <PeriodSelector value={period} onChange={setPeriod} />

        <CategoryMultiSelect
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />

        <RegionMultiSelect
          selected={selectedRegions}
          onChange={setSelectedRegions}
        />

        <input
          type="number"
          value={minAmount}
          onChange={(e) => setMinAmount(Number(e.target.value))}
          placeholder="Minimum amount"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <SalesTable sales={filtered} />
    </div>
  );
};
```

## Event Analytics

### Event Tracking Dashboard

```typescript
interface Event {
  id: number;
  name: string;
  category: string;
  timestamp: Date;
  userId: number;
  properties: Record<string, any>;
  duration?: number;
  value?: number;
}

const EventAnalyticsDashboard = ({ events }: { events: Event[] }) => {
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [minDuration, setMinDuration] = useState(0);
  const [hasValue, setHasValue] = useState(false);

  const expression = useMemo(() => {
    const conditions = [];

    if (eventName) {
      conditions.push({
        name: { $regex: new RegExp(eventName, 'i') }
      });
    }

    if (category) {
      conditions.push({ category: { $eq: category } });
    }

    conditions.push({
      $and: [
        { timestamp: { $gte: dateRange[0] } },
        { timestamp: { $lte: dateRange[1] } }
      ]
    });

    if (minDuration > 0) {
      conditions.push({
        duration: { $gte: minDuration }
      });
    }

    if (hasValue) {
      conditions.push({
        value: { $ne: null }
      });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [eventName, category, dateRange, minDuration, hasValue]);

  const { filtered } = useDebouncedFilter(events, expression, {
    delay: 300,
    memoize: true
  });

  const metrics = useMemo(() => {
    const totalEvents = filtered.length;
    const uniqueUsers = new Set(filtered.map(e => e.userId)).size;
    const avgDuration = filtered.filter(e => e.duration).length > 0
      ? filtered.reduce((sum, e) => sum + (e.duration || 0), 0) /
        filtered.filter(e => e.duration).length
      : 0;
    const totalValue = filtered.reduce((sum, e) => sum + (e.value || 0), 0);

    const eventsByCategory = filtered.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(
      filtered.reduce((acc, e) => {
        acc[e.name] = (acc[e.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return {
      totalEvents,
      uniqueUsers,
      avgDuration,
      totalValue,
      eventsByCategory,
      topEvents
    };
  }, [filtered]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Events" value={metrics.totalEvents} />
        <MetricCard title="Unique Users" value={metrics.uniqueUsers} />
        <MetricCard
          title="Avg Duration"
          value={`${metrics.avgDuration.toFixed(2)}s`}
        />
        <MetricCard
          title="Total Value"
          value={`$${metrics.totalValue.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartCard title="Events by Category">
          <DonutChart data={metrics.eventsByCategory} />
        </ChartCard>
        <ChartCard title="Top 10 Events">
          <HorizontalBarChart data={Object.fromEntries(metrics.topEvents)} />
        </ChartCard>
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Search events..."
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="user_action">User Action</option>
          <option value="system">System</option>
          <option value="error">Error</option>
        </select>

        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <input
          type="number"
          value={minDuration}
          onChange={(e) => setMinDuration(Number(e.target.value))}
          placeholder="Minimum duration (seconds)"
        />

        <label>
          <input
            type="checkbox"
            checked={hasValue}
            onChange={(e) => setHasValue(e.target.checked)}
          />
          Has monetary value
        </label>
      </div>

      <EventTable events={filtered} />
    </div>
  );
};
```

## Funnel Analysis

### Conversion Funnel

```typescript
interface FunnelStep {
  userId: number;
  step: 'landing' | 'signup' | 'activation' | 'purchase';
  timestamp: Date;
  metadata: Record<string, any>;
}

const ConversionFunnel = ({ steps }: { steps: FunnelStep[] }) => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [source, setSource] = useState('');

  const expression = useMemo(() => ({
    $and: [
      { timestamp: { $gte: dateRange[0] } },
      { timestamp: { $lte: dateRange[1] } },
      source && { 'metadata.source': { $eq: source } }
    ].filter(Boolean)
  }), [dateRange, source]);

  const { filtered } = useFilter(steps, expression, {
    memoize: true
  });

  const funnelData = useMemo(() => {
    const usersByStep = {
      landing: new Set<number>(),
      signup: new Set<number>(),
      activation: new Set<number>(),
      purchase: new Set<number>()
    };

    filtered.forEach(step => {
      usersByStep[step.step].add(step.userId);
    });

    const counts = {
      landing: usersByStep.landing.size,
      signup: usersByStep.signup.size,
      activation: usersByStep.activation.size,
      purchase: usersByStep.purchase.size
    };

    const conversionRates = {
      signupRate: counts.landing > 0
        ? (counts.signup / counts.landing) * 100
        : 0,
      activationRate: counts.signup > 0
        ? (counts.activation / counts.signup) * 100
        : 0,
      purchaseRate: counts.activation > 0
        ? (counts.purchase / counts.activation) * 100
        : 0,
      overallRate: counts.landing > 0
        ? (counts.purchase / counts.landing) * 100
        : 0
    };

    return { counts, conversionRates };
  }, [filtered]);

  return (
    <div>
      <div className="mb-6 space-y-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All Sources</option>
          <option value="organic">Organic</option>
          <option value="paid">Paid</option>
          <option value="referral">Referral</option>
        </select>
      </div>

      <div className="space-y-4">
        <FunnelStepCard
          title="Landing Page"
          count={funnelData.counts.landing}
          percentage={100}
        />
        <FunnelStepCard
          title="Sign Up"
          count={funnelData.counts.signup}
          percentage={funnelData.conversionRates.signupRate}
        />
        <FunnelStepCard
          title="Activation"
          count={funnelData.counts.activation}
          percentage={funnelData.conversionRates.activationRate}
        />
        <FunnelStepCard
          title="Purchase"
          count={funnelData.counts.purchase}
          percentage={funnelData.conversionRates.purchaseRate}
        />
      </div>

      <div className="mt-6">
        <MetricCard
          title="Overall Conversion Rate"
          value={`${funnelData.conversionRates.overallRate.toFixed(2)}%`}
          size="large"
        />
      </div>
    </div>
  );
};
```

## Performance Monitoring

### Performance Metrics Dashboard

```typescript
interface PerformanceMetric {
  id: number;
  timestamp: Date;
  page: string;
  metric: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB';
  value: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  connection: '4g' | '3g' | 'slow-2g' | 'wifi';
}

const PerformanceMonitoring = ({ metrics }: { metrics: PerformanceMetric[] }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);

  const expression = useMemo(() => {
    const conditions = [];

    conditions.push({
      $and: [
        { timestamp: { $gte: dateRange[0] } },
        { timestamp: { $lte: dateRange[1] } }
      ]
    });

    if (selectedMetric) {
      conditions.push({ metric: { $eq: selectedMetric } });
    }

    if (selectedPage) {
      conditions.push({ page: { $eq: selectedPage } });
    }

    if (deviceType) {
      conditions.push({ deviceType: { $eq: deviceType } });
    }

    return { $and: conditions };
  }, [selectedMetric, selectedPage, deviceType, dateRange]);

  const { filtered } = useFilter(metrics, expression, {
    memoize: true
  });

  const stats = useMemo(() => {
    const avgByMetric = filtered.reduce((acc, m) => {
      if (!acc[m.metric]) {
        acc[m.metric] = { sum: 0, count: 0 };
      }
      acc[m.metric].sum += m.value;
      acc[m.metric].count += 1;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    return Object.entries(avgByMetric).reduce((acc, [metric, data]) => {
      acc[metric] = data.sum / data.count;
      return acc;
    }, {} as Record<string, number>);
  }, [filtered]);

  return (
    <div>
      <div className="grid grid-cols-5 gap-4 mb-6">
        <MetricCard title="FCP" value={`${stats.FCP?.toFixed(0) || 0}ms`} />
        <MetricCard title="LCP" value={`${stats.LCP?.toFixed(0) || 0}ms`} />
        <MetricCard title="FID" value={`${stats.FID?.toFixed(0) || 0}ms`} />
        <MetricCard title="CLS" value={stats.CLS?.toFixed(3) || 0} />
        <MetricCard title="TTFB" value={`${stats.TTFB?.toFixed(0) || 0}ms`} />
      </div>

      <div className="mb-6 space-y-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          <option value="">All Metrics</option>
          <option value="FCP">First Contentful Paint</option>
          <option value="LCP">Largest Contentful Paint</option>
          <option value="FID">First Input Delay</option>
          <option value="CLS">Cumulative Layout Shift</option>
          <option value="TTFB">Time to First Byte</option>
        </select>

        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
        >
          <option value="">All Pages</option>
          <option value="/">Home</option>
          <option value="/products">Products</option>
          <option value="/checkout">Checkout</option>
        </select>

        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        >
          <option value="">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
      </div>

      <PerformanceChart data={filtered} />
    </div>
  );
};
```

## Related Resources

- [E-Commerce Examples](/examples/ecommerce)
- [Basic Usage Examples](/examples/basic-usage)
- [Best Practices](/guide/best-practices)
- [React Integration](/frameworks/react)

