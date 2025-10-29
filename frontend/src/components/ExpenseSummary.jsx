import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ExpenseSummary = ({ expenses }) => {
  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }, [expenses]);

  // Calculate category-wise expenses
  const categoryExpenses = useMemo(() => {
    const categories = {};
    
    expenses.forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    
    // Convert to array for chart
    return Object.keys(categories).map(category => ({
      name: category,
      value: categories[category]
    }));
  }, [expenses]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF', '#B3B3B3'];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
      
      <div className="mb-4">
        <div className="text-gray-600 mb-1">Total Expenses</div>
        <div className="text-2xl font-bold text-blue-600">${totalExpenses.toFixed(2)}</div>
      </div>
      
      {expenses.length > 0 && (
        <>
          <h3 className="text-lg font-medium mb-2">Category Breakdown</h3>
          <div className="space-y-2 mb-4">
            {categoryExpenses.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{item.name}</span>
                </div>
                <div className="font-medium">${item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          {/* Chart */}
          {categoryExpenses.length > 0 && (
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseSummary;