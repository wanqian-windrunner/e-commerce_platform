import { collectDefaultMetrics, Counter, Histogram, Registry } from "@prometheus-io/client";

export const metricsRegistry = new Registry()

// 基础运行环境健康监控
collectDefaultMetrics({
    register: metricsRegistry,
    prefix: "backend_",
})

// 请求总次数计数器
export const httpRequestsTotal = new Counter({
    name: "backend_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [metricsRegistry]
})

// 请求耗时分档统计
export const httpRequestDuration = new Histogram({
    name: "backend_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [metricsRegistry]
})