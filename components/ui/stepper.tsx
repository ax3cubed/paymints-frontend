"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { motion } from "motion/react"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    id: string
    label: string
    description?: string
  }[]
  activeStep: number
  orientation?: "horizontal" | "vertical"
}

export function Stepper({ steps, activeStep, orientation = "horizontal", className, ...props }: StepperProps) {
  return (
    <div className={cn("flex", orientation === "vertical" ? "flex-col space-y-4" : "space-x-4", className)} {...props}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep
        const isCurrent = index === activeStep

        return (
          <div
            key={step.id}
            className={cn(
              "flex",
              orientation === "vertical" ? "flex-row items-start" : "flex-col items-center",
              orientation === "horizontal" && "flex-1",
            )}
          >
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  opacity: isCurrent || isCompleted ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  index + 1
                )}
              </motion.div>
              {index < steps.length - 1 && orientation === "horizontal" && (
                <div className="relative mx-2 h-0.5 flex-1">
                  <div className={cn("absolute inset-0 bg-muted-foreground/30")} />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary"
                  />
                </div>
              )}
            </div>
            <div
              className={cn(
                "mt-2",
                orientation === "vertical" && "ml-4",
                orientation === "horizontal" && "text-center",
              )}
            >
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{
                  opacity: 1,
                  fontWeight: isCurrent ? 600 : 400,
                }}
                transition={{ duration: 0.3 }}
                className={cn("text-sm", isCurrent ? "text-foreground" : "text-muted-foreground")}
              >
                {step.label}
              </motion.div>
              {step.description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isCurrent ? 1 : 0.7 }}
                  className="text-xs text-muted-foreground"
                >
                  {step.description}
                </motion.div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
