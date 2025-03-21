import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://attendance-management-w98q.onrender.com/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login Successful!');
                navigate('/dashboard');
                // Redirect or save token here
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Admin Login</h1>
                    <p>Enter your credentials to access the dashboard</p>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
            
            <style jsx>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    padding: 20px;
                }
                
                .login-card {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 450px;
                    padding: 40px;
                    transition: transform 0.3s ease;
                }
                
                .login-card:hover {
                    transform: translateY(-5px);
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .login-header h1 {
                    color: #333;
                    margin-bottom: 10px;
                    font-weight: 600;
                }
                
                .login-header p {
                    color: #777;
                    font-size: 16px;
                }
                
                .login-form {
                    display: flex;
                    flex-direction: column;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: border-color 0.3s;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #2575fc;
                    box-shadow: 0 0 0 2px rgba(37, 117, 252, 0.2);
                }
                
                .error-message {
                    background-color: #ffebee;
                    color: #d32f2f;
                    padding: 10px 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    border-left: 4px solid #d32f2f;
                }
                
                .login-button {
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .login-button:hover {
                    background: linear-gradient(135deg, #5709a8 0%, #1d5dc9 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(37, 117, 252, 0.3);
                }
                
                @media (max-width: 600px) {
                    .login-card {
                        padding: 30px 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
