import { Component, useState } from "react";
import Dashboard from "./Dashboard";
import OnboardingWizard from "../components/OnboardingWizard";

const ONBOARDING_KEY = "tenant_onboarding_done_v1";

function safeGetOnboardingDone(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return true;
  }
}

function safePersistOnboardingDone() {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // If storage is blocked, we silently continue and keep app usable.
  }
}

class OnboardingErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow onboarding errors and fallback to dashboard.
  }

  render() {
    if (this.state.hasError) {
      return <Dashboard />;
    }
    return this.props.children;
  }
}

export default function OnboardingEntry() {
  const [isDone, setIsDone] = useState(() => safeGetOnboardingDone());

  if (isDone) {
    return <Dashboard />;
  }

  return (
    <OnboardingErrorBoundary>
      <OnboardingWizard
        onSkip={() => {
          safePersistOnboardingDone();
          setIsDone(true);
        }}
        onFinish={() => {
          safePersistOnboardingDone();
          setIsDone(true);
        }}
      />
    </OnboardingErrorBoundary>
  );
}
