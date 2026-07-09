import React, { useState } from "react";
import { signupStyles } from '../assets/dummyStyles'
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);  //Whether email has @ or not


const Signup = ({ onSignupSuccess = null }) => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  

  // Email validation function also validating name email and password

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const API_BASE = 'http://localhost:4000';

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);

    try {
        const payload = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        };
        const resp = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        let data = null;

        try {
            data = await resp.json();
        } catch (e) {
            // ignore all the errors
        }

        if (!resp.ok) {
            const msg = data?.message || 'Registration failed';
            setSubmitError(msg);
            return;
        }

        if (data?.token) {
            try {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(
                        data.user || { 
                        name: name.trim(),
                        email: email.trim().toLowerCase(), })
                );
            } catch (err) {
                // ignore all the error
            }
        }

        if(typeof onSignupSuccess === "function")
            try {
                onSignupSuccess(
                    data.user || {
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                    }
                )
            } catch (err) {
                
            }

            navigate("/login", { replace: true });

    } catch (err) {
        console.error("Signup error", err);
        setSubmitError("Network Error")
    }   finally{
        setLoading(false);
    }
  }

  return (
    <div className={signupStyles.pageContainer}>
        <Link to='/login' className={signupStyles.backButton}>
            <ArrowLeft className={signupStyles.backButtonIcon} />
            <span className={signupStyles.backButtonText}>Back</span>
        </Link>

        <div className={signupStyles.formContainer}>
            <form onSubmit={handleSubmit}>
                <div className={signupStyles.animatedBorder}>
                    <div className={signupStyles.formContent}>
                        <h2 className={signupStyles.heading}>
                            <span className={signupStyles.headingIcon}>
                                <CheckCircle className={signupStyles.headingIconInner} />
                            </span>
                            <span className={signupStyles.headingText}>Create Account</span>
                        </h2>
                        <p className={signupStyles.subtitle}>
  Create your account to start the Hexagon Quiz.
</p>

{/* Name */}
<label className={signupStyles.label}>
  <span className={signupStyles.labelText}>Name</span>

  <div className={signupStyles.inputContainer}>
    <input
      type="text"
      value={name}
      onChange={(e) => {
        setName(e.target.value);
        if (errors.name) {
          setErrors((s) => ({ ...s, name: undefined }));
        }
      }}
      className={`${signupStyles.input} ${
        errors.name
          ? signupStyles.inputError
          : signupStyles.inputNormal
      }`}
      placeholder="Enter your name"
    />
  </div>

  {errors.name && (
    <p className={signupStyles.errorText}>{errors.name}</p>
  )}
</label>

{/* Email */}
<label className={signupStyles.label}>
  <span className={signupStyles.labelText}>Email</span>

  <div className={signupStyles.inputContainer}>
    <input
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        if (errors.email) {
          setErrors((s) => ({ ...s, email: undefined }));
        }
      }}
      className={`${signupStyles.input} ${
        errors.email
          ? signupStyles.inputError
          : signupStyles.inputNormal
      }`}
      placeholder="Enter your email"
    />
  </div>

  {errors.email && (
    <p className={signupStyles.errorText}>{errors.email}</p>
  )}
</label>

{/* Password */}
<label className={signupStyles.label}>
  <span className={signupStyles.labelText}>Password</span>

  <div className={signupStyles.inputContainer}>
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        if (errors.password) {
          setErrors((s) => ({ ...s, password: undefined }));
        }
      }}
      className={`${signupStyles.input} ${signupStyles.passwordInput} ${
        errors.password
          ? signupStyles.inputError
          : signupStyles.inputNormal
      }`}
      placeholder="Enter your password"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className={signupStyles.passwordToggle}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {errors.password && (
    <p className={signupStyles.errorText}>{errors.password}</p>
  )}
</label>

{submitError && (
  <p className={signupStyles.submitError}>{submitError}</p>
)}

<div className={signupStyles.buttonsContainer}>
  <button
    type="submit"
    disabled={loading}
    className={signupStyles.submitButton}
  >
    {loading ? "Creating Account..." : "Create Account"}
  </button>

  <div className={signupStyles.loginPromptContainer}>
    <div className={signupStyles.loginPromptContent}>
      <span className={signupStyles.loginPromptText}>
        Already have an account?
      </span>

      <Link
        to="/login"
        className={signupStyles.loginPromptLink}
      >
        Login
      </Link>
    </div>
  </div>
</div>

<style>{signupStyles.animations}</style>

                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Signup
