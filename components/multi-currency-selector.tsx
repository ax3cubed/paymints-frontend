"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Currency = {
  value: string
  label: string
  icon?: string
}

const currencies: Currency[] = [
  {
    value: "usdc",
    label: "USDC",
    icon: "/placeholder.svg?height=20&width=20",
  },
  {
    value: "sol",
    label: "SOL",
    icon: "/placeholder.svg?height=20&width=20",
  },
  {
    value: "usdt",
    label: "USDT",
    icon: "/placeholder.svg?height=20&width=20",
  },
  {
    value: "eth",
    label: "ETH",
    icon: "/placeholder.svg?height=20&width=20",
  },
  {
    value: "btc",
    label: "BTC",
    icon: "/placeholder.svg?height=20&width=20",
  },
]

interface MultiCurrencySelectorProps {
  value?: string
  onChange: (value: string) => void
}

export function MultiCurrencySelector({ value, onChange }: MultiCurrencySelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedCurrency = React.useMemo(() => currencies.find((currency) => currency.value === value), [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCurrency ? (
            <div className="flex items-center">
              {selectedCurrency.icon && (
                <img
                  src={selectedCurrency.icon || "/placeholder.svg"}
                  alt={selectedCurrency.label}
                  className="mr-2 h-5 w-5"
                />
              )}
              {selectedCurrency.label}
            </div>
          ) : (
            "Select currency"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    {currency.icon && (
                      <img src={currency.icon || "/placeholder.svg"} alt={currency.label} className="mr-2 h-5 w-5" />
                    )}
                    {currency.label}
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === currency.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
