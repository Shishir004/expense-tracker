import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import Login from './components/Login';
import Register from './components/Register';

const API_URL = 'https://expense-tracker-2-g8kd.onrender.com/api/expenses';;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [filterCategory, setFilterCategory] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const name = localStorage.getItem('userName');
    
    if (token && name) {
      setUser({ name, token });
    }
  }, []);

  // Set auth headers
  const setAuthHeader = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setAuthHeader();
      const response = await axios.get(API_URL);
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add expense
  const addExpense = async (expense) => {
    try {
      setAuthHeader();
      const response = await axios.post(API_URL, expense);
      setExpenses([response.data, ...expenses]);
    } catch (err) {
      setError('Failed to add expense');
      console.error(err);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      setAuthHeader();
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      setError('Failed to delete expense');
      console.error(err);
    }
  };

  // Update expense
  const updateExpense = async (id, updatedExpense) => {
    try {
      setAuthHeader();
      const response = await axios.put(`${API_URL}/${id}`, updatedExpense);
      setExpenses(expenses.map(expense => 
        expense._id === id ? response.data : expense
      ));
      setEditExpense(null);
    } catch (err) {
      setError('Failed to update expense');
      console.error(err);
    }
  };

  // Set expense to edit
  const handleEdit = (expense) => {
    setEditExpense(expense);
  };

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle register
  const handleRegister = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    setUser(null);
    setExpenses([]);
  };

  // Toggle auth mode
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  // Filter expenses by category
  const filteredExpenses = filterCategory 
    ? expenses.filter(expense => expense.category === filterCategory)
    : expenses;

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Expense Tracker</h1>
          
          {authMode === 'login' ? (
            <>
              <Login onLogin={handleLogin} />
              <p className="text-center mt-4 text-gray-600">
                Don't have an account?{' '}
                <button 
                  className="text-blue-500 hover:text-blue-700"
                  onClick={toggleAuthMode}
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <Register onRegister={handleRegister} />
              <p className="text-center mt-4 text-gray-600">
                Already have an account?{' '}
                <button 
                  className="text-blue-500 hover:text-blue-700"
                  onClick={toggleAuthMode}
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Expense Tracker</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.name}</span>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filter by Category:
          </label>
          <select
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Housing">Housing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ExpenseForm 
                addExpense={addExpense} 
                editExpense={editExpense}
                updateExpense={updateExpense}
              />
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <ExpenseSummary expenses={expenses} />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {loading ? (
                <p className="text-center text-gray-500">Loading expenses...</p>
              ) : filteredExpenses.length === 0 ? (
                <p className="text-center text-gray-500">
                  {filterCategory ? `No expenses found in ${filterCategory} category.` : 'No expenses found. Add one!'}
                </p>
              ) : (
                <ExpenseList 
                  expenses={filteredExpenses} 
                  onDelete={deleteExpense}
                  onEdit={handleEdit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
