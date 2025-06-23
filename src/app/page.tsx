"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";
import getStripe from "@/lib/getStripe";

interface Plan {
  name: string;
  priceMonthly: number | string;
  priceYearly?: number;
  savings?: number;
  description: string;
  features: string[];
  isMostPopular: boolean;
}

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);

  const plans: Plan[] = [
    {
      name: "Basic",
      priceMonthly: 10,
      priceYearly: 100,
      savings: 20,
      description: "Essential features you need to get started",
      features: [
        "Example Feature Number 1",
        "Example Feature Number 2",
        "Example Feature Number 3",
      ],
      isMostPopular: false,
    },
    {
      name: "Pro",
      priceMonthly: 25,
      priceYearly: 250,
      savings: 50,
      description: "Perfect for owners of small & medium businesses",
      features: [
        "Example Feature Number 1",
        "Example Feature Number 2",
        "Example Feature Number 3",
      ],
      isMostPopular: true,
    },
    {
      name: "Enterprise",
      priceMonthly: "Custom",
      description: "Dedicated support and infrastructure to fit your needs",
      features: [
        "Example Feature Number 1",
        "Example Feature Number 2",
        "Example Feature Number 3",
        "Super Exclusive Feature",
      ],
      isMostPopular: false,
    },
  ];

  const handleCheckout = async (plan: Plan) => {
    if (plan.name === "Enterprise") {
      // Handle enterprise contact form or redirect
      console.log("Contact sales for Enterprise plan");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, isYearly }),
      });

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error("Could not create checkout session");
      }

      const stripe = await getStripe();
      if (stripe) {
        stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Pricing Plans</h1>
            <p className="text-xl pt-1 text-muted-foreground">
              Choose the plan that&apos;s right for you
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <Tabs
              defaultValue="monthly"
              className="bg-muted rounded-lg p-1 border"
              onValueChange={(value) => setIsYearly(value === "yearly")}
            >
              <TabsList className="w-48 bg-transparent border-none grid grid-cols-2">
                <TabsTrigger
                  value="monthly"
                  className={cn(
                    "px-4 py-1 rounded-md border-none font-semibold",
                    !isYearly
                      ? "bg-background text-foreground dark:bg-black dark:text-white"
                      : "bg-transparent text-muted-foreground"
                  )}
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className={cn(
                    "px-4 py-1 rounded-md border-none font-semibold",
                    isYearly
                      ? "bg-background text-foreground dark:bg-black dark:text-white"
                      : "bg-transparent text-muted-foreground"
                  )}
                >
                  Yearly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-center">
            <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "bg-card rounded-xl shadow-lg flex flex-col relative overflow-hidden border p-2",
                    plan.isMostPopular && "border-2 border-blue-500",
                    plan.name === "Enterprise" &&
                      "enterprise-card-background border-border",
                    plan.name === "Basic" && "border-border"
                  )}
                >
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-card-foreground">
                        {plan.name}
                      </CardTitle>
                      {isYearly && plan.savings && (
                        <div
                          className={cn(
                            "px-3 py-1 text-sm rounded-full font-semibold",
                            plan.isMostPopular
                              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                              : "bg-secondary text-secondary-foreground"
                          )}
                        >
                          Save ${plan.savings}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      {plan.name === "Enterprise" ? (
                        <p className="text-4xl font-bold text-card-foreground">
                          Custom
                        </p>
                      ) : (
                        <p className="text-4xl font-bold text-card-foreground">
                          ${isYearly ? plan.priceYearly : plan.priceMonthly}
                          <span className="text-base font-normal text-muted-foreground">
                            /{isYearly ? "year" : "month"}
                          </span>
                        </p>
                      )}
                    </div>
                    <CardDescription className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 flex-grow">
                    <ul className="space-y-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <svg
                            className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29l-3.58-3.59L7.15 11l2.14 2.14 5.57-5.57L16.3 9.01l-7.01 7.28z"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-3 mt-auto">
                    <Button
                      onClick={() => handleCheckout(plan)}
                      className={cn(
                        "w-full rounded-lg py-1 text-sm font-semibold transition-colors",
                        plan.isMostPopular
                          ? "bg-white text-black hover:bg-gray-200 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                          : "border bg-transparent text-black hover:bg-accent dark:text-muted-foreground"
                      )}
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
