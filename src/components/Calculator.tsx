import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "*":
        return firstValue * secondValue;
      case "/":
        return firstValue / secondValue;
      case "%":
        return firstValue % secondValue;
      case "^":
        return Math.pow(firstValue, secondValue);
      case "//":
        return Math.floor(firstValue / secondValue);
      default:
        return secondValue;
    }
  };

  const calculateSquareRoot = () => {
    const inputValue = parseFloat(display);
    const result = Math.sqrt(inputValue);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key >= "0" && key <= "9") {
        inputDigit(key);
      } else if (key === ".") {
        inputDecimal();
      } else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "%" || key === "^") {
        performOperation(key);
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleEquals();
      } else if (key === "Escape" || key === "c" || key === "C") {
        clear();
      } else if (key === "Backspace") {
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      } else if (key === "r" || key === "R") {
        calculateSquareRoot();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const buttonClass = "h-16 text-xl font-semibold transition-all active:scale-95";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="rounded-2xl bg-card p-6 shadow-2xl" style={{ boxShadow: "var(--shadow-glow)" }}>
          {/* Display */}
          <div className="mb-6 rounded-xl bg-[hsl(var(--calc-display))] p-6 text-right">
            <div className="mb-1 min-h-[1.5rem] text-sm text-muted-foreground">
              {previousValue !== null && operation ? `${previousValue} ${operation}` : "\u00A0"}
            </div>
            <div className="min-h-[3rem] break-words text-4xl font-bold text-foreground">
              {display}
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* First Row: C, √, %, // */}
            <Button
              onClick={clear}
              className={`${buttonClass} bg-[hsl(var(--calc-clear))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--calc-clear))]/90`}
            >
              C
            </Button>
            <Button
              onClick={calculateSquareRoot}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              √
            </Button>
            <Button
              onClick={() => performOperation("%")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              %
            </Button>
            <Button
              onClick={() => performOperation("//")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              //
            </Button>

            {/* Second Row: ÷, ×, ^, - */}
            <Button
              onClick={() => performOperation("/")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              ÷
            </Button>
            <Button
              onClick={() => performOperation("*")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              ×
            </Button>
            <Button
              onClick={() => performOperation("^")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              ^
            </Button>
            <Button
              onClick={() => performOperation("-")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              −
            </Button>

            {/* Third Row: 7, 8, 9, + */}
            {[7, 8, 9].map((num) => (
              <Button
                key={num}
                onClick={() => inputDigit(String(num))}
                className={`${buttonClass} bg-[hsl(var(--calc-number))] text-foreground hover:bg-[hsl(var(--calc-number))]/80`}
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => performOperation("+")}
              className={`${buttonClass} bg-[hsl(var(--calc-operator))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--calc-operator))]/90`}
            >
              +
            </Button>

            {/* Fourth Row: 4, 5, 6 and = (spans 2 rows) */}
            {[4, 5, 6].map((num) => (
              <Button
                key={num}
                onClick={() => inputDigit(String(num))}
                className={`${buttonClass} bg-[hsl(var(--calc-number))] text-foreground hover:bg-[hsl(var(--calc-number))]/80`}
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={handleEquals}
              className={`${buttonClass} row-span-2 bg-[hsl(var(--calc-equal))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--calc-equal))]/90`}
            >
              =
            </Button>

            {/* Fifth Row: 1, 2, 3 */}
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                onClick={() => inputDigit(String(num))}
                className={`${buttonClass} bg-[hsl(var(--calc-number))] text-foreground hover:bg-[hsl(var(--calc-number))]/80`}
              >
                {num}
              </Button>
            ))}

            {/* Sixth Row: 0 (span 2), . */}
            <Button
              onClick={() => inputDigit("0")}
              className={`${buttonClass} col-span-2 bg-[hsl(var(--calc-number))] text-foreground hover:bg-[hsl(var(--calc-number))]/80`}
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className={`${buttonClass} bg-[hsl(var(--calc-number))] text-foreground hover:bg-[hsl(var(--calc-number))]/80`}
            >
              .
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Usa el teclado para una experiencia más rápida</p>
          <p className="mt-1 text-xs">ESC: limpiar • Enter: calcular • R: raíz cuadrada</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
