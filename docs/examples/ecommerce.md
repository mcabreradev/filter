# E-Commerce Filtering Examples

Real-world examples of filtering in e-commerce applications.

## Product Catalog Filtering

### Basic Product Filter

```typescript
import { useFilter } from '@mcabreradev/filter/react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  inStock: boolean;
  rating: number;
  tags: string[];
}

const ProductCatalog = ({ products }: { products: Product[] }) => {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    category: '',
    inStock: false,
    minRating: 0
  });

  const expression = useMemo(() => ({
    $and: [
      { price: { $gte: filters.minPrice } },
      { price: { $lte: filters.maxPrice } },
      filters.category && { category: { $eq: filters.category } },
      filters.inStock && { inStock: { $eq: true } },
      filters.minRating > 0 && { rating: { $gte: filters.minRating } }
    ].filter(Boolean)
  }), [filters]);

  const { filtered, isFiltering } = useFilter(products, expression, {
    memoize: true
  });

  return (
    <div>
      <FilterPanel filters={filters} onChange={setFilters} />
      {isFiltering ? (
        <Spinner />
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
};
```

### Advanced Multi-Filter

```typescript
const AdvancedProductFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const expression = useMemo(() => {
    const conditions = [];

    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      conditions.push({
        $and: [
          { price: { $gte: priceRange[0] } },
          { price: { $lte: priceRange[1] } }
        ]
      });
    }

    if (selectedCategories.length > 0) {
      conditions.push({
        category: { $in: selectedCategories }
      });
    }

    if (selectedBrands.length > 0) {
      conditions.push({
        brand: { $in: selectedBrands }
      });
    }

    if (selectedTags.length > 0) {
      conditions.push({
        $or: selectedTags.map(tag => ({
          tags: { $contains: tag }
        }))
      });
    }

    if (onlyInStock) {
      conditions.push({ inStock: { $eq: true } });
    }

    if (minRating > 0) {
      conditions.push({ rating: { $gte: minRating } });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [priceRange, selectedCategories, selectedBrands, selectedTags, onlyInStock, minRating]);

  const { filtered } = usePaginatedFilter(products, expression, 24, {
    memoize: true
  });

  return (
    <div className="flex">
      <aside className="w-64">
        <PriceRangeSlider value={priceRange} onChange={setPriceRange} />
        <CategoryCheckboxes
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
        <BrandCheckboxes
          selected={selectedBrands}
          onChange={setSelectedBrands}
        />
        <TagCheckboxes
          selected={selectedTags}
          onChange={setSelectedTags}
        />
        <StockToggle checked={onlyInStock} onChange={setOnlyInStock} />
        <RatingFilter value={minRating} onChange={setMinRating} />
      </aside>

      <main className="flex-1">
        <ProductGrid products={filtered} />
      </main>
    </div>
  );
};
```

## Search with Filters

### Product Search

```typescript
const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('name');

  const expression = useMemo(() => {
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        $or: [
          { name: { $regex: new RegExp(searchTerm, 'i') } },
          { description: { $regex: new RegExp(searchTerm, 'i') } },
          { tags: { $contains: searchTerm.toLowerCase() } }
        ]
      });
    }

    if (category) {
      conditions.push({ category: { $eq: category } });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [searchTerm, category]);

  const { filtered, isPending } = useDebouncedFilter(products, expression, {
    delay: 300,
    memoize: true
  });

  const sortedProducts = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
  }, [filtered, sortBy]);

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="flex-1"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {isPending && <Spinner />}

      <div className="text-sm text-gray-600 mb-4">
        {sortedProducts.length} products found
      </div>

      <ProductGrid products={sortedProducts} />
    </div>
  );
};
```

## Order Management

### Order Filtering

```typescript
interface Order {
  id: number;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  items: OrderItem[];
}

const OrderManagement = ({ orders }: { orders: Order[] }) => {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [minTotal, setMinTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const expression = useMemo(() => {
    const conditions = [];

    if (statusFilter.length > 0) {
      conditions.push({
        status: { $in: statusFilter }
      });
    }

    if (dateRange) {
      conditions.push({
        $and: [
          { createdAt: { $gte: dateRange[0] } },
          { createdAt: { $lte: dateRange[1] } }
        ]
      });
    }

    if (minTotal > 0) {
      conditions.push({
        total: { $gte: minTotal }
      });
    }

    if (searchTerm) {
      conditions.push({
        $or: [
          { customerName: { $regex: new RegExp(searchTerm, 'i') } },
          { id: { $eq: Number(searchTerm) || -1 } }
        ]
      });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [statusFilter, dateRange, minTotal, searchTerm]);

  const {
    filtered,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage
  } = usePaginatedFilter(orders, expression, 20, {
    memoize: true
  });

  return (
    <div>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name or order ID..."
        />

        <StatusFilter
          selected={statusFilter}
          onChange={setStatusFilter}
        />

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />

        <input
          type="number"
          value={minTotal}
          onChange={(e) => setMinTotal(Number(e.target.value))}
          placeholder="Minimum order total"
        />
      </div>

      <OrderTable orders={filtered} />

      <Pagination
        current={currentPage}
        total={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
        onGoTo={goToPage}
      />
    </div>
  );
};
```

## Inventory Management

### Stock Filtering

```typescript
interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  category: string;
  supplier: string;
  lastRestocked: Date;
}

const InventoryDashboard = ({ inventory }: { inventory: InventoryItem[] }) => {
  const [view, setView] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');

  const expression = useMemo(() => {
    const conditions = [];

    if (view === 'low-stock') {
      conditions.push({
        $and: [
          { quantity: { $gt: 0 } },
          { quantity: { $lte: 'reorderLevel' } }
        ]
      });
    } else if (view === 'out-of-stock') {
      conditions.push({
        quantity: { $eq: 0 }
      });
    }

    if (category) {
      conditions.push({ category: { $eq: category } });
    }

    if (supplier) {
      conditions.push({ supplier: { $eq: supplier } });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [view, category, supplier]);

  const { filtered } = useFilter(inventory, expression, {
    memoize: true
  });

  const stats = useMemo(() => ({
    total: inventory.length,
    lowStock: inventory.filter(item =>
      item.quantity > 0 && item.quantity <= item.reorderLevel
    ).length,
    outOfStock: inventory.filter(item => item.quantity === 0).length
  }), [inventory]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Items"
          value={stats.total}
          onClick={() => setView('all')}
          active={view === 'all'}
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          onClick={() => setView('low-stock')}
          active={view === 'low-stock'}
          variant="warning"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          onClick={() => setView('out-of-stock')}
          active={view === 'out-of-stock'}
          variant="danger"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>

        <select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
          <option value="">All Suppliers</option>
          <option value="supplier-a">Supplier A</option>
          <option value="supplier-b">Supplier B</option>
        </select>
      </div>

      <InventoryTable items={filtered} />
    </div>
  );
};
```

## Customer Management

### Customer Segmentation

```typescript
interface Customer {
  id: number;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: Date;
  segment: 'vip' | 'regular' | 'new' | 'inactive';
  tags: string[];
}

const CustomerSegmentation = ({ customers }: { customers: Customer[] }) => {
  const [segment, setSegment] = useState<string>('');
  const [minSpent, setMinSpent] = useState(0);
  const [minOrders, setMinOrders] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);

  const expression = useMemo(() => {
    const conditions = [];

    if (segment) {
      conditions.push({ segment: { $eq: segment } });
    }

    if (minSpent > 0) {
      conditions.push({ totalSpent: { $gte: minSpent } });
    }

    if (minOrders > 0) {
      conditions.push({ orderCount: { $gte: minOrders } });
    }

    if (inactiveDays > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
      conditions.push({
        lastOrderDate: { $lt: cutoffDate }
      });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [segment, minSpent, minOrders, inactiveDays]);

  const { filtered } = useFilter(customers, expression, {
    memoize: true
  });

  const segmentStats = useMemo(() => ({
    vip: customers.filter(c => c.segment === 'vip').length,
    regular: customers.filter(c => c.segment === 'regular').length,
    new: customers.filter(c => c.segment === 'new').length,
    inactive: customers.filter(c => c.segment === 'inactive').length
  }), [customers]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SegmentCard
          title="VIP"
          count={segmentStats.vip}
          onClick={() => setSegment('vip')}
          active={segment === 'vip'}
        />
        <SegmentCard
          title="Regular"
          count={segmentStats.regular}
          onClick={() => setSegment('regular')}
          active={segment === 'regular'}
        />
        <SegmentCard
          title="New"
          count={segmentStats.new}
          onClick={() => setSegment('new')}
          active={segment === 'new'}
        />
        <SegmentCard
          title="Inactive"
          count={segmentStats.inactive}
          onClick={() => setSegment('inactive')}
          active={segment === 'inactive'}
        />
      </div>

      <div className="space-y-4 mb-6">
        <input
          type="number"
          value={minSpent}
          onChange={(e) => setMinSpent(Number(e.target.value))}
          placeholder="Minimum total spent"
        />
        <input
          type="number"
          value={minOrders}
          onChange={(e) => setMinOrders(Number(e.target.value))}
          placeholder="Minimum order count"
        />
        <input
          type="number"
          value={inactiveDays}
          onChange={(e) => setInactiveDays(Number(e.target.value))}
          placeholder="Inactive for (days)"
        />
      </div>

      <CustomerTable customers={filtered} />
    </div>
  );
};
```

## Related Resources

- [Basic Usage Examples](/examples/basic-usage)
- [Analytics Examples](/examples/analytics)
- [Best Practices](/guide/best-practices)
- [React Integration](/frameworks/react)

