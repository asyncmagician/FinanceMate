exports.calculatePrevisionnel = (startingBalance, expenses) => {
  let fixedTotal = 0;
  let variableTotal = 0;
  let reimbursementsReceived = 0;
  let reimbursementsPending = 0;
  
  expenses.forEach(expense => {
    const amount = parseFloat(expense.amount);
    
    if (expense.category_type === 'fixed') {
      fixedTotal += amount;
    } else if (expense.category_type === 'variable') {
      variableTotal += amount;
    } else if (expense.category_type === 'reimbursement') {
      if (expense.is_received) {
        reimbursementsReceived += amount;
      } else {
        reimbursementsPending += amount;
      }
    }
  });
  
  const totalExpenses = fixedTotal + variableTotal;
  const previsionnel = parseFloat(startingBalance) - totalExpenses + reimbursementsReceived;
  
  return {
    fixed_total: fixedTotal,
    variable_total: variableTotal,
    total_expenses: totalExpenses,
    reimbursements_received: reimbursementsReceived,
    reimbursements_pending: reimbursementsPending,
    previsionnel: previsionnel,
    previsionnel_with_pending: previsionnel + reimbursementsPending
  };
};

exports.calculateMonthlyRecurring = (recurringExpenses, year, month) => {
  const monthDate = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  
  return recurringExpenses
    .filter(expense => {
      const startDate = new Date(expense.start_date);
      const endDate = expense.end_date ? new Date(expense.end_date) : null;
      
      if (startDate > monthDate) return false;
      if (endDate && endDate < monthDate) return false;
      if (!expense.is_active) return false;
      
      return true;
    })
    .map(expense => {
      const dayOfMonth = Math.min(expense.day_of_month, lastDay);
      return {
        ...expense,
        date: new Date(year, month - 1, dayOfMonth)
      };
    });
};