import React, { useState } from 'react';
import { authAPI, productAPI } from '../services/api';

const TestPage = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:8000/health');
      testResults.health = await healthResponse.json();
    } catch (error) {
      testResults.health = { error: error.message };
    }

    try {
      // Test products endpoint
      const productsResponse = await productAPI.getAllProducts();
      testResults.products = { count: productsResponse.data.products.length, success: true };
    } catch (error) {
      testResults.products = { error: error.message };
    }

    try {
      // Test registration
      const registerResponse = await authAPI.register({
        name: 'Test User Frontend',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone: '1234567890'
      });
      testResults.register = { success: true, user: registerResponse.data.user.name };
    } catch (error) {
      testResults.register = { error: error.message };
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>
      
      <button
        onClick={testBackendConnection}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results:</h2>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Health Check:</h3>
            <pre className="text-sm">{JSON.stringify(results.health, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Products API:</h3>
            <pre className="text-sm">{JSON.stringify(results.products, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Registration API:</h3>
            <pre className="text-sm">{JSON.stringify(results.register, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;