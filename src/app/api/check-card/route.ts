import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { number, name, expiryMonth, expiryYear, cvc } = await req.json();

  // Basic Luhn algorithm for card number validation
  function isValidCardNumber(number: string) {
    let sum = 0;
    let isEven = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(number.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 == 0;
  }

  // Determine card type based on starting digits
  function getCardType(number: string) {
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "American Express";
    if (/^6(?:011|5)/.test(number)) return "Discover";
    return "Unknown";
  }

  const isValid = isValidCardNumber(number);
  const type = getCardType(number);

  // Additional validation
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expiryDate = new Date(
    Number.parseInt(expiryYear),
    Number.parseInt(expiryMonth) - 1
  );
  const isExpiryValid = expiryDate > currentDate;

  const isCvcValid = /^\d{3,4}$/.test(cvc);

  const overallValid = isValid && isExpiryValid && isCvcValid;

  try {
    await prisma.card.create({
      data: {
        number,
        name,
        expiryMonth: Number.parseInt(expiryMonth),
        expiryYear: Number.parseInt(expiryYear),
        cvc,
        isValid: overallValid,
        type,
      },
    });
  } catch (error) {
    console.error("Error saving to database:", error);
  }

  return NextResponse.json({ isValid: overallValid, type });
}
