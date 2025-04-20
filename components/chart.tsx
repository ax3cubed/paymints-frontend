"use client"

import type * as React from "react"
import {
  AreaChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Area,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import type { AxisDomain } from "recharts/types/util/types"

import { cn } from "@/lib/utils"

const chartConfig = {
  xAxis: {
    axisLine: false,
    tickLine: false,
    style: {
      fontSize: "12px",
      fontFamily: "inherit",
      color: "hsl(var(--muted-foreground))",
    },
  },
  yAxis: {
    axisLine: false,
    tickLine: false,
    style: {
      fontSize: "12px",
      fontFamily: "inherit",
      color: "hsl(var(--muted-foreground))",
    },
  },
  grid: {
    style: {
      stroke: "hsl(var(--border))",
      strokeDasharray: "0",
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: "inherit",
      backgroundColor: "hsl(var(--background))",
      borderColor: "hsl(var(--border))",
      color: "hsl(var(--foreground))",
      borderRadius: "6px",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
  },
  legend: {
    style: {
      fontSize: "12px",
      fontFamily: "inherit",
      color: "hsl(var(--foreground))",
    },
  },
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  startEndOnly?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showGridLines?: boolean
  yAxisWidth?: number
  minValue?: number
  maxValue?: number
  autoMinValue?: boolean
  stack?: boolean
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value: number) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showGridLines = true,
  yAxisWidth = 56,
  minValue,
  maxValue,
  autoMinValue = false,
  className,
  ...props
}: ChartProps) {
  const yAxisDomain: AxisDomain = [autoMinValue ? "auto" : (minValue ?? 0), maxValue ?? "auto"]

  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{index}</span>
              <span className="font-bold tabular-nums">{label}</span>
            </div>
            {payload.map((category: any, i: number) => (
              <div key={i} className="flex flex-col">
                <span
                  className="text-[0.70rem] uppercase text-muted-foreground"
                  style={{
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    color: category.color,
                  }}
                >
                  {valueFormatter(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cn("h-80 w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
          }}
        >
          {showGridLines && (
            <CartesianGrid strokeDasharray="3 3" style={chartConfig.grid.style} horizontal={true} vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              axisLine={chartConfig.xAxis.axisLine}
              tickLine={chartConfig.xAxis.tickLine}
              tick={{
                fontSize: chartConfig.xAxis.style.fontSize,
                fontFamily: chartConfig.xAxis.style.fontFamily,
                fill: chartConfig.xAxis.style.color,
              }}
              tickMargin={8}
              tickFormatter={(value) => {
                if (startEndOnly) {
                  const isFirst = data.findIndex((item) => item[index] === value) === 0
                  const isLast = data.findIndex((item) => item[index] === value) === data.length - 1

                  return isFirst || isLast ? value : ""
                }
                return value
              }}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              axisLine={chartConfig.yAxis.axisLine}
              tickLine={chartConfig.yAxis.tickLine}
              tick={{
                fontSize: chartConfig.yAxis.style.fontSize,
                fontFamily: chartConfig.yAxis.style.fontFamily,
                fill: chartConfig.yAxis.style.color,
              }}
              tickMargin={8}
              tickFormatter={(value) => valueFormatter(value)}
              domain={yAxisDomain}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={40}
              content={({ payload }) => {
                if (!payload || !payload.length) {
                  return null
                }

                return (
                  <div className="flex items-center justify-center gap-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          )}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value: number) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showGridLines = true,
  yAxisWidth = 56,
  minValue,
  maxValue,
  autoMinValue = false,
  stack = false,
  className,
  ...props
}: ChartProps) {
  const yAxisDomain: AxisDomain = [autoMinValue ? "auto" : (minValue ?? 0), maxValue ?? "auto"]

  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{index}</span>
              <span className="font-bold tabular-nums">{label}</span>
            </div>
            {payload.map((category: any, i: number) => (
              <div key={i} className="flex flex-col">
                <span
                  className="text-[0.70rem] uppercase text-muted-foreground"
                  style={{
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    color: category.color,
                  }}
                >
                  {valueFormatter(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cn("h-80 w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
          }}
        >
          {showGridLines && (
            <CartesianGrid strokeDasharray="3 3" style={chartConfig.grid.style} horizontal={true} vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              axisLine={chartConfig.xAxis.axisLine}
              tickLine={chartConfig.xAxis.tickLine}
              tick={{
                fontSize: chartConfig.xAxis.style.fontSize,
                fontFamily: chartConfig.xAxis.style.fontFamily,
                fill: chartConfig.xAxis.style.color,
              }}
              tickMargin={8}
              tickFormatter={(value) => {
                if (startEndOnly) {
                  const isFirst = data.findIndex((item) => item[index] === value) === 0
                  const isLast = data.findIndex((item) => item[index] === value) === data.length - 1

                  return isFirst || isLast ? value : ""
                }
                return value
              }}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              axisLine={chartConfig.yAxis.axisLine}
              tickLine={chartConfig.yAxis.tickLine}
              tick={{
                fontSize: chartConfig.yAxis.style.fontSize,
                fontFamily: chartConfig.yAxis.style.fontFamily,
                fill: chartConfig.yAxis.style.color,
              }}
              tickMargin={8}
              tickFormatter={(value) => valueFormatter(value)}
              domain={yAxisDomain}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={40}
              content={({ payload }) => {
                if (!payload || !payload.length) {
                  return null
                }

                return (
                  <div className="flex items-center justify-center gap-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          )}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              stackId={stack ? "stack" : undefined}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CustomAreaChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value: number) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showTooltip = true,
  showGridLines = true,
  yAxisWidth = 56,
  minValue,
  maxValue,
  autoMinValue = false,
  stack = false,
  className,
  ...props
}: ChartProps) {
  const yAxisDomain: AxisDomain = [autoMinValue ? "auto" : (minValue ?? 0), maxValue ?? "auto"]

  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{index}</span>
              <span className="font-bold tabular-nums">{label}</span>
            </div>
            {payload.map((category: any, i: number) => (
              <div key={i} className="flex flex-col">
                <span
                  className="text-[0.70rem] uppercase text-muted-foreground"
                  style={{
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    color: category.color,
                  }}
                >
                  {valueFormatter(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cn("h-80 w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
          }}
        >
          {showGridLines && (
            <CartesianGrid strokeDasharray="3 3" style={chartConfig.grid.style} horizontal={true} vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              axisLine={chartConfig.xAxis.axisLine}
              tickLine={chartConfig.xAxis.tickLine}
              tick={{
                fontSize: chartConfig.xAxis.style.fontSize,
                fontFamily: chartConfig.xAxis.style.fontFamily,
                fill: chartConfig.xAxis.style.color,
              }}
              tickMargin={8}
              tickFormatter={(value) => {
                if (startEndOnly) {
                  const isFirst = data.findIndex((item) => item[index] === value) === 0
                  const isLast = data.findIndex((item) => item[index] === value) === data.length - 1

                  return isFirst || isLast ? value : ""
                }
                return value
              }}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              axisLine={chartConfig.yAxis.axisLine}
              tickLine={chartConfig.yAxis.tickLine}
              tick={{
                fontSize: chartConfig.yAxis.style.fontSize,
                fontFamily: chartConfig.yAxis.style.fontFamily,
                fill: chartConfig.yAxis.style.color,
              }}
              tickMargin={8}
              tickFormatter={(value) => valueFormatter(value)}
              domain={yAxisDomain}
            />
          )}
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={40}
              content={({ payload }) => {
                if (!payload || !payload.length) {
                  return null
                }

                return (
                  <div className="flex items-center justify-center gap-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          )}
          {categories.map((category, i) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              fill={colors[i % colors.length]}
              stroke={colors[i % colors.length]}
              fillOpacity={0.1}
              strokeWidth={2}
              stackId={stack ? "stack" : undefined}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  index: string
  category: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  showTooltip?: boolean
  showLegend?: boolean
}

export function PieChart({
  data,
  index,
  category,
  colors = [
    "hsl(var(--primary))",
    "hsl(var(--primary) / 0.8)",
    "hsl(var(--primary) / 0.6)",
    "hsl(var(--primary) / 0.4)",
    "hsl(var(--primary) / 0.2)",
  ],
  valueFormatter = (value: number) => value.toString(),
  showTooltip = true,
  showLegend = true,
  className,
  ...props
}: PieChartProps) {
  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{data[index]}</span>
            <span className="font-bold tabular-nums">{valueFormatter(data[category])}</span>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cn("h-80 w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
          }}
        >
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          {showLegend && (
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry, i) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
          <Pie
            data={data}
            nameKey={index}
            dataKey={category}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={1}
            strokeWidth={2}
            stroke="hsl(var(--background))"
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (value: number) => value.toString(),
  className,
  ...props
}: TooltipProps<any, any> & {
  valueFormatter?: (value: number) => string
} & React.HTMLAttributes<HTMLDivElement>) {
  if (active && payload && payload.length) {
    return (
      <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props}>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          </div>
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex flex-col">
              <span
                className="text-[0.70rem] uppercase text-muted-foreground"
                style={{
                  color: item.color,
                }}
              >
                {item.name}
              </span>
              <span
                className="font-bold tabular-nums"
                style={{
                  color: item.color,
                }}
              >
                {valueFormatter(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
