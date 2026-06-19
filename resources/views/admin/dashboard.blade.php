@extends('admin.master')

@section('title', 'eCommerce Dashboard')

@section('header', 'Dashboard Overview')

@section('content')
    <!-- eCommerce Stats Row -->
    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="stat-card border-0 shadow-sm rounded-3 bg-white p-4 d-flex align-items-center position-relative overflow-hidden h-100">
                <div class="flex-grow-1 z-1">
                    <small class="text-muted d-block mb-1 text-uppercase fw-semibold" style="letter-spacing: 0.5px;">Total Sales</small>
                    <h3 class="fw-bold mb-0 text-dark">${{ number_format($totalSales, 2) }}</h3>
                    <small class="{{ $salesChangePercentage >= 0 ? 'text-success' : 'text-danger' }} fw-medium mt-2 d-inline-block">
                        <i class="bi {{ $salesChangePercentage >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right' }} me-1"></i>
                        {{ $salesChangePercentage >= 0 ? '+' : '' }}{{ number_format($salesChangePercentage, 1) }}% from last month
                    </small>
                </div>
                <div class="position-absolute end-0 bottom-0 mb-3 me-3 opacity-25 z-0" style="font-size: 4rem;">
                    <i class="bi bi-currency-dollar text-success"></i>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card border-0 shadow-sm rounded-3 bg-white p-4 d-flex align-items-center position-relative overflow-hidden h-100">
                <div class="flex-grow-1 z-1">
                    <small class="text-muted d-block mb-1 text-uppercase fw-semibold" style="letter-spacing: 0.5px;">Total Orders</small>
                    <h3 class="fw-bold mb-0 text-dark">{{ number_format($totalOrders) }}</h3>
                    <small class="{{ $ordersChangePercentage >= 0 ? 'text-success' : 'text-danger' }} fw-medium mt-2 d-inline-block">
                        <i class="bi {{ $ordersChangePercentage >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right' }} me-1"></i>
                        {{ $ordersChangePercentage >= 0 ? '+' : '' }}{{ number_format($ordersChangePercentage, 1) }}% from last month
                    </small>
                </div>
                <div class="position-absolute end-0 bottom-0 mb-3 me-3 opacity-25 z-0" style="font-size: 4rem;">
                    <i class="bi bi-bag-check text-primary"></i>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card border-0 shadow-sm rounded-3 bg-white p-4 d-flex align-items-center position-relative overflow-hidden h-100">
                <div class="flex-grow-1 z-1">
                    <small class="text-muted d-block mb-1 text-uppercase fw-semibold" style="letter-spacing: 0.5px;">Total Customers</small>
                    <h3 class="fw-bold mb-0 text-dark">{{ number_format($totalCustomers) }}</h3>
                    <small class="{{ $customersChangePercentage >= 0 ? 'text-success' : 'text-danger' }} fw-medium mt-2 d-inline-block">
                        <i class="bi {{ $customersChangePercentage >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right' }} me-1"></i>
                        {{ $customersChangePercentage >= 0 ? '+' : '' }}{{ number_format($customersChangePercentage, 1) }}% from last month
                    </small>
                </div>
                <div class="position-absolute end-0 bottom-0 mb-3 me-3 opacity-25 z-0" style="font-size: 4rem;">
                    <i class="bi bi-people text-warning"></i>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card border-0 shadow-sm rounded-3 bg-white p-4 d-flex align-items-center position-relative overflow-hidden h-100">
                <div class="flex-grow-1 z-1">
                    <small class="text-muted d-block mb-1 text-uppercase fw-semibold" style="letter-spacing: 0.5px;">Conversion Rate</small>
                    <h3 class="fw-bold mb-0 text-dark">{{ number_format($conversionRate, 1) }}%</h3>
                    <small class="text-success fw-medium mt-2 d-inline-block"><i class="bi bi-arrow-up-right me-1"></i>+0.4% from last month</small>
                </div>
                <div class="position-absolute end-0 bottom-0 mb-3 me-3 opacity-25 z-0" style="font-size: 4rem;">
                    <i class="bi bi-graph-up-arrow text-info"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- eCommerce Charts Row -->
    <div class="row g-4 mb-4">
        <!-- Revenue Trend Chart -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm h-100 rounded-3">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0 fw-bold">Sales Analytics</h5>
                        <small class="text-muted">Revenue & Order Volume (Last 6 Months)</small>
                    </div>
                    <button id="downloadReportBtn" class="btn btn-sm btn-outline-secondary"><i class="bi bi-download me-1"></i>Download Report</button>
                </div>
                <div class="card-body p-4">
                    <canvas id="salesChart" style="height: 320px; width: 100%;"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Sales by Category Doughnut Chart -->
        <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100 rounded-3">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0 fw-bold">Sales by Category</h5>
                    <small class="text-muted">Top performing product categories</small>
                </div>
                <div class="card-body p-4 d-flex justify-content-center align-items-center">
                    <canvas id="categoryChart" style="max-height: 280px;"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!-- Data Tables Row -->
    <div class="row g-4 mb-4">
        <!-- Recent Orders -->
        <div class="col-lg-7">
            <div class="card border-0 shadow-sm h-100 rounded-3">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                    <h5 class="mb-0 fw-bold">Recent Orders</h5>
                    <a href="{{ route('admin.dealer-orders.index') }}" class="btn btn-sm btn-light">View All</a>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small text-uppercase">
                            <tr>
                                <th class="ps-4 py-3">Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th class="text-end pe-4">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                                @forelse($recentOrders as $order)
                                    <tr>
                                        <td class="ps-4 fw-bold text-primary">{{ $order['id'] }}</td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px; font-size: 12px; font-weight: bold;">
                                                    {{ strtoupper(substr($order['customer_name'], 0, 2)) }}
                                                </div>
                                                <div>
                                                    <div class="fw-bold text-dark">{{ $order['customer_name'] }}</div>
                                                    <small class="text-muted">{{ $order['customer_email'] }} <span class="badge bg-light text-secondary ms-1">{{ $order['type'] }}</span></small>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-secondary small">{{ $order['date']->format('M d, Y h:i A') }}</td>
                                        <td class="fw-semibold">${{ number_format($order['total'], 2) }}</td>
                                        <td class="text-end pe-4">
                                            <span class="badge {{ $order['status_class'] }} rounded-pill px-3 py-2">{{ $order['status'] }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="text-center py-4 text-muted">No orders found yet.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Products -->
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm h-100 rounded-3">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                    <h5 class="mb-0 fw-bold">Top Selling Products</h5>
                    <a href="{{ route('admin.products.index') }}" class="btn btn-sm btn-light">View Inventory</a>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light text-muted small text-uppercase">
                            <tr>
                                <th class="ps-4 py-3">Product</th>
                                <th>Price</th>
                                <th class="text-end pe-4">Sold</th>
                            </tr>
                            </thead>
                            <tbody>
                                @forelse($topProducts as $prod)
                                    <tr>
                                        <td class="ps-4 py-3">
                                            <div class="d-flex align-items-center">
                                                <div class="bg-light rounded p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; overflow: hidden;">
                                                    @if(!empty($prod['featured_image']))
                                                        <img src="{{ asset('storage/' . $prod['featured_image']) }}" alt="{{ $prod['name'] }}" style="width: 100%; height: 100%; object-fit: cover;" class="rounded" />
                                                    @else
                                                        <i class="bi bi-box fs-4 text-primary"></i>
                                                    @endif
                                                </div>
                                                <div>
                                                    <div class="fw-bold text-dark">{{ $prod['name'] }}</div>
                                                    <small class="text-muted">{{ $prod['category'] }}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="fw-semibold">${{ number_format($prod['price'], 2) }}</td>
                                        <td class="text-end pe-4">
                                            <span class="fw-bold text-success">{{ $prod['sold'] }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="text-center py-4 text-muted">No products listed.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Chart.js Library and Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Sales Chart (Line & Bar Combo)
            const ctxSales = document.getElementById('salesChart').getContext('2d');
            
            // Create gradient for line chart
            let gradientSales = ctxSales.createLinearGradient(0, 0, 0, 400);
            gradientSales.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // Emerald
            gradientSales.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

            new Chart(ctxSales, {
                type: 'bar', // Base type
                data: {
                    labels: @json($months),
                    datasets: [
                        {
                            type: 'line',
                            label: 'Revenue ($)',
                            data: @json($monthlyRevenue),
                            borderColor: '#10b981', // Emerald 500
                            backgroundColor: gradientSales,
                            borderWidth: 3,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#10b981',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            type: 'bar',
                            label: 'Orders',
                            data: @json($monthlyOrders),
                            backgroundColor: '#3b82f6', // Blue 500
                            borderRadius: 4,
                            barPercentage: 0.5,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: { 
                            position: 'top',
                            labels: { usePointStyle: true, boxWidth: 8 }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            padding: 12,
                            titleFont: { size: 13, family: "'Inter', sans-serif" },
                            bodyFont: { size: 14, family: "'Inter', sans-serif" },
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { color: '#6b7280' }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: '#f3f4f6', drawBorder: false },
                            ticks: { color: '#6b7280', callback: function(value) { return '$' + value; } }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false }, // only want the grid lines for one axis to show up
                            ticks: { color: '#6b7280', precision: 0 }
                        }
                    }
                }
            });

            // Sales by Category Doughnut Chart
            const ctxCategory = document.getElementById('categoryChart').getContext('2d');
            new Chart(ctxCategory, {
                type: 'doughnut',
                data: {
                    labels: @json($categoriesLabels),
                    datasets: [{
                        data: @json($categoriesData),
                        backgroundColor: [
                            '#3b82f6', // Blue
                            '#8b5cf6', // Violet
                            '#ec4899', // Pink
                            '#f59e0b', // Amber
                            '#10b981', // Emerald
                            '#6b7280'  // Gray
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ' ' + context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });

            // Download Report functionality
            document.getElementById('downloadReportBtn').addEventListener('click', function() {
                const months = @json($months);
                const revenue = @json($monthlyRevenue);
                const orders = @json($monthlyOrders);
                
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Month,Revenue ($),Orders\n";
                
                months.forEach((month, index) => {
                    csvContent += `${month},${revenue[index]},${orders[index]}\n`;
                });
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `sales_report_${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
    </script>
@endsection
