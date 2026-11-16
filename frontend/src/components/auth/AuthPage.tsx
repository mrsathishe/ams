"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./auth.css";

interface AuthPageProps {
  defaultTab?: "login" | "register";
}

export default function AuthPage({ defaultTab = "login" }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const isRegistering = activeTab === "register";

  return (
    <div className="auth-page-wrapper">
      <div className="auth-form-container">
        <div className="text-center">
          <p className="title1">Kootukudil</p>
          <h2 className="title2">
            {isRegistering ? "Create your account" : "Welcome back"}
          </h2>
          <p className="subtitle">Apartment management</p>
        </div>

        <div className="auth-tab-wrapper" role="tablist">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`auth-tab-button ${
                activeTab === tab ? "active" : "not-active"
              }`}
            >
              {tab === "login" ? "Log in" : "Register"}
            </button>
          ))}
        </div>

        {isRegistering ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
