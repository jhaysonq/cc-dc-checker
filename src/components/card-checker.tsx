"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CardChecker() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });
  const [result, setResult] = useState<{
    isValid: boolean;
    type: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCardData({ ...cardData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/check-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error checking card:", error);
      setResult({ isValid: false, type: "Error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Check Card</CardTitle>
        <CardDescription>
          Enter credit/debit card details to validate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Card Number</Label>
            <Input
              id="number"
              name="number"
              type="text"
              value={cardData.number}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={cardData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Select
                name="expiryMonth"
                onValueChange={(value) =>
                  handleSelectChange("expiryMonth", value)
                }
              >
                <SelectTrigger id="expiryMonth">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Select
                name="expiryYear"
                onValueChange={(value) =>
                  handleSelectChange("expiryYear", value)
                }
              >
                <SelectTrigger id="expiryYear">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              name="cvc"
              type="text"
              value={cardData.cvc}
              onChange={handleChange}
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Checking..." : "Check Card"}
          </Button>
        </form>
      </CardContent>
      {result && (
        <CardFooter>
          <div
            className={`text-lg ${
              result.isValid ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.isValid ? "Valid" : "Invalid"} {result.type} card
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
