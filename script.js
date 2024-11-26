document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mortgageForm');
    const clearBtn = document.getElementById('clearAll');
    const radioLabels = document.querySelectorAll('.radio-label');
    
    // Handle radio button styling
    radioLabels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      radio.addEventListener('change', () => {
        radioLabels.forEach(l => l.classList.remove('active'));
        if (radio.checked) {
          label.classList.add('active');
        }
      });
    });
  
    // Clear form and results
    clearBtn.addEventListener('click', () => {
      form.reset();
      updateResults(null);
      clearErrors();
      // Reset radio button styling
      radioLabels[0].classList.add('active');
      radioLabels[1].classList.remove('active');
    });
  
    // Calculate mortgage
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
  
      const amount = Number(document.getElementById('amount').value);
      const term = Number(document.getElementById('term').value);
      const rate = Number(document.getElementById('rate').value);
      const type = document.querySelector('input[name="type"]:checked').value;
  
      if (validate({ amount, term, rate })) {
        const results = calculateMortgage({ amount, term, rate, type });
        updateResults(results);
      }
    });
  
    function validate(data) {
      let isValid = true;
  
      if (!data.amount || data.amount <= 0) {
        showError('amount', 'Please enter a valid amount');
        isValid = false;
      }
  
      if (!data.term || data.term <= 0) {
        showError('term', 'Please enter a valid term');
        isValid = false;
      }
  
      if (!data.rate || data.rate <= 0) {
        showError('rate', 'Please enter a valid rate');
        isValid = false;
      }
  
      return isValid;
    }
  
    function showError(field, message) {
      const errorElement = document.getElementById(`${field}Error`);
      errorElement.textContent = message;
      document.getElementById(field).classList.add('error');
    }
  
    function clearErrors() {
      ['amount', 'term', 'rate'].forEach(field => {
        document.getElementById(`${field}Error`).textContent = '';
        document.getElementById(field).classList.remove('error');
      });
    }
  
    function calculateMortgage(data) {
      const monthlyRate = data.rate / 100 / 12;
      const numberOfPayments = data.term * 12;
  
      let monthlyPayment, totalRepayment;
  
      if (data.type === 'repayment') {
        // Formula: P * (r(1+r)^n)/((1+r)^n-1)
        monthlyPayment =
          data.amount *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        totalRepayment = monthlyPayment * numberOfPayments;
      } else {
        // Interest only
        monthlyPayment = data.amount * monthlyRate;
        totalRepayment = monthlyPayment * numberOfPayments + data.amount;
      }
  
      return { monthlyPayment, totalRepayment };
    }
  
    function updateResults(results) {
      const monthlyElement = document.querySelector('.monthly-amount');
      const totalElement = document.querySelector('.total-amount');
  
      if (results) {
        monthlyElement.textContent = `R${results.monthlyPayment.toFixed(2)}`;
        totalElement.textContent = `R${results.totalRepayment.toFixed(2)}`;
      } else {
        monthlyElement.textContent = 'R0.00';
        totalElement.textContent = 'R0.00';
      }
    }
  });