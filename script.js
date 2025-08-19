class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.waitingForOperand = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.waitingForOperand) {
            this.currentOperand = number;
            this.waitingForOperand = false;
        } else {
            if (this.currentOperand === '0') {
                this.currentOperand = number;
            } else {
                this.currentOperand += number;
            }
        }
    }

    appendDecimal() {
        if (this.waitingForOperand) {
            this.currentOperand = '0.';
            this.waitingForOperand = false;
            return;
        }
        
        if (this.currentOperand.includes('.')) return;
        
        this.currentOperand += '.';
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.waitingForOperand = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.waitingForOperand = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForOperand = true;
    }

    formatNumber(number) {
        // Handle very large or very small numbers
        if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0)) {
            return number.toExponential(6);
        }
        
        // Round to avoid floating point precision issues
        const roundedNumber = Math.round(number * 100000000) / 100000000;
        
        // Convert to string and remove unnecessary trailing zeros
        let stringNumber = roundedNumber.toString();
        
        if (stringNumber.includes('.')) {
            stringNumber = stringNumber.replace(/\.?0+$/, '');
        }
        
        return stringNumber;
    }

    updateDisplay() {
        this.currentOperandTextElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandTextElement.textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.textContent = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const decimalButton = document.querySelector('[data-decimal]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

// Create calculator instance
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

decimalButton.addEventListener('click', () => {
    calculator.appendDecimal();
    calculator.updateDisplay();
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendDecimal();
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation;
        switch (e.key) {
            case '+': operation = '+'; break;
            case '-': operation = '−'; break;
            case '*': operation = '×'; break;
            case '/': operation = '÷'; break;
        }
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
});

// Prevent default behavior for calculator keys
document.addEventListener('keydown', (e) => {
    if (['+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace', '.'].includes(e.key)) {
        e.preventDefault();
    }
});