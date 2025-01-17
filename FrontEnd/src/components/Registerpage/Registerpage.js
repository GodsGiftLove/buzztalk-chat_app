import React, { useState } from 'react';
import "./Registerpage.css";
import Footer from '../Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        location: '',
        password: '',
        confirmPassword: '',
        countryCode: '',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const errors = {};

        if (!formData.username) errors.username = 'Username is required';
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        if (!formData.countryCode) errors.countryCode = 'Country code is required';
        if (!formData.phoneNumber || formData.phoneNumber.length < 7) {
            errors.phoneNumber = 'Phone number must be greater than 7 digits';
        }
        if (!formData.location) errors.location = 'Location is required'; // Added location validation

        return errors;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            // Simulate API call
            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),  // Sending the whole formData
                });

                const result = await response.json();

                if (response.ok) {
                    // Save user info to localStorage
                    const user = {
                        username: formData.username,
                        email: formData.email,
                        location: formData.location,
                        countryCode: formData.countryCode,
                        phoneNumber: formData.phoneNumber
                    };

                    localStorage.setItem('user', JSON.stringify(user));
                    alert('Registration successful! Now login.');
                    navigate('/login');
                } else {
                    alert(result.message || 'Registration failed');  // Show error from server response
                }
            } catch (error) {
                alert('An error occurred. Please try again later.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            alert('Please fix the errors in the form.');
        }
    };

    return (
        <>
            <div className="signup-container">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    {errors.location && <p className="error">{errors.location}</p>}  {/* Added error display */}

                    {/* Phone Number Field */}
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <div className="phone-number-container">
                        <input
                            type="text"
                            name="countryCode"
                            placeholder="+1"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="country-code-input"
                        />
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="1234567890"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="phone-number-input"
                        />
                    </div>
                    {errors.countryCode && <p className="error">{errors.countryCode}</p>}
                    {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                    <button type="submit" disabled={isSubmitting}>Sign Up</button> {/* Disabled while submitting */}
                </form>

                <Link to="/login">
                    <p className='Text'>Already have an account? Login</p>
                </Link>
            </div>
            <Footer />
        </>
    );
};

export default RegisterPage;
